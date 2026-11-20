import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FollowUserCommand } from '../commands/FollowUserCommand';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewFollowerEvent } from '../event/newFollower.event';
import { NotificationService } from 'src/notification/notification.service';

@CommandHandler(FollowUserCommand)
export class FollowUserHandler implements ICommandHandler<FollowUserCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: FollowUserCommand): Promise<string> {
    const { userId, followingId } = command;

    try {
      if (userId === followingId) {
        throw new BadRequestException('You cannot follow yourself');
      }

      const follower = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!follower) throw new NotFoundException('Follower not found');

      const following = await this.prismaService.user.findUnique({
        where: { id: followingId },
      });
      if (!following) throw new NotFoundException('Following user not found');

      const existingFollow = await this.prismaService.follower.findUnique({
        where: {
          followerId_followingId: { followerId: userId, followingId },
        },
      });

      if (existingFollow) {
        if (existingFollow.status === 'ACCEPTED') {
          throw new BadRequestException('You already follow this user');
        }
        if (existingFollow.status === 'PENDING') {
          throw new BadRequestException('Follow request is already pending');
        }

        // Previously rejected -> re-request or follow
        const status = following.isPrivate ? 'PENDING' : 'ACCEPTED';
        await this.prismaService.follower.update({
          where: { id: existingFollow.id },
          data: { status },
        });

        if (following.isPrivate) {
          await this.notificationService.followRequest(followingId, userId);
          return 'Follow request sent';
        } else {
          await this.notificationService.newFollower(followingId, userId);
          this.eventEmitter.emit(
            'user.followed',
            new NewFollowerEvent(userId, followingId),
          );
          return 'User started following';
        }
      }

      const status = following.isPrivate ? 'PENDING' : 'ACCEPTED';
      await this.prismaService.follower.create({
        data: {
          followerId: userId,
          followingId,
          status,
        },
      });

      if (following.isPrivate) {
        await this.notificationService.followRequest(followingId, userId);
        return 'Follow request sent';
      } else {
        await this.notificationService.newFollower(followingId, userId);
        this.eventEmitter.emit(
          'user.followed',
          new NewFollowerEvent(userId, followingId),
        );
        return 'User started following';
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('FollowUserHandler Error:', error);
      throw new InternalServerErrorException('Unexpected server error');
    }
  }
}
