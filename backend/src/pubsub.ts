import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';
import { Logger } from '@nestjs/common';

const logger = new Logger('RedisPubSub');

const createRedisClient = (type: 'publisher' | 'subscriber') => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const isTlsExplicit = process.env.REDIS_TLS === 'true';
  const isRedissScheme = redisUrl.startsWith('rediss://');
  const enableTls = isTlsExplicit || isRedissScheme;

  const options: RedisOptions = {
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      logger.warn(
        `Redis (${type}) reconnecting in ${delay}ms (attempt ${times})`,
      );
      return delay;
    },
    lazyConnect: true,
  };

  if (enableTls) {
    options.tls = {
      rejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false',
    };
  }

  const client = new Redis(redisUrl, options);

  client.on('connect', () => {
    logger.log(`Redis (${type}) connected successfully`);
  });

  client.on('error', (err) => {
    logger.error(`Redis (${type}) error: ${err.message}`);
  });

  // Attempt connection gracefully without crashing process
  client.connect().catch((err) => {
    logger.error(`Initial Redis (${type}) connection error: ${err.message}`);
  });

  return client;
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/;

const reviveDates = (_key: unknown, value: unknown) => {
  if (typeof value === 'string' && isoDateRegex.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
};

const publisher = createRedisClient('publisher');
const subscriber = createRedisClient('subscriber');

export const redisPubSub = new RedisPubSub({
  publisher,
  subscriber,
  reviver: reviveDates,
});
