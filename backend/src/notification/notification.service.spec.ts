import { NotificationService } from './notification.service';
import { NotificationType } from '@prisma/client';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      notification: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    service = new NotificationService(prisma);
  });

  it('should mark a single notification as read for the recipient', async () => {
    prisma.notification.updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await service.markAsRead('notif-1', 'user-1');

    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 'notif-1', recipientId: 'user-1' },
      data: { isRead: true, readAt: expect.any(Date) },
    });
    expect(result).toEqual({ count: 1 });
  });

  it('should mark all unread notifications as read for the user', async () => {
    prisma.notification.updateMany.mockResolvedValueOnce({ count: 5 });

    const result = await service.markAllAsRead('user-1');

    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { recipientId: 'user-1', isRead: false },
      data: { isRead: true, readAt: expect.any(Date) },
    });
    expect(result).toEqual({ count: 5 });
  });

  it('should create a notification with proper attributes', async () => {
    prisma.notification.create.mockResolvedValueOnce({ id: 'notif-new' });

    await service.login('user-1', { ip: '127.0.0.1' });

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        type: NotificationType.LOGIN,
        recipientId: 'user-1',
        actorId: null,
        postId: null,
        commentId: null,
        reactionId: null,
        metadata: { ip: '127.0.0.1' },
      },
    });
  });
});
