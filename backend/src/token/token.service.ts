import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

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
    const accessSecret =
      this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
      'default_access_secret_for_dev';
    try {
      return verify(token, accessSecret);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): any {
    const refreshSecret =
      this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
      'default_refresh_secret_for_dev';
    try {
      return verify(token, refreshSecret);
    } catch {
      return null;
    }
  }

  // Backwards compatibility alias
  validateToken(token: string): any {
    return this.validateAccessToken(token) || this.validateRefreshToken(token);
  }
}
