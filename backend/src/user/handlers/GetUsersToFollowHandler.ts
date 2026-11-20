import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersToFollowQuery } from '../query/GetUsersToFollow.query';
import { PrismaService } from 'src/prisma.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GetUsersToFollowDto } from '../types/getUsersToFollow.type';

@QueryHandler(GetUsersToFollowQuery)
export class GetUsersToFollowHandler
  implements IQueryHandler<GetUsersToFollowQuery>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUsersToFollowQuery): Promise<GetUsersToFollowDto> {
    const { userId, limit, offset } = query;

    try {
      // Exclude current user and accounts already followed or with pending requests
      const users = await this.prismaService.user.findMany({
        where: {
          id: { not: userId },
          followers: {
            none: {
              followerId: userId,
              status: { in: ['ACCEPTED', 'PENDING'] },
            },
          },
        },
        take: limit + 1,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          bio: true,
          avatarUrl: true,
          email: false,
          lastSeenAt: true,
          verified: true,
          isPrivate: true,
          createdAt: true,
          updatedAt: true,
          following: {
            where: {
              followingId: userId,
              status: 'ACCEPTED',
            },
            select: {
              id: true,
            },
            take: 1,
          },
        },
      });

      if (!users || users.length === 0) {
        return {
          users: [],
          hasMore: false,
        };
      }

      const hasMore = users.length > limit;

      const sanitizedUsers = (hasMore ? users.slice(0, limit) : users).map(
        ({ following, ...user }) => ({
          ...user,
          email: '', // Never leak email addresses to non-owners
          isFollowing: Array.isArray(following) && following.length > 0,
        }),
      );

      return {
        users: sanitizedUsers as any,
        hasMore,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while fetching users to follow.',
      );
    }
  }
}
