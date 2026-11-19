import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GraphQLAuthGuard } from 'src/common/guards/graphql-auth.guard';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: CommandBus, useValue: { execute: jest.fn() } },
        { provide: QueryBus, useValue: { execute: jest.fn() } },
        {
          provide: PrismaService,
          useValue: {
            credential: {
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn(), sign: jest.fn() },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    })
      .overrideGuard(GraphQLAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RateLimitGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
