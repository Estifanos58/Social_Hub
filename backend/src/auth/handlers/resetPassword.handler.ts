import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../commands/resetPassword.command';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { issueToken } from 'src/utils/issueToken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<any> {
    const { resetToken, newPassword, response } = command;

    try {
      if (!resetToken || !newPassword) {
        throw new BadRequestException(
          'Reset token and new password are required',
        );
      }

      const credential = await this.prismaService.credential.findFirst({
        where: { resetToken },
        include: { user: true },
      });

      if (
        !credential ||
        !credential.resetTokenExpiry ||
        credential.resetTokenExpiry < new Date()
      ) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Invalidate reset token and any existing refresh tokens
      await this.prismaService.credential.update({
        where: { id: credential.id },
        data: {
          passwordHash: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
          refreshToken: null,
        },
      });

      this.eventEmitter.emit('password.reset', {
        email: credential.user.email,
        firstname: credential.user.firstname,
      });

      return await issueToken(
        credential.user,
        this.jwtService,
        this.configService,
        response,
        this.prismaService,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
