import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelFollowRequestCommand } from '../commands/CancelFollowRequestCommand';
import { PrismaService } from 'src/prisma.service';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(CancelFollowRequestCommand)
export class CancelFollowRequestHandler
  implements ICommandHandler<CancelFollowRequestCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CancelFollowRequestCommand): Promise<string> {
    const { userId, followingId } = command;

    try {
      const followRecord = await this.prisma.follower.findFirst({
        where: {
          followerId: userId,
          followingId,
          status: 'PENDING',
        },
      });

      if (!followRecord) {
        throw new NotFoundException('Pending follow request not found');
      }

      await this.prisma.follower.delete({
        where: { id: followRecord.id },
      });

      // Also clean up any unread follow request notification
      await this.prisma.notification.deleteMany({
        where: {
          recipientId: followingId,
          actorId: userId,
          type: 'FOLLOW_REQUEST',
          isRead: false,
        },
      });

      return 'Follow request cancelled';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to cancel follow request');
    }
  }
}
