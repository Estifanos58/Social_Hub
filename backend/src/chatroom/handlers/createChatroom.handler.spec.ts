import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateChatroomHandler } from './createChatroom.handler';
import { CreateChatroomCommand } from '../commands/CreateChatroom.command';
import { ChatroomRole } from '@prisma/client';

describe('CreateChatroomHandler', () => {
  let handler: CreateChatroomHandler;
  let prismaService: any;

  beforeEach(() => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
      chatroom: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (cb) => {
        const tx = {
          $executeRaw: jest.fn().mockResolvedValue(1),
          chatroom: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        };
        return cb(tx);
      }),
    };
    handler = new CreateChatroomHandler(prismaService);
  });

  it('should throw BadRequestException when trying to create a direct chat with oneself', async () => {
    prismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1' });

    const cmd = new CreateChatroomCommand('user-1', 'user-1', false);
    await expect(handler.execute(cmd)).rejects.toThrow(
      new BadRequestException('Cannot create a direct chat with yourself'),
    );
  });

  it('should return existing direct chatroom instead of creating a duplicate', async () => {
    prismaService.user.findUnique
      .mockResolvedValueOnce({ id: 'user-1' })
      .mockResolvedValueOnce({ id: 'user-2' });

    const existingChatroom = {
      id: 'chat-1',
      isGroup: false,
      memberships: [{ userId: 'user-1' }, { userId: 'user-2' }],
    };

    prismaService.$transaction.mockImplementationOnce(async (cb: any) => {
      const tx = {
        $executeRaw: jest.fn().mockResolvedValue(1),
        chatroom: {
          findFirst: jest.fn().mockResolvedValue(existingChatroom),
          create: jest.fn(),
        },
      };
      return cb(tx);
    });

    const cmd = new CreateChatroomCommand('user-1', 'user-2', false);
    const result = await handler.execute(cmd);

    expect(result).toBe(existingChatroom);
  });

  it('should create a new direct chatroom when none exists', async () => {
    prismaService.user.findUnique
      .mockResolvedValueOnce({ id: 'user-1' })
      .mockResolvedValueOnce({ id: 'user-2' });

    const createdChatroom = {
      id: 'chat-new',
      isGroup: false,
      memberships: [
        { userId: 'user-1', role: ChatroomRole.OWNER },
        { userId: 'user-2', role: ChatroomRole.MEMBER },
      ],
    };

    prismaService.$transaction.mockImplementationOnce(async (cb: any) => {
      const tx = {
        $executeRaw: jest.fn().mockResolvedValue(1),
        chatroom: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(createdChatroom),
        },
      };
      return cb(tx);
    });

    const cmd = new CreateChatroomCommand('user-1', 'user-2', false);
    const result = await handler.execute(cmd);

    expect(result).toBe(createdChatroom);
  });
});
