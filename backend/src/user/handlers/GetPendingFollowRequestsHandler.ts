import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPendingFollowRequestsQuery } from '../query/GetPendingFollowRequests.query';
import { PrismaService } from 'src/prisma.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from 'src/types';

@QueryHandler(GetPendingFollowRequestsQuery)
export class GetPendingFollowRequestsHandler
  implements IQueryHandler<GetPendingFollowRequestsQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPendingFollowRequestsQuery): Promise<UserDto[]> {
    const { userId } = query;

    try {
      const records = await this.prisma.follower.findMany({
        where: {
          followingId: userId,
          status: 'PENDING',
        },
        include: {
          follower: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return records.map((r) => ({
        id: r.follower.id,
        firstname: r.follower.firstname,
        lastname: r.follower.lastname,
        bio: r.follower.bio,
        avatarUrl: r.follower.avatarUrl,
        email: '', // Never leak email in lists
        verified: r.follower.verified,
        isPrivate: r.follower.isPrivate,
        createdAt: r.follower.createdAt,
        updatedAt: r.follower.updatedAt,
        followStatus: 'PENDING',
      })) as UserDto[];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch pending follow requests',
      );
    }
  }
}
