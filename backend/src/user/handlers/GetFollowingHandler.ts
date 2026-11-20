import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetFollowingQuery } from '../query/GetFollowing.query';
import { GetFollowersDto } from '../types/getFollow.type';

@QueryHandler(GetFollowingQuery)
export class GetFollowingHandler implements IQueryHandler<GetFollowingQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFollowingQuery): Promise<GetFollowersDto> {
    const { userId, skip, take } = query;

    try {
      const [totalFollowers, totalFollowing, users] = await Promise.all([
        this.prismaService.follower.count({
          where: { followingId: userId, status: 'ACCEPTED' },
        }),
        this.prismaService.follower.count({
          where: { followerId: userId, status: 'ACCEPTED' },
        }),
        this.prismaService.follower.findMany({
          where: { followerId: userId, status: 'ACCEPTED' },
          skip,
          take: take + 1,
          include: {
            following: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const hasMore = users.length > take;

      return new GetFollowersDto({
        users: users.slice(0, take).map((f) => ({
          ...f.following,
          email: '', // Never leak email
          isFollowing: true,
        })) as any,
        totalFollowers,
        totalFollowing,
        hasMore,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Server Error Happened');
    }
  }
}
