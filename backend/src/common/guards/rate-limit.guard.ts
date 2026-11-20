import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!options) {
      return true;
    }

    const isGql =
      typeof context.getType === 'function' &&
      context.getType<string>() === 'graphql';
    const gqlCtx = isGql
      ? GqlExecutionContext.create(context).getContext()
      : null;
    const req: Request =
      gqlCtx?.req ??
      (typeof context.switchToHttp === 'function'
        ? context.switchToHttp().getRequest()
        : null);

    // Correctly resolve client IP respecting trusted reverse proxies
    const clientIp =
      req?.ip ||
      (Array.isArray((req as any)?.ips) && (req as any).ips.length > 0
        ? (req as any).ips[0]
        : null) ||
      req?.headers?.['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req?.socket?.remoteAddress ||
      'anonymous';

    const userId = (req as any)?.user?.sub || (req as any)?.user?.id || 'anon';
    const handlerName = context.getHandler().name;
    const key = `ratelimit:${handlerName}:${userId}:${clientIp}`;

    try {
      const client = this.redisService.getClient();
      const pipeline = client.pipeline();
      pipeline.incr(key);
      pipeline.ttl(key);
      const results = await pipeline.exec();

      if (results && results[0] && results[1]) {
        const [incrErr, countResult] = results[0];
        const [ttlErr, ttlResult] = results[1];

        if (incrErr) throw incrErr;

        const count = countResult as number;
        let ttl = ttlResult as number;

        // If key is newly created or missing expiry, set TTL
        if (count === 1 || ttl === -1) {
          await client.expire(key, options.duration);
          ttl = options.duration;
        }

        if (count > options.points) {
          const waitSeconds = ttl > 0 ? ttl : options.duration;
          throw new HttpException(
            options.errorMessage ||
              `Too many requests. Please wait ${waitSeconds} seconds before retrying.`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.warn(
        `Redis rate limiting unavailable (${error?.message}). Allowing request.`,
      );
      return true;
    }
  }
}
