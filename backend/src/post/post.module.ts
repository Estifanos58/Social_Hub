import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  AddReactionHandler,
  CreatePostHandler,
  DeletePostHandler,
  GetPostHandler,
  GetPostsHandler,
  RemoveReactionHandler,
  EditPostHandler,
  SavePostHandler,
  UnsavePostHandler,
  ReportPostHandler,
  NotInterestedPostHandler,
} from './handler';
import { NotificationModule } from 'src/notification/notification.module';
import { PostReactionEventHandler } from './event/postReaction.event.handler';
import { PostDeletedEventHandler } from './event/postDeleted.event.handler';

const CommandHandlers = [
  CreatePostHandler,
  DeletePostHandler,
  AddReactionHandler,
  RemoveReactionHandler,
  EditPostHandler,
  SavePostHandler,
  UnsavePostHandler,
  ReportPostHandler,
  NotInterestedPostHandler,
];
const QueryHandler = [GetPostsHandler, GetPostHandler];
@Module({
  imports: [CqrsModule, ConfigModule, NotificationModule],
  providers: [
    PostResolver,
    JwtService,
    ...CommandHandlers,
    ...QueryHandler,
    PostReactionEventHandler,
    PostDeletedEventHandler,
  ],
})
export class PostModule {}
