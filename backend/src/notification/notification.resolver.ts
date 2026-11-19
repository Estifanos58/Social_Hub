import { UseGuards } from '@nestjs/common';
import { Query, Mutation, Resolver, Args, Context, Int } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GraphQLAuthGuard } from 'src/common/guards/graphql-auth.guard';
import { Request } from 'express';
import { NotificationDto } from 'src/types';
import { GetNotificationsQuery } from './query/getNotifications.query';
import { GetUnreadCountQuery } from './query/getUnreadCount.query';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(GraphQLAuthGuard)
  @Query(() => [NotificationDto])
  async notifications(
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('cursor', { nullable: true }) cursor: string,
    @Context() context: { req: Request },
  ) {
    const userId = context.req.user?.sub!;
    return this.queryBus.execute(
      new GetNotificationsQuery(userId, take, cursor),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Query(() => Int)
  async unreadNotificationsCount(@Context() context: { req: Request }) {
    const userId = context.req.user?.sub!;
    return this.queryBus.execute(new GetUnreadCountQuery(userId));
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async markNotificationAsRead(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    await this.notificationService.markAsRead(id, userId);
    return true;
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    await this.notificationService.markAllAsRead(userId);
    return true;
  }
}
