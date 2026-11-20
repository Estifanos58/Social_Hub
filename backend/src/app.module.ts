import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TokenService } from './token/token.service';
import * as cookie from 'cookie';
import { Request, Response } from 'express';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { redisPubSub } from './pubsub';
import { ChatroomModule } from './chatroom/chatroom.module';
import { UserDisconnectedEvent } from './user/event';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    TokenModule,
    MailModule,
    UserModule,
    PostModule,
    CommentModule,
    NotificationModule,
    MessageModule,
    ChatroomModule,
    EventEmitterModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AuthModule, TokenModule],
      inject: [ConfigService, TokenService, EventEmitter2],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        tokenService: TokenService,
        eventEmitter: EventEmitter2,
      ) => {
        return {
          autoSchemaFile:
            configService.get<string>('NODE_ENV') === 'production'
              ? true
              : join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: configService.get<string>('NODE_ENV') !== 'production',

          subscriptions: {
            'graphql-ws': {
              onConnect: async (context) => {
                const { connectionParams, extra } = context;
                const req = extra?.request;

                // 1. Check connectionParams (Authorization Bearer / token)
                const paramToken = tokenService.extractToken(connectionParams);
                let user = paramToken
                  ? tokenService.validateAccessToken(paramToken)
                  : null;

                // 2. If not found or invalid in params, check cookies from upgrade request
                // NOTE: Never accept refresh tokens for WebSocket connections
                if (!user && req?.headers?.cookie) {
                  const parsedCookies = cookie.parse(req.headers.cookie);
                  const cookieToken =
                    parsedCookies['accessToken'] ??
                    parsedCookies['access_token'];
                  if (cookieToken) {
                    user = tokenService.validateAccessToken(cookieToken);
                  }
                }

                if (!user) {
                  throw new Error(
                    'Authentication required for WebSocket connection',
                  );
                }

                const userId = user?.sub ?? user?.id;
                if (!userId) {
                  throw new Error('Authenticated user does not include an id');
                }

                extra.user = user;
                extra.userId = userId;

                await redisPubSub.publish(`userOnline.${userId}`, {
                  userOnline: {
                    userId,
                    isOnline: true,
                    lastSeenAt: null,
                  },
                });

                return { user, userId };
              },
              onDisconnect: async (context) => {
                const { extra } = context as {
                  extra: {
                    user?: { sub?: string; id?: string };
                    userId?: string;
                  };
                };

                const userId =
                  extra?.user?.sub ?? extra?.user?.id ?? extra?.userId;
                if (!userId) {
                  return;
                }

                const disconnectedAt = new Date();

                await redisPubSub.publish(`userDisconnect.${userId}`, {
                  userDisconnect: {
                    userId,
                    isOnline: false,
                    lastSeenAt: disconnectedAt,
                  },
                });

                eventEmitter.emit(
                  'user.disconnected',
                  new UserDisconnectedEvent(userId, disconnectedAt),
                );
              },
            },
          },

          context: ({
            req,
            res,
            extra,
          }: {
            req?: Request;
            res?: Response;
            extra?: any;
          }) => {
            const subscriptionUser = extra?.user;
            const subscriptionUserId =
              extra?.userId ?? extra?.user?.sub ?? extra?.user?.id;
            return {
              req,
              res,
              user: (req as any)?.user ?? subscriptionUser,
              userId: (req as any)?.user?.sub ?? subscriptionUserId,
              pubSub: redisPubSub,
            };
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
