import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from '../commands/forgotPassword.command';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotPasswordEvent } from '../event/forgotPassword.event';
import { generateVerificationCode } from 'src/utils/generateVerificationToken';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<string> {
    const { email } = command;
    const genericSuccessMessage =
      'If that email exists, a password reset code has been sent.';

    if (!email) {
      return genericSuccessMessage;
    }

    try {
      const credential = await this.prismaService.credential.findFirst({
        where: { user: { email: email.toLowerCase().trim() } },
        include: { user: true },
      });

      if (!credential) {
        // Do not leak email existence
        return genericSuccessMessage;
      }

      // If account was created strictly with Google and has no password, do not break or leak
      if (credential.googleId && !credential.passwordHash) {
        return genericSuccessMessage;
      }

      const token = generateVerificationCode(6);
      const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await this.prismaService.credential.update({
        where: { id: credential.id },
        data: {
          resetToken: token,
          resetTokenExpiry: tokenExpiresAt,
        },
      });

      this.eventEmitter.emit(
        'resetpasswordsent.token',
        new ForgotPasswordEvent(
          credential.user.firstname,
          credential.user.email,
          token,
        ),
      );

      return genericSuccessMessage;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
