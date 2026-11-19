import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

interface MemoryBucket {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryBucket>();

// Periodic cleanup of stale memory bucket entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of memoryStore.entries()) {
      if (bucket.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
).unref();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!options) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const req: Request = gqlCtx?.req ?? context.switchToHttp().getRequest();

    const clientIp =
      req?.headers?.['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req?.socket?.remoteAddress ||
      'anonymous';

    const userId = (req as any)?.user?.sub || (req as any)?.user?.id || 'anon';
    const handlerName = context.getHandler().name;
    const key = `ratelimit:${handlerName}:${userId}:${clientIp}`;

    const now = Date.now();
    const windowMs = options.duration * 1000;
    const bucket = memoryStore.get(key);

    if (!bucket || bucket.resetAt <= now) {
      memoryStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (bucket.count >= options.points) {
      const waitSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      throw new HttpException(
        options.errorMessage ||
          `Too many requests. Please wait ${waitSeconds} seconds before retrying.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    bucket.count += 1;
    return true;
  }
}
