import { EditPostHandler } from './editPost.handler';
import { DeletePostHandler } from './deletePost.handler';
import {
  SavePostHandler,
  UnsavePostHandler,
  ReportPostHandler,
  NotInterestedPostHandler,
} from './postActions.handler';
import { EditPostCommand } from '../commands/editPost.command';
import { DeletePostCommand } from '../commands/deletePost.command';
import {
  SavePostCommand,
  UnsavePostCommand,
  ReportPostCommand,
  NotInterestedPostCommand,
} from '../commands/postActions.command';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('Post Actions Handlers', () => {
  let prisma: any;
  let eventEmitter: any;

  beforeEach(() => {
    prisma = {
      post: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      savedPost: {
        upsert: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      postReport: {
        create: jest.fn().mockResolvedValue({}),
      },
      notInterestedPost: {
        upsert: jest.fn().mockResolvedValue({}),
      },
    };
    eventEmitter = {
      emit: jest.fn(),
    };
  });

  describe('EditPostHandler', () => {
    it('successfully edits own post', async () => {
      const handler = new EditPostHandler(prisma);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        createdById: 'user-1',
        deletedAt: null,
      });
      prisma.post.update.mockResolvedValueOnce({
        id: 'post-1',
        content: 'Updated content',
        createdById: 'user-1',
        createdBy: { id: 'user-1', email: 'owner@example.com' },
      });

      const result = await handler.execute(
        new EditPostCommand('user-1', 'post-1', 'Updated content'),
      );

      expect(prisma.post.update).toHaveBeenCalled();
      expect(result.content).toBe('Updated content');
    });

    it('rejects editing another users post with ForbiddenException', async () => {
      const handler = new EditPostHandler(prisma);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        createdById: 'other-user',
        deletedAt: null,
      });

      await expect(
        handler.execute(
          new EditPostCommand('user-1', 'post-1', 'Malicious edit'),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeletePostHandler', () => {
    it('soft deletes own post', async () => {
      const handler = new DeletePostHandler(prisma, eventEmitter);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        createdById: 'user-1',
        deletedAt: null,
      });

      const res = await handler.execute(
        new DeletePostCommand('post-1', 'user-1'),
      );

      expect(prisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-1' },
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        }),
      );
      expect(res).toBe('Post deleted successfully');
    });

    it('rejects deleting someone elses post with ForbiddenException', async () => {
      const handler = new DeletePostHandler(prisma, eventEmitter);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        createdById: 'attacker-victim',
        deletedAt: null,
      });

      await expect(
        handler.execute(new DeletePostCommand('post-1', 'attacker-user')),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('SavePostHandler & UnsavePostHandler', () => {
    it('saves a post', async () => {
      const handler = new SavePostHandler(prisma);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        deletedAt: null,
      });

      const res = await handler.execute(
        new SavePostCommand('user-1', 'post-1'),
      );
      expect(prisma.savedPost.upsert).toHaveBeenCalled();
      expect(res).toBe(true);
    });

    it('unsaves a post', async () => {
      const handler = new UnsavePostHandler(prisma);
      const res = await handler.execute(
        new UnsavePostCommand('user-1', 'post-1'),
      );
      expect(prisma.savedPost.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', postId: 'post-1' },
      });
      expect(res).toBe(true);
    });
  });

  describe('ReportPostHandler', () => {
    it('creates a report', async () => {
      const handler = new ReportPostHandler(prisma);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        deletedAt: null,
      });

      const res = await handler.execute(
        new ReportPostCommand('user-1', 'post-1', 'Spam content'),
      );
      expect(prisma.postReport.create).toHaveBeenCalledWith({
        data: {
          reporterId: 'user-1',
          postId: 'post-1',
          reason: 'Spam content',
        },
      });
      expect(res).toBe(true);
    });
  });

  describe('NotInterestedPostHandler', () => {
    it('marks a post as not interested', async () => {
      const handler = new NotInterestedPostHandler(prisma);
      prisma.post.findUnique.mockResolvedValueOnce({
        id: 'post-1',
        deletedAt: null,
      });

      const res = await handler.execute(
        new NotInterestedPostCommand('user-1', 'post-1'),
      );
      expect(prisma.notInterestedPost.upsert).toHaveBeenCalled();
      expect(res).toBe(true);
    });
  });
});
