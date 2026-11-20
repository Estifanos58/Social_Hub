import { ConfigService } from '@nestjs/config';

const INSECURE_SECRETS = new Set([
  'default_access_secret_for_dev',
  'default_refresh_secret_for_dev',
  'change_in_production_access_secret_32_chars_minimum',
  'change_in_production_refresh_secret_32_chars_minimum',
  'secret',
  'jwt_secret',
]);

export function getAccessTokenSecret(configService: ConfigService): string {
  const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  if (!secret || INSECURE_SECRETS.has(secret) || secret.length < 32) {
    if (isProd) {
      throw new Error(
        'CRITICAL: ACCESS_TOKEN_SECRET is missing or insecure in production. Must be at least 32 characters and not use default placeholders.',
      );
    }
    // In test/dev environment, warn if using fallback or weak secret
    return (
      secret || 'dev_test_access_token_secret_must_be_32_characters_long_min'
    );
  }

  return secret;
}

export function getRefreshTokenSecret(configService: ConfigService): string {
  const secret = configService.get<string>('REFRESH_TOKEN_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  if (!secret || INSECURE_SECRETS.has(secret) || secret.length < 32) {
    if (isProd) {
      throw new Error(
        'CRITICAL: REFRESH_TOKEN_SECRET is missing or insecure in production. Must be at least 32 characters and not use default placeholders.',
      );
    }
    return (
      secret || 'dev_test_refresh_token_secret_must_be_32_characters_long_min'
    );
  }

  return secret;
}

export function validateProductionEnvironment(
  configService: ConfigService,
): void {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!isProd) return;

  const requiredVariables = [
    'DATABASE_URL',
    'REDIS_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
  ];

  for (const varName of requiredVariables) {
    const val = configService.get<string>(varName);
    if (!val || val.trim() === '') {
      throw new Error(
        `CRITICAL: Required environment variable "${varName}" is missing in production mode.`,
      );
    }
    if (INSECURE_SECRETS.has(val)) {
      throw new Error(
        `CRITICAL: Environment variable "${varName}" cannot use an insecure default value in production.`,
      );
    }
  }

  // Validate secret lengths
  getAccessTokenSecret(configService);
  getRefreshTokenSecret(configService);
}
