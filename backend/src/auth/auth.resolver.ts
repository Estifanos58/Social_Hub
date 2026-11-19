import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { LoginDto, RegisterDto } from './dto';
import { RegisterCommand } from './commands/register.command';
import { Request, Response } from 'express';
import { UserResponse } from './types';
import { GetCurrentUserQuery } from './query/getCurrentUser.query';
import { UseGuards } from '@nestjs/common';
import { VerifiEmailCommand } from './commands/verifyEmail.command';
import { ForgotPasswordCommand } from './commands/forgotPassword.command';
import { ResetPasswordCommand } from './commands/resetPassword.command';
import { UserDto } from 'src/types';
import { GraphQLAuthGuard } from 'src/common/guards/graphql-auth.guard';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { LoginCommand } from './commands/login.command';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(RateLimitGuard)
  @RateLimit({
    points: 5,
    duration: 60,
    errorMessage: 'Too many registration attempts. Please try again later.',
  })
  @Mutation(() => UserResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ) {
    return this.commandBus.execute(
      new RegisterCommand(
        registerDto.email,
        registerDto.password,
        registerDto.firstname,
        registerDto.lastname,
        context.res,
      ),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => UserResponse)
  async verifyEmail(
    @Args('token') token: string,
    @Context() context: { req: Request },
  ): Promise<UserResponse> {
    const userId = context.req.user?.sub!;
    return this.commandBus.execute(new VerifiEmailCommand(token, userId));
  }

  @UseGuards(RateLimitGuard)
  @RateLimit({
    points: 5,
    duration: 60,
    errorMessage: 'Too many login attempts. Please try again in a minute.',
  })
  @Mutation(() => UserResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.commandBus.execute(
      new LoginCommand(loginDto.email, loginDto.password, context.res),
    );
  }

  @UseGuards(RateLimitGuard)
  @RateLimit({
    points: 3,
    duration: 60,
    errorMessage: 'Too many password reset requests. Please wait a minute.',
  })
  @Mutation(() => String)
  async forgotPassword(@Args('email') email: string) {
    return this.commandBus.execute(new ForgotPasswordCommand(email));
  }

  // No guard for resetPassword as users resetting forgotten passwords are not authenticated
  @UseGuards(RateLimitGuard)
  @RateLimit({
    points: 5,
    duration: 60,
    errorMessage: 'Too many password reset attempts. Please wait a minute.',
  })
  @Mutation(() => UserResponse)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
    @Context() context: { req: Request; res: Response },
  ) {
    return this.commandBus.execute(
      new ResetPasswordCommand(token, newPassword, context.res),
    );
  }

  @UseGuards(GraphQLAuthGuard)
  @Query(() => UserDto)
  async getme(@Context() context: { req: Request }) {
    const userId = context.req.user?.sub!;
    return this.queryBus.execute(new GetCurrentUserQuery(userId));
  }

  @Mutation(() => String)
  async logout(@Context() context: { req?: Request; res: Response }) {
    const req = context.req;
    const userId = req?.user?.sub;

    if (userId) {
      await this.prismaService.credential.updateMany({
        where: { userId },
        data: { refreshToken: null },
      });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
    };

    if (context.res && typeof context.res.clearCookie === 'function') {
      context.res.clearCookie('accessToken', cookieOptions);
      context.res.clearCookie('refreshToken', cookieOptions);
      context.res.clearCookie('access_token', cookieOptions);
      context.res.clearCookie('refresh_token', cookieOptions);
    }

    return 'Successfully logged out';
  }
}
