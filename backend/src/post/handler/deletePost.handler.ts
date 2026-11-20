import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from '../commands/deletePost.command';
import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostDeletedEvent } from '../event/postDeleted.event';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: DeletePostCommand): Promise<string> {
    try {
      const { postId, userId } = command;

      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      if (post.createdById !== userId) {
        throw new ForbiddenException('You can only delete your own posts');
      }

      await this.prismaService.post.update({
        where: {
          id: postId,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      // Fire and forget event
      this.eventEmitter.emit(
        'post.deleted',
        new PostDeletedEvent(postId, userId),
      );

      return 'Post deleted successfully';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
