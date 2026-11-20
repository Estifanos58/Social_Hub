import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    const isTlsExplicit =
      this.configService.get<string>('REDIS_TLS') === 'true';
    const isRedissScheme = redisUrl.startsWith('rediss://');
    const enableTls = isTlsExplicit || isRedissScheme;

    const options: RedisOptions = {
      retryStrategy: (times) => {
        const delay = Math.min(times * 150, 3000);
        return delay;
      },
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    };

    if (enableTls) {
      options.tls = {
        rejectUnauthorized:
          this.configService.get<string>('REDIS_TLS_REJECT_UNAUTHORIZED') !==
          'false',
      };
    }

    this.client = new Redis(redisUrl, options);

    this.client.on('connect', () => {
      this.logger.log('Redis client connected successfully');
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis client error: ${err.message}`);
    });

    this.client.connect().catch((err) => {
      this.logger.warn(`Initial Redis connection attempt: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
    }
  }

  getClient(): Redis {
    if (!this.client) {
      this.onModuleInit();
    }
    return this.client!;
  }
}
