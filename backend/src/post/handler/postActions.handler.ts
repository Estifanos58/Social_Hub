import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  SavePostCommand,
  UnsavePostCommand,
  ReportPostCommand,
  NotInterestedPostCommand,
} from '../commands/postActions.command';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@CommandHandler(SavePostCommand)
export class SavePostHandler implements ICommandHandler<SavePostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: SavePostCommand): Promise<boolean> {
    const { userId, postId } = command;

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      await this.prisma.savedPost.upsert({
        where: {
          userId_postId: { userId, postId },
        },
        create: {
          userId,
          postId,
        },
        update: {},
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to save post');
    }
  }
}

@CommandHandler(UnsavePostCommand)
export class UnsavePostHandler implements ICommandHandler<UnsavePostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UnsavePostCommand): Promise<boolean> {
    const { userId, postId } = command;

    try {
      await this.prisma.savedPost.deleteMany({
        where: { userId, postId },
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to unsave post');
    }
  }
}

@CommandHandler(ReportPostCommand)
export class ReportPostHandler implements ICommandHandler<ReportPostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ReportPostCommand): Promise<boolean> {
    const { userId, postId, reason } = command;

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Please provide a reason for reporting');
    }

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      await this.prisma.postReport.create({
        data: {
          reporterId: userId,
          postId,
          reason: reason.trim(),
        },
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to report post');
    }
  }
}

@CommandHandler(NotInterestedPostCommand)
export class NotInterestedPostHandler
  implements ICommandHandler<NotInterestedPostCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: NotInterestedPostCommand): Promise<boolean> {
    const { userId, postId } = command;

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      await this.prisma.notInterestedPost.upsert({
        where: {
          userId_postId: { userId, postId },
        },
        create: {
          userId,
          postId,
        },
        update: {},
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to mark post as not interested',
      );
    }
  }
}
