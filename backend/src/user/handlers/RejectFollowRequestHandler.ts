import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RejectFollowRequestCommand } from '../commands/RejectFollowRequestCommand';
import { PrismaService } from 'src/prisma.service';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(RejectFollowRequestCommand)
export class RejectFollowRequestHandler
  implements ICommandHandler<RejectFollowRequestCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RejectFollowRequestCommand): Promise<string> {
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

      await this.prisma.follower.delete({
        where: { id: followRecord.id },
      });

      return 'Follow request rejected';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to reject follow request');
    }
  }
}
