import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  points: number; // Max requests
  duration: number; // Time window in seconds
  errorMessage?: string;
}

export const RATE_LIMIT_KEY = 'RATE_LIMIT_OPTIONS';

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
