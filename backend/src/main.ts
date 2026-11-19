import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe, Logger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const clientUrl = process.env.CLIENT_URL;
  const allowedOrigins = [
    clientUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter((origin): origin is string => Boolean(origin));

  // Basic security headers middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '0');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    }
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'x-apollo-operation-name',
      'x-refresh-token',
      'X-Refresh-Token',
      'x-access-token',
      'X-Access-Token',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['x-access-token', 'x-refresh-token'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = error.constraints
            ? Object.values(error.constraints).join(', ')
            : '';
          return accumulator;
        }, {});

        throw new BadRequestException(formattedErrors);
      },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  logger.log(`Social_Hub Backend listening on port ${port}`);
}
bootstrap();
