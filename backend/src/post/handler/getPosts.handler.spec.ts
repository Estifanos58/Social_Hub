import { GetPostsHandler } from './getPosts.handler';
import { GetPostsQuery } from '../query/getPosts.query';

describe('GetPostsHandler', () => {
  let handler: GetPostsHandler;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      post: {
        findMany: jest.fn(),
      },
      follower: {
        findMany: jest.fn(),
      },
      savedPost: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    handler = new GetPostsHandler(prisma);
  });

  it('should exclude soft-deleted posts and only include public posts for unauthenticated users', async () => {
    prisma.post.findMany.mockResolvedValueOnce([]);

    const query = new GetPostsQuery(undefined, 10, undefined, 'forYou');
    const result = await handler.execute(query);

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          createdBy: { isPrivate: false },
        },
      }),
    );
    expect(result).toEqual({ posts: [], hasMore: false });
  });

  it('should include followed private posts (status ACCEPTED) and own posts for authenticated users in forYou feed', async () => {
    const mockPost = {
      id: 'post-1',
      content: 'Hello World',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'user-1',
      createdBy: {
        id: 'user-1',
        firstname: 'Alice',
        isPrivate: true,
        email: 'alice@example.com',
      },
      images: [],
      reactions: [{ createdById: 'user-1', type: 'LIKE' }],
      _count: { comments: 2, reactions: 1 },
    };

    prisma.post.findMany.mockResolvedValueOnce([mockPost]);

    const query = new GetPostsQuery(undefined, 10, 'user-1', 'forYou');
    const result = await handler.execute(query);

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          OR: [
            { createdBy: { isPrivate: false } },
            { createdById: 'user-1' },
            {
              createdBy: {
                followers: {
                  some: { followerId: 'user-1', status: 'ACCEPTED' },
                },
              },
            },
          ],
          notInterestedBy: { none: { userId: 'user-1' } },
        },
      }),
    );
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].commentsCount).toBe(2);
    expect(result.posts[0].reactionsCount).toBe(1);
    expect(result.posts[0].userReaction).toBe('LIKE');
    expect(result.posts[0].createdBy.email).toBe('alice@example.com'); // owner's own post has email
    expect(result.hasMore).toBe(false);
  });

  it('should only show posts from followed accounts in following feed', async () => {
    prisma.follower.findMany.mockResolvedValueOnce([
      { followingId: 'creator-1' },
      { followingId: 'creator-2' },
    ]);

    const mockPost = {
      id: 'post-2',
      content: 'Creator post',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'creator-1',
      createdBy: {
        id: 'creator-1',
        firstname: 'Bob',
        isPrivate: false,
        email: 'bob@example.com',
      },
      images: [],
      reactions: [],
      _count: { comments: 0, reactions: 0 },
    };

    prisma.post.findMany.mockResolvedValueOnce([mockPost]);

    const query = new GetPostsQuery(undefined, 10, 'user-1', 'following');
    const result = await handler.execute(query);

    expect(prisma.follower.findMany).toHaveBeenCalledWith({
      where: { followerId: 'user-1', status: 'ACCEPTED' },
      select: { followingId: true },
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          createdById: { in: ['creator-1', 'creator-2'] },
          notInterestedBy: { none: { userId: 'user-1' } },
        },
      }),
    );
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].createdBy.email).toBe(''); // Sanitized for non-owner
  });

  it('should return empty list when following feed has no followed creators', async () => {
    prisma.follower.findMany.mockResolvedValueOnce([]);

    const query = new GetPostsQuery(undefined, 10, 'user-1', 'following');
    const result = await handler.execute(query);

    expect(result).toEqual({ posts: [], hasMore: false });
    expect(prisma.post.findMany).not.toHaveBeenCalled();
  });
});
