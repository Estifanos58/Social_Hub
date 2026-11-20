import { GetUserHandler } from './GetUser.handler';
import { GetUserQuery } from '../query/GetUser.query';
import { NotFoundException } from '@nestjs/common';

describe('GetUserHandler - Privacy & Security', () => {
  let handler: GetUserHandler;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      follower: {
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    };
    handler = new GetUserHandler(prisma);
  });

  it('should return email and sensitive info when requester is the account owner', async () => {
    const ownerUser = {
      id: 'user-1',
      firstname: 'John',
      lastname: 'Doe',
      bio: 'Owner bio',
      email: 'john@example.com',
      avatarUrl: null,
      isPrivate: true,
      verified: true,
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [
        {
          id: 'post-1',
          images: [{ url: 'http://img.png' }],
          comments: [],
          reactions: [{ type: 'LIKE' }],
        },
      ],
    };

    prisma.user.findUnique.mockResolvedValueOnce(ownerUser);
    prisma.follower.count.mockResolvedValueOnce(5); // followersCount
    prisma.follower.count.mockResolvedValueOnce(3); // followingCount

    const result = await handler.execute(new GetUserQuery('user-1', 'user-1'));

    expect(result.user.email).toBe('john@example.com');
    expect(result.user.lastSeenAt).not.toBeNull();
    expect(result.posts).toHaveLength(1);
    expect(result.followers).toBe(5);
    expect(result.following).toBe(3);
  });

  it('MUST NOT return email to a non-owner, even for public profiles', async () => {
    const publicUser = {
      id: 'user-2',
      firstname: 'Alice',
      lastname: 'Smith',
      bio: 'Public bio',
      email: 'alice.private@example.com',
      avatarUrl: null,
      isPrivate: false,
      verified: true,
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [],
    };

    prisma.user.findUnique.mockResolvedValueOnce(publicUser);
    prisma.follower.findUnique.mockResolvedValueOnce(null); // not following
    prisma.follower.count.mockResolvedValueOnce(10);
    prisma.follower.count.mockResolvedValueOnce(8);

    const result = await handler.execute(new GetUserQuery('user-2', 'user-1'));

    // SECURITY CHECK: Email must never leak to non-owner
    expect(result.user.email).toBe('');
    expect(result.user.firstname).toBe('Alice');
  });

  it('should hide posts from private profiles if requester is NOT an accepted follower', async () => {
    const privateUser = {
      id: 'user-3',
      firstname: 'Bob',
      lastname: 'Private',
      bio: 'Private account',
      email: 'bob@example.com',
      avatarUrl: null,
      isPrivate: true,
      verified: false,
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [
        {
          id: 'secret-post-1',
          images: [{ url: 'http://secret.png' }],
          comments: [],
          reactions: [],
        },
      ],
    };

    prisma.user.findUnique.mockResolvedValueOnce(privateUser);
    // Follow record is PENDING, not ACCEPTED
    prisma.follower.findUnique.mockResolvedValueOnce({ status: 'PENDING' });
    prisma.follower.count.mockResolvedValue(0);

    const result = await handler.execute(
      new GetUserQuery('user-3', 'requester-4'),
    );

    expect(result.user.email).toBe('');
    expect(result.posts).toEqual([]);
    expect(result.followStatus).toBe('PENDING');
  });

  it('should show posts from private profiles if requester IS an accepted follower', async () => {
    const privateUser = {
      id: 'user-3',
      firstname: 'Bob',
      lastname: 'Private',
      bio: 'Private account',
      email: 'bob@example.com',
      avatarUrl: null,
      isPrivate: true,
      verified: false,
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [
        {
          id: 'secret-post-1',
          images: [{ url: 'http://secret.png' }],
          comments: [],
          reactions: [],
        },
      ],
    };

    prisma.user.findUnique.mockResolvedValueOnce(privateUser);
    prisma.follower.findUnique.mockResolvedValueOnce({ status: 'ACCEPTED' });
    prisma.follower.count.mockResolvedValue(1);

    const result = await handler.execute(
      new GetUserQuery('user-3', 'requester-4'),
    );

    expect(result.user.email).toBe(''); // Still no email leak
    expect(result.posts).toHaveLength(1);
    expect(result.followStatus).toBe('ACCEPTED');
  });

  it('throws NotFoundException when user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    await expect(
      handler.execute(new GetUserQuery('nonexistent-id', 'requester-1')),
    ).rejects.toThrow(NotFoundException);
  });
});
