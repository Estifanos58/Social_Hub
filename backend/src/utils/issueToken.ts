import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAccessTokenSecret, getRefreshTokenSecret } from './security';

export const ACCESS_TOKEN_EXPIRES_AT = '1h';
export const REFRESH_TOKEN_EXPIRES_AT = '15d';

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const issueToken = async (
  user: User,
  jwtService: JwtService,
  configService: ConfigService,
  response?: Response,
  prisma?: PrismaService,
) => {
  const payload = {
    sub: user.id,
    email: user.email,
    firstname: user.firstname,
  };

  const accessTokenSecret = getAccessTokenSecret(configService);
  const refreshTokenSecret = getRefreshTokenSecret(configService);

  const accessToken = jwtService.sign(payload, {
    secret: accessTokenSecret,
    expiresIn: ACCESS_TOKEN_EXPIRES_AT,
  });

  const refreshToken = jwtService.sign(payload, {
    secret: refreshTokenSecret,
    expiresIn: REFRESH_TOKEN_EXPIRES_AT,
  });

  if (prisma) {
    const hashed = hashRefreshToken(refreshToken);
    await prisma.credential.updateMany({
      where: { userId: user.id },
      data: { refreshToken: hashed },
    });
  }

  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  if (response && typeof response.cookie === 'function') {
    const baseCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
    };

    response.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    response.cookie('accessToken', accessToken, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  return { user, accessToken, refreshToken };
};
