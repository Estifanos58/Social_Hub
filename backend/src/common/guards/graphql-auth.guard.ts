import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { issueToken, hashRefreshToken } from 'src/utils/issueToken';
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from 'src/utils/security';

@Injectable()
export class GraphQLAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const request: Request = gqlCtx?.req ?? context.switchToHttp().getRequest();
    const response: Response | undefined =
      gqlCtx?.res ?? context.switchToHttp().getResponse();

    if (!request) {
      throw new UnauthorizedException('Request context not found');
    }

    const authHeader = request.headers?.['authorization'];
    const headerAccessToken =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : undefined;

    const headerRefreshToken = (request.headers?.['x-refresh-token'] ||
      request.headers?.['refresh-token']) as string | undefined;

    const renewSessionWithRefresh = async (
      refreshToken: string,
    ): Promise<boolean> => {
      try {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: getRefreshTokenSecret(this.configService),
        });

        const userId = payload?.sub;
        if (!userId) {
          throw new UnauthorizedException('Invalid token payload');
        }

        const userWithCredential = await this.prismaService.user.findUnique({
          where: { id: userId },
          include: { credential: true },
        });

        if (!userWithCredential || !userWithCredential.credential) {
          throw new UnauthorizedException('User not found');
        }

        const storedHashedToken = userWithCredential.credential.refreshToken;
        const currentTokenHash = hashRefreshToken(refreshToken);

        // Refresh token rotation validation
        if (!storedHashedToken || storedHashedToken !== currentTokenHash) {
          // Invalidate stored refresh token on token reuse attempt
          await this.prismaService.credential.updateMany({
            where: { userId },
            data: { refreshToken: null },
          });

          if (response && typeof response.clearCookie === 'function') {
            const isProd =
              this.configService.get<string>('NODE_ENV') === 'production';
            const clearOpts = {
              httpOnly: true,
              secure: isProd,
              sameSite: isProd ? ('none' as const) : ('lax' as const),
              path: '/',
            };
            response.clearCookie('accessToken', clearOpts);
            response.clearCookie('refreshToken', clearOpts);
          }

          throw new UnauthorizedException(
            'Refresh token is invalid or has been revoked',
          );
        }

        const { accessToken, refreshToken: newRefreshToken } = await issueToken(
          userWithCredential,
          this.jwtService,
          this.configService,
          response,
          this.prismaService,
        );

        if (response && typeof response.setHeader === 'function') {
          response.setHeader('x-access-token', accessToken);
          response.setHeader('x-refresh-token', newRefreshToken);
        }

        request['user'] = {
          sub: userWithCredential.id,
          email: userWithCredential.email,
          firstname: userWithCredential.firstname,
        };

        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        throw new UnauthorizedException('Unable to renew session');
      }
    };

    // 1. Try Bearer token from header
    if (headerAccessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(headerAccessToken, {
          secret: getAccessTokenSecret(this.configService),
        });

        request['user'] = payload;
        return true;
      } catch {
        if (headerRefreshToken) {
          return renewSessionWithRefresh(headerRefreshToken);
        }
      }
    }

    // 2. Try access token from cookies
    const cookieAccessToken =
      request.cookies?.accessToken ?? request.cookies?.access_token;
    if (cookieAccessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(cookieAccessToken, {
          secret: getAccessTokenSecret(this.configService),
        });

        request['user'] = payload;
        return true;
      } catch {
        // Fall through to refresh token
      }
    }

    // 3. Try header refresh token
    if (headerRefreshToken) {
      return renewSessionWithRefresh(headerRefreshToken);
    }

    // 4. Try cookie refresh token
    const cookieRefreshToken =
      request.cookies?.refreshToken ?? request.cookies?.refresh_token;
    if (cookieRefreshToken) {
      return renewSessionWithRefresh(cookieRefreshToken);
    }

    throw new UnauthorizedException('Authentication required');
  }
}
