import { FollowUserHandler } from './FollowUserHandler';
import { AcceptFollowRequestHandler } from './AcceptFollowRequestHandler';
import { RejectFollowRequestHandler } from './RejectFollowRequestHandler';
import { CancelFollowRequestHandler } from './CancelFollowRequestHandler';
import { FollowUserCommand } from '../commands/FollowUserCommand';
import { AcceptFollowRequestCommand } from '../commands/AcceptFollowRequestCommand';
import { RejectFollowRequestCommand } from '../commands/RejectFollowRequestCommand';
import { CancelFollowRequestCommand } from '../commands/CancelFollowRequestCommand';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Follow Requests Workflow', () => {
  let prisma: any;
  let eventEmitter: any;
  let notificationService: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      follower: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      notification: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    eventEmitter = {
      emit: jest.fn(),
    };
    notificationService = {
      newFollower: jest.fn().mockResolvedValue({}),
      followRequest: jest.fn().mockResolvedValue({}),
      followAccepted: jest.fn().mockResolvedValue({}),
    };
  });

  describe('FollowUserHandler', () => {
    it('creates PENDING follow request when target is private', async () => {
      const handler = new FollowUserHandler(
        prisma,
        eventEmitter,
        notificationService,
      );

      prisma.user.findUnique.mockImplementation(({ where }: any) => {
        if (where.id === 'user-1') return Promise.resolve({ id: 'user-1' });
        if (where.id === 'user-2')
          return Promise.resolve({ id: 'user-2', isPrivate: true });
        return null;
      });
      prisma.follower.findUnique.mockResolvedValueOnce(null);

      const res = await handler.execute(
        new FollowUserCommand('user-1', 'user-2'),
      );

      expect(prisma.follower.create).toHaveBeenCalledWith({
        data: {
          followerId: 'user-1',
          followingId: 'user-2',
          status: 'PENDING',
        },
      });
      expect(notificationService.followRequest).toHaveBeenCalledWith(
        'user-2',
        'user-1',
      );
      expect(res).toBe('Follow request sent');
    });

    it('creates ACCEPTED follow relation when target is public', async () => {
      const handler = new FollowUserHandler(
        prisma,
        eventEmitter,
        notificationService,
      );

      prisma.user.findUnique.mockImplementation(({ where }: any) => {
        if (where.id === 'user-1') return Promise.resolve({ id: 'user-1' });
        if (where.id === 'user-2')
          return Promise.resolve({ id: 'user-2', isPrivate: false });
        return null;
      });
      prisma.follower.findUnique.mockResolvedValueOnce(null);

      const res = await handler.execute(
        new FollowUserCommand('user-1', 'user-2'),
      );

      expect(prisma.follower.create).toHaveBeenCalledWith({
        data: {
          followerId: 'user-1',
          followingId: 'user-2',
          status: 'ACCEPTED',
        },
      });
      expect(notificationService.newFollower).toHaveBeenCalledWith(
        'user-2',
        'user-1',
      );
      expect(res).toBe('User started following');
    });

    it('throws BadRequestException if following self', async () => {
      const handler = new FollowUserHandler(
        prisma,
        eventEmitter,
        notificationService,
      );
      await expect(
        handler.execute(new FollowUserCommand('user-1', 'user-1')),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('AcceptFollowRequestHandler', () => {
    it('updates status to ACCEPTED and notifies follower', async () => {
      const handler = new AcceptFollowRequestHandler(
        prisma,
        notificationService,
        eventEmitter,
      );

      prisma.follower.findFirst.mockResolvedValueOnce({
        id: 'follow-record-1',
        followerId: 'requester-1',
        followingId: 'owner-1',
        status: 'PENDING',
      });

      const res = await handler.execute(
        new AcceptFollowRequestCommand('owner-1', 'requester-1'),
      );

      expect(prisma.follower.update).toHaveBeenCalledWith({
        where: { id: 'follow-record-1' },
        data: { status: 'ACCEPTED' },
      });
      expect(notificationService.followAccepted).toHaveBeenCalledWith(
        'requester-1',
        'owner-1',
      );
      expect(res).toBe('Follow request accepted');
    });

    it('throws NotFoundException if pending request does not exist', async () => {
      const handler = new AcceptFollowRequestHandler(
        prisma,
        notificationService,
        eventEmitter,
      );
      prisma.follower.findFirst.mockResolvedValueOnce(null);

      await expect(
        handler.execute(
          new AcceptFollowRequestCommand('owner-1', 'unknown-user'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('RejectFollowRequestHandler', () => {
    it('deletes the pending follow record', async () => {
      const handler = new RejectFollowRequestHandler(prisma);

      prisma.follower.findFirst.mockResolvedValueOnce({
        id: 'follow-record-1',
        followerId: 'requester-1',
        followingId: 'owner-1',
        status: 'PENDING',
      });

      const res = await handler.execute(
        new RejectFollowRequestCommand('owner-1', 'requester-1'),
      );

      expect(prisma.follower.delete).toHaveBeenCalledWith({
        where: { id: 'follow-record-1' },
      });
      expect(res).toBe('Follow request rejected');
    });
  });

  describe('CancelFollowRequestHandler', () => {
    it('deletes the pending follow record and cleans up notification', async () => {
      const handler = new CancelFollowRequestHandler(prisma);

      prisma.follower.findFirst.mockResolvedValueOnce({
        id: 'follow-record-1',
        followerId: 'requester-1',
        followingId: 'target-1',
        status: 'PENDING',
      });

      const res = await handler.execute(
        new CancelFollowRequestCommand('requester-1', 'target-1'),
      );

      expect(prisma.follower.delete).toHaveBeenCalledWith({
        where: { id: 'follow-record-1' },
      });
      expect(prisma.notification.deleteMany).toHaveBeenCalled();
      expect(res).toBe('Follow request cancelled');
    });
  });
});
