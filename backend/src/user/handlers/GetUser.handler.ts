import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../query/GetUser.query';
import { PrismaService } from 'src/prisma.service';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileDto } from '../types/getUser.type';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserQuery): Promise<UserProfileDto> {
    const { userId, requesterId } = query;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          posts: {
            where: { deletedAt: null },
            include: {
              images: { take: 1 }, // grab first image
              comments: { where: { deletedAt: null } },
              reactions: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');

      const isOwner = Boolean(requesterId && requesterId === user.id);

      // Check follow relationship between requester and target profile
      let followStatus = 'NONE';
      let isFollowing = false;

      if (requesterId && !isOwner) {
        const followRecord = await this.prisma.follower.findUnique({
          where: {
            followerId_followingId: {
              followerId: requesterId,
              followingId: userId,
            },
          },
        });

        if (followRecord) {
          followStatus = followRecord.status;
          isFollowing = followRecord.status === 'ACCEPTED';
        }
      }

      // Privacy logic: private accounts are only viewable by owner and accepted followers
      let canView = true;
      if (!isOwner && user.isPrivate) {
        if (!isFollowing) {
          canView = false;
        }
      }

      return this.buildUserProfile(
        user,
        canView,
        isOwner,
        followStatus,
        isFollowing,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private async buildUserProfile(
    user: any,
    canView: boolean,
    isOwner: boolean,
    followStatus: string,
    isFollowing: boolean,
  ): Promise<UserProfileDto> {
    const followersCount = await this.prisma.follower.count({
      where: { followingId: user.id, status: 'ACCEPTED' },
    });

    const followingCount = await this.prisma.follower.count({
      where: { followerId: user.id, status: 'ACCEPTED' },
    });

    return new UserProfileDto({
      user: {
        id: user.id,
        avatarUrl: user.avatarUrl,
        firstname: user.firstname,
        lastname: user.lastname || '',
        bio: user.bio || '',
        // FIX: Only account owners receive their email address
        email: isOwner ? user.email : '',
        isPrivate: user.isPrivate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        verified: user.verified,
        lastSeenAt: isOwner || canView ? user.lastSeenAt : null,
        isFollowing: isOwner ? undefined : isFollowing,
        followStatus: isOwner ? undefined : followStatus,
      },
      followers: followersCount,
      following: followingCount,
      followStatus: isOwner ? undefined : followStatus,
      posts: canView
        ? user.posts.map((post: any) => ({
            id: post.id,
            imageUrl: post.images[0]?.url || null,
            likes: post.reactions.length,
            comments: post.comments.length,
          }))
        : [],
    });
  }
}
