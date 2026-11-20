import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from './user.resolver';
import {
  FollowUserHandler,
  GetChatUsersHandler,
  GetFollowersHandler,
  GetFollowingHandler,
  GetUserChatroomsHandler,
  GetUserHandler,
  GetUsersToFollowHandler,
  SearchUsersHandler,
  UnFollowUserHandler,
  UpdateUserHandler,
  AcceptFollowRequestHandler,
  RejectFollowRequestHandler,
  CancelFollowRequestHandler,
  GetPendingFollowRequestsHandler,
} from './handlers';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { NewFollowerEventHandler, UserDisconnectedEventHandler } from './event';

const CommandHandlers = [
  FollowUserHandler,
  UnFollowUserHandler,
  UpdateUserHandler,
  AcceptFollowRequestHandler,
  RejectFollowRequestHandler,
  CancelFollowRequestHandler,
];
const EventHandlers = [NewFollowerEventHandler, UserDisconnectedEventHandler];
const QueryHandlers = [
  GetUserHandler,
  GetUsersToFollowHandler,
  GetFollowersHandler,
  GetFollowingHandler,
  SearchUsersHandler,
  GetChatUsersHandler,
  GetUserChatroomsHandler,
  GetPendingFollowRequestsHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule, NotificationModule],
  providers: [
    UserResolver,
    JwtService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class UserModule {}
