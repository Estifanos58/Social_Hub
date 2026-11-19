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
    };
    handler = new GetPostsHandler(prisma);
  });

  it('should exclude soft-deleted posts and only include public posts for unauthenticated users', async () => {
    prisma.post.findMany.mockResolvedValueOnce([]);

    const query = new GetPostsQuery(undefined, 10, undefined);
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

  it('should include followed private posts and user own posts for authenticated users', async () => {
    const mockPost = {
      id: 'post-1',
      content: 'Hello World',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'user-1',
      createdBy: { id: 'user-1', name: 'Alice', isPrivate: true },
      images: [],
      reactions: [{ createdById: 'user-1', type: 'LIKE' }],
      _count: { comments: 2, reactions: 1 },
    };

    prisma.post.findMany.mockResolvedValueOnce([mockPost]);

    const query = new GetPostsQuery(undefined, 10, 'user-1');
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
                  some: { followerId: 'user-1' },
                },
              },
            },
          ],
        },
      }),
    );
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].commentsCount).toBe(2);
    expect(result.posts[0].reactionsCount).toBe(1);
    expect(result.posts[0].userReaction).toBe('LIKE');
    expect(result.hasMore).toBe(false);
  });
});
