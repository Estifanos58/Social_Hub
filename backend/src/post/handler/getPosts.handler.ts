import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GetPostsQuery } from '../query/getPosts.query';
import { PaginatedPostsDto } from '../types/paginatedPosts.type';

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPostsQuery): Promise<PaginatedPostsDto> {
    const { cursor, take, userId, feedType } = query;

    try {
      let whereClause: any;

      if (feedType === 'following') {
        if (!userId) {
          return { posts: [], hasMore: false };
        }

        const followingRecords = await this.prisma.follower.findMany({
          where: { followerId: userId, status: 'ACCEPTED' },
          select: { followingId: true },
        });

        const followedIds = followingRecords.map((r) => r.followingId);

        if (followedIds.length === 0) {
          return { posts: [], hasMore: false };
        }

        whereClause = {
          deletedAt: null,
          createdById: { in: followedIds },
          notInterestedBy: { none: { userId } },
        };
      } else {
        // "forYou" feed
        const privacyFilter = userId
          ? {
              OR: [
                { createdBy: { isPrivate: false } },
                { createdById: userId },
                {
                  createdBy: {
                    followers: {
                      some: { followerId: userId, status: 'ACCEPTED' },
                    },
                  },
                },
              ],
              notInterestedBy: { none: { userId } },
            }
          : {
              createdBy: { isPrivate: false },
            };

        whereClause = {
          deletedAt: null,
          ...privacyFilter,
        };
      }

      const posts = await this.prisma.post.findMany({
        take: take + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereClause,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
          createdBy: true,
          images: true,
          reactions: true,
          _count: {
            select: { comments: true, reactions: true },
          },
        },
      });

      const hasMore = posts.length > take;
      const returnedPosts = hasMore ? posts.slice(0, take) : posts;

      let savedPostIds = new Set<string>();
      if (userId && returnedPosts.length > 0 && this.prisma.savedPost) {
        const savedRecords = await this.prisma.savedPost.findMany({
          where: {
            userId,
            postId: { in: returnedPosts.map((p) => p.id) },
          },
          select: { postId: true },
        });
        savedPostIds = new Set(savedRecords.map((s) => s.postId));
      }

      const mappedPosts = returnedPosts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        createdById: post.createdById,
        createdBy: post.createdBy
          ? {
              ...post.createdBy,
              email: post.createdById === userId ? post.createdBy.email : '',
            }
          : post.createdBy,
        images: post.images,
        commentsCount: post._count.comments,
        reactionsCount: post._count.reactions,
        userReaction: userId
          ? post.reactions.find((r) => r.createdById === userId)?.type || null
          : null,
        isSaved: savedPostIds.has(post.id),
      }));

      return {
        posts: mappedPosts as any,
        hasMore,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }
}
