import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostQuery } from '../query/getPost.query';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetPostType } from '../types/getPost.type';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetPostQuery): Promise<GetPostType> {
    try {
      const { postId, userId } = query;

      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          createdBy: true,
          comments: {
            where: { deletedAt: null },
            include: { createdBy: true },
          },
          images: true,
          reactions: true,
          _count: {
            select: { comments: true, reactions: true },
          },
        },
      });

      if (!post || post.deletedAt !== null) {
        throw new NotFoundException('Post not found');
      }

      // Authorization for private accounts: only author or approved followers
      if (post.createdBy?.isPrivate && post.createdById !== userId) {
        let isFollowing = false;
        if (userId) {
          const followRecord = await this.prismaService.follower.findUnique({
            where: {
              followerId_followingId: {
                followerId: userId,
                followingId: post.createdById,
              },
            },
          });
          isFollowing = Boolean(
            followRecord && followRecord.status === 'ACCEPTED',
          );
        }

        if (!isFollowing) {
          throw new ForbiddenException('This account is private');
        }
      }

      const userReaction = userId
        ? post.reactions.find((r) => r.createdById === userId)
        : null;

      let isSaved = false;
      if (userId) {
        const saved = await this.prismaService.savedPost.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: post.id,
            },
          },
        });
        isSaved = Boolean(saved);
      }

      // Sanitize createdBy email to avoid private data leaks
      const sanitizedCreatedBy = post.createdBy
        ? {
            ...post.createdBy,
            email: post.createdById === userId ? post.createdBy.email : '',
          }
        : post.createdBy;

      const mappedPost: GetPostType = {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        createdById: post.createdById,
        createdBy: sanitizedCreatedBy as any,
        images: post.images,
        comments: post.comments.map((c) => ({
          ...c,
          createdBy: c.createdBy ? { ...c.createdBy, email: '' } : c.createdBy,
        })) as any,
        reactions: post.reactions,
        commentsCount: post._count.comments,
        reactionsCount: post._count.reactions,
        userReaction: userReaction ? (userReaction.type as string) : null,
        isSaved,
      };

      return mappedPost;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch post');
    }
  }
}
