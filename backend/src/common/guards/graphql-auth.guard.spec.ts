import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GraphQLAuthGuard } from './graphql-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashRefreshToken } from 'src/utils/issueToken';

describe('GraphQLAuthGuard', () => {
  let guard: GraphQLAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let prismaService: any;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
      sign: jest.fn(),
    } as any;

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'ACCESS_TOKEN_SECRET') return 'test_access_secret';
        if (key === 'REFRESH_TOKEN_SECRET') return 'test_refresh_secret';
        return null;
      }),
    } as any;

    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
      credential: {
        updateMany: jest.fn(),
        update: jest.fn(),
      },
    };

    guard = new GraphQLAuthGuard(
      jwtService,
      configService,
      prismaService as PrismaService,
    );
  });

  const createMockContext = (req: any, res: any = {}): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: () => [{}, {}, { req, res }, {}],
      getArgByIndex: (i: number) => [{}, {}, { req, res }, {}][i],
      switchToRpc: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => req,
        getResponse: () => res,
      }),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
    } as unknown as ExecutionContext;
  };

  it('should authenticate successfully with a valid Bearer token', async () => {
    const userPayload = {
      sub: 'user-1',
      email: 'test@example.com',
      firstname: 'Test',
    };
    jwtService.verifyAsync.mockResolvedValueOnce(userPayload);

    const req: any = {
      headers: {
        authorization: 'Bearer valid_token',
      },
      cookies: {},
    };
    const ctx = createMockContext(req);

    const canActivate = await guard.canActivate(ctx);

    expect(canActivate).toBe(true);
    expect(req.user).toEqual(userPayload);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid_token', {
      secret: 'test_access_secret',
    });
  });

  it('should renew session with a valid refresh token when access token is expired', async () => {
    const rawRefreshToken = 'valid_refresh_token';
    const hashedToken = hashRefreshToken(rawRefreshToken);
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      firstname: 'Test',
      credential: {
        refreshToken: hashedToken,
      },
    };

    // First call for access token throws (expired), second call for refresh token resolves
    jwtService.verifyAsync
      .mockRejectedValueOnce(new Error('jwt expired'))
      .mockResolvedValueOnce({ sub: 'user-1' });

    jwtService.sign
      .mockReturnValueOnce('new_access_token')
      .mockReturnValueOnce('new_refresh_token');

    prismaService.user.findUnique.mockResolvedValueOnce(mockUser);
    prismaService.credential.updateMany.mockResolvedValueOnce({ count: 1 });

    const req: any = {
      headers: {
        authorization: 'Bearer expired_token',
        'x-refresh-token': rawRefreshToken,
      },
      cookies: {},
    };
    const res: any = {
      setHeader: jest.fn(),
      cookie: jest.fn(),
    };
    const ctx = createMockContext(req, res);

    const canActivate = await guard.canActivate(ctx);

    expect(canActivate).toBe(true);
    expect(req.user).toEqual({
      sub: 'user-1',
      email: 'test@example.com',
      firstname: 'Test',
    });
    expect(res.setHeader).toHaveBeenCalledWith(
      'x-access-token',
      'new_access_token',
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'x-refresh-token',
      'new_refresh_token',
    );
  });

  it('should detect refresh token reuse / tampering and revoke session', async () => {
    const rawRefreshToken = 'tampered_refresh_token';
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      firstname: 'Test',
      credential: {
        refreshToken: 'different_hash_in_db',
      },
    };

    jwtService.verifyAsync.mockResolvedValueOnce({ sub: 'user-1' });
    prismaService.user.findUnique.mockResolvedValueOnce(mockUser);

    const req: any = {
      headers: {
        'x-refresh-token': rawRefreshToken,
      },
      cookies: {},
    };
    const res: any = {
      clearCookie: jest.fn(),
    };
    const ctx = createMockContext(req, res);

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('Refresh token is invalid or has been revoked'),
    );

    // Stored token should be invalidated in database
    expect(prismaService.credential.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data: { refreshToken: null },
    });
    expect(res.clearCookie).toHaveBeenCalledWith(
      'accessToken',
      expect.any(Object),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.any(Object),
    );
  });

  it('should throw UnauthorizedException when no tokens are provided', async () => {
    const req: any = {
      headers: {},
      cookies: {},
    };
    const ctx = createMockContext(req);

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('Authentication required'),
    );
  });
});
