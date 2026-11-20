import { RateLimitGuard } from './rate-limit.guard';
import { Reflector } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RateLimitGuard (Redis-backed)', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;
  let redisService: any;
  let mockPipeline: any;
  let mockRedisClient: any;

  beforeEach(() => {
    mockPipeline = {
      incr: jest.fn().mockReturnThis(),
      ttl: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockRedisClient = {
      pipeline: jest.fn(() => mockPipeline),
      expire: jest.fn().mockResolvedValue(1),
    };

    redisService = {
      getClient: jest.fn(() => mockRedisClient),
    };

    reflector = {
      get: jest.fn(),
    } as any;

    guard = new RateLimitGuard(reflector, redisService);
  });

  const createMockContext = (ip: string, userId = 'user-1') => {
    return {
      getType: () => 'http',
      getHandler: () => ({ name: 'testHandler' }),
      switchToHttp: () => ({
        getRequest: () => ({
          ip,
          headers: {},
          user: { sub: userId },
        }),
      }),
    } as any;
  };

  it('allows request when within rate limit threshold', async () => {
    (reflector.get as jest.Mock).mockReturnValue({
      points: 5,
      duration: 60,
    });

    // Mock pipeline returns [count, ttl] -> count = 1, ttl = 60
    mockPipeline.exec.mockResolvedValueOnce([
      [null, 1],
      [null, 60],
    ]);

    const context = createMockContext('192.168.1.1');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRedisClient.expire).toHaveBeenCalledWith(
      'ratelimit:testHandler:user-1:192.168.1.1',
      60,
    );
  });

  it('throws TOO_MANY_REQUESTS when limit is exceeded', async () => {
    (reflector.get as jest.Mock).mockReturnValue({
      points: 5,
      duration: 60,
    });

    // Mock pipeline returns count = 6 (exceeded), ttl = 45
    mockPipeline.exec.mockResolvedValueOnce([
      [null, 6],
      [null, 45],
    ]);

    const context = createMockContext('192.168.1.1');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new HttpException(
        'Too many requests. Please wait 45 seconds before retrying.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('gracefully allows request if Redis experiences an error', async () => {
    (reflector.get as jest.Mock).mockReturnValue({
      points: 5,
      duration: 60,
    });

    mockPipeline.exec.mockRejectedValueOnce(new Error('Connection lost'));

    const context = createMockContext('192.168.1.1');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});
