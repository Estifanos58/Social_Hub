import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

describe('TokenService & WebSocket Auth Validation', () => {
  let tokenService: TokenService;
  let configService: ConfigService;

  const validAccessSecret =
    'this_is_a_secure_access_token_secret_32_chars_long';
  const validRefreshSecret =
    'this_is_a_secure_refresh_token_secret_32_chars_long';

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'ACCESS_TOKEN_SECRET') return validAccessSecret;
        if (key === 'REFRESH_TOKEN_SECRET') return validRefreshSecret;
        if (key === 'NODE_ENV') return 'test';
        return undefined;
      }),
    } as any;

    tokenService = new TokenService(configService);
  });

  it('validates a legitimate access token', () => {
    const payload = { sub: 'user-1', email: 'test@example.com' };
    const token = sign(payload, validAccessSecret, { expiresIn: '1h' });

    const decoded = tokenService.validateAccessToken(token);
    expect(decoded).toMatchObject(payload);
  });

  it('REJECTS a refresh token when validating access tokens (WebSocket security requirement)', () => {
    const payload = { sub: 'user-1', email: 'test@example.com' };
    // Signed with refresh secret, not access secret
    const refreshToken = sign(payload, validRefreshSecret, {
      expiresIn: '15d',
    });

    const accessValidation = tokenService.validateAccessToken(refreshToken);
    expect(accessValidation).toBeNull();

    // validateToken MUST NOT accept refresh tokens
    const generalValidation = tokenService.validateToken(refreshToken);
    expect(generalValidation).toBeNull();
  });

  it('extracts Bearer token correctly from various connectionParams formats', () => {
    expect(
      tokenService.extractToken({ Authorization: 'Bearer my-token-123' }),
    ).toBe('my-token-123');

    expect(
      tokenService.extractToken({ authorization: 'Bearer my-token-456' }),
    ).toBe('my-token-456');

    expect(tokenService.extractToken({ token: 'raw-token-789' })).toBe(
      'raw-token-789',
    );

    expect(tokenService.extractToken(null)).toBeNull();
  });
});
