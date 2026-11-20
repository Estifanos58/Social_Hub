import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from 'src/utils/security';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private configService: ConfigService) {}

  extractToken(connectionParams: any): string | null {
    if (!connectionParams) return null;

    const authHeader =
      connectionParams.Authorization ||
      connectionParams.authorization ||
      connectionParams.token ||
      connectionParams['x-access-token'];

    if (typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
      }
      return authHeader.trim();
    }

    return null;
  }

  validateAccessToken(token: string): any {
    try {
      const accessSecret = getAccessTokenSecret(this.configService);
      return verify(token, accessSecret);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): any {
    try {
      const refreshSecret = getRefreshTokenSecret(this.configService);
      return verify(token, refreshSecret);
    } catch {
      return null;
    }
  }

  // ONLY validates access token. Never accepts refresh tokens for general authentication.
  validateToken(token: string): any {
    return this.validateAccessToken(token);
  }
}
