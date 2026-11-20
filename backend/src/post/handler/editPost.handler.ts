import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditPostCommand } from '../commands/editPost.command';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@CommandHandler(EditPostCommand)
export class EditPostHandler implements ICommandHandler<EditPostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: EditPostCommand): Promise<any> {
    const { userId, postId, content } = command;

    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Post content cannot be empty');
    }

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: { images: true, createdBy: true },
      });

      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      if (post.createdById !== userId) {
        throw new ForbiddenException('You can only edit your own posts');
      }

      const updated = await this.prisma.post.update({
        where: { id: postId },
        data: {
          content: content.trim(),
          updatedAt: new Date(),
        },
        include: {
          createdBy: true,
          images: true,
        },
      });

      return {
        ...updated,
        createdBy: updated.createdBy
          ? {
              ...updated.createdBy,
              email:
                updated.createdById === userId ? updated.createdBy.email : '',
            }
          : updated.createdBy,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update post');
    }
  }
}
