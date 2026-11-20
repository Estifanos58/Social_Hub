import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLAuthGuard } from 'src/common/guards/graphql-auth.guard';
import { CreatePostDto } from './dto';
import { Request } from 'express';
import { CreatePostCommand } from './commands/createPost.command';
import { DeletePostCommand } from './commands/deletePost.command';
import { EditPostCommand } from './commands/editPost.command';
import {
  SavePostCommand,
  UnsavePostCommand,
  ReportPostCommand,
  NotInterestedPostCommand,
} from './commands/postActions.command';
import { PaginatedPostsDto } from './types/paginatedPosts.type';
import { GetPostType } from './types/getPost.type';
import { GetPostQuery } from './query/getPost.query';
import { GetPostsQuery } from './query/getPosts.query';
import { AddReactionCommand } from './commands/addReaction.command';
import { RemoveReactionCommand } from './commands/removeReaction.command';
import { PostDto } from 'src/types';

@Resolver()
export class PostResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => String)
  async createPost(
    @Args('createPost') createPost: CreatePostDto,
    @Context() context: { req: Request },
  ): Promise<string> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(
      new CreatePostCommand(userId, createPost.content, createPost.imageUrls),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => PostDto)
  async editPost(
    @Args('postId') postId: string,
    @Args('content') content: string,
    @Context() context: { req: Request },
  ): Promise<PostDto> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(
      new EditPostCommand(userId, postId, content),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => String)
  async deletePost(
    @Args('postId') postId: string,
    @Context() context: { req: Request },
  ): Promise<string> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(new DeletePostCommand(postId, userId));
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async savePost(
    @Args('postId') postId: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(new SavePostCommand(userId, postId));
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async unsavePost(
    @Args('postId') postId: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(new UnsavePostCommand(userId, postId));
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async reportPost(
    @Args('postId') postId: string,
    @Args('reason') reason: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(
      new ReportPostCommand(userId, postId, reason),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => Boolean)
  async notInterestedPost(
    @Args('postId') postId: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(
      new NotInterestedPostCommand(userId, postId),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Query(() => PaginatedPostsDto)
  async getPosts(
    @Args('take') take: number,
    @Args('cursor', { nullable: true }) cursor?: string,
    @Args('feedType', { nullable: true }) feedType?: string,
    @Context() context?: { req: Request },
  ): Promise<PaginatedPostsDto> {
    const userId = context?.req?.user?.sub;
    return this.queryBus.execute(
      new GetPostsQuery(cursor, take, userId, feedType || 'forYou'),
    );
  }

  @Query(() => GetPostType)
  async getPost(
    @Args('postId') postId: string,
    @Context() context?: { req?: Request },
  ): Promise<GetPostType> {
    const userId = context?.req?.user?.sub;
    return this.queryBus.execute(new GetPostQuery(postId, userId));
  }

  @Mutation(() => Boolean)
  @UseGuards(GraphQLAuthGuard)
  async addReaction(
    @Args('postId') postId: string,
    @Args('type') type: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD',
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(
      new AddReactionCommand(userId, postId, type),
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GraphQLAuthGuard)
  async removeReaction(
    @Args('postId') postId: string,
    @Context() context: { req: Request },
  ): Promise<boolean> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(new RemoveReactionCommand(postId, userId));
  }
}
