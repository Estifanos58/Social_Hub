import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptFollowRequestCommand } from '../commands/AcceptFollowRequestCommand';
import { PrismaService } from 'src/prisma.service';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewFollowerEvent } from '../event/newFollower.event';

@CommandHandler(AcceptFollowRequestCommand)
export class AcceptFollowRequestHandler
  implements ICommandHandler<AcceptFollowRequestCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: AcceptFollowRequestCommand): Promise<string> {
    const { userId, followerId } = command;

    try {
      const followRecord = await this.prisma.follower.findFirst({
        where: {
          followerId,
          followingId: userId,
          status: 'PENDING',
        },
      });

      if (!followRecord) {
        throw new NotFoundException('Pending follow request not found');
      }

      await this.prisma.follower.update({
        where: { id: followRecord.id },
        data: { status: 'ACCEPTED' },
      });

      // Notify follower that their request was accepted
      await this.notificationService.followAccepted(followerId, userId);

      // Emit event
      this.eventEmitter.emit(
        'user.followed',
        new NewFollowerEvent(followerId, userId),
      );

      return 'Follow request accepted';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to accept follow request');
    }
  }
}
