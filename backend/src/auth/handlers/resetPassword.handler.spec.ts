import { BadRequestException } from '@nestjs/common';
import { ResetPasswordHandler } from './resetPassword.handler';
import { ResetPasswordCommand } from '../commands/resetPassword.command';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordHandler;
  let prismaService: any;
  let jwtService: any;
  let configService: any;
  let eventEmitter: any;

  beforeEach(() => {
    prismaService = {
      credential: {
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
    };
    configService = {
      get: jest.fn().mockReturnValue('test_secret'),
    };
    eventEmitter = {
      emit: jest.fn(),
    };

    handler = new ResetPasswordHandler(
      prismaService,
      jwtService,
      configService,
      eventEmitter,
    );
  });

  it('should throw BadRequestException if token or password is missing', async () => {
    const cmd = new ResetPasswordCommand('', 'newPass', {} as any);
    await expect(handler.execute(cmd)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if reset token is expired', async () => {
    const pastDate = new Date(Date.now() - 3600000);
    prismaService.credential.findFirst.mockResolvedValueOnce({
      id: 'cred-1',
      resetToken: 'valid-looking-token',
      resetTokenExpiry: pastDate,
      user: { id: 'user-1' },
    });

    const cmd = new ResetPasswordCommand(
      'valid-looking-token',
      'newPass123!',
      {} as any,
    );
    await expect(handler.execute(cmd)).rejects.toThrow(
      new BadRequestException('Invalid or expired reset token'),
    );
  });

  it('should reset password, revoke sessions, and issue fresh token', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      firstname: 'Alice',
    };
    prismaService.credential.findFirst.mockResolvedValueOnce({
      id: 'cred-1',
      resetToken: 'valid-token',
      resetTokenExpiry: futureDate,
      user: mockUser,
    });

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_new_password');
    prismaService.credential.update.mockResolvedValueOnce({});
    prismaService.credential.updateMany.mockResolvedValueOnce({ count: 1 });

    const mockResponse: any = {
      cookie: jest.fn(),
    };

    const cmd = new ResetPasswordCommand(
      'valid-token',
      'newPass123!',
      mockResponse,
    );
    const result = await handler.execute(cmd);

    expect(bcrypt.hash).toHaveBeenCalledWith('newPass123!', 10);
    expect(prismaService.credential.update).toHaveBeenCalledWith({
      where: { id: 'cred-1' },
      data: {
        passwordHash: 'hashed_new_password',
        resetToken: null,
        resetTokenExpiry: null,
        refreshToken: null,
      },
    });
    expect(eventEmitter.emit).toHaveBeenCalledWith('password.reset', {
      email: 'user@example.com',
      firstname: 'Alice',
    });
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });
});
