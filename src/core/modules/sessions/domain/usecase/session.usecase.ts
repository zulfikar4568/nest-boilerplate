import { Injectable } from '@nestjs/common';
import { Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import dayjs from 'dayjs';
import { instanceToPlain } from 'class-transformer';
import { SessionRepository } from '../../data/session.repository';
import { Session, TLoginSession } from '../entities/session.entity';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '@/core/base/domain/usecase/base.usecase';
import { TCompactUser, User } from '@/core/base/domain/entities/auth.entity';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import {
  InvalidRefreshToken,
  RefreshTokenExpired,
  RefreshTokenNotFound,
  UserNotFound,
  WrongPassword,
} from '@/core/base/frameworks/shared/exceptions/session.exception';
import { generateJwt } from '@/core/base/frameworks/shared/utils/jwt.util';
import { checkPassword } from '@/core/base/frameworks/shared/utils/password.util';
import { UserRepository } from '@/modules/users/data/user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionUseCase extends BaseUseCase<
  Session,
  Prisma.SessionInclude,
  Prisma.SessionSelect,
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput
> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    db: PrismaService,
  ) {
    super(sessionRepository, db);
    this.userRepository = userRepository;
  }

  private convertToCompactUser(user: User): TCompactUser {
    return {
      username: user.username,
      description: user.description,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      id: user.id,
    };
  }

  @Span('usecase session logout')
  async logout(userId: string): Promise<void> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.sessionRepository.deleteByUserId(userId, tx);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to logout!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase refresh token')
  async refreshToken(ctx: IContext): Promise<Session> {
    const refreshToken = ctx.refreshToken;
    if (refreshToken === undefined) throw new RefreshTokenNotFound();

    const user = ctx.user as TCompactUser;
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    try {
      return await this.db.$transaction(async (tx) => {
        const currentSession = await this.sessionRepository.findByRefreshToken(
          refreshToken,
          tx,
        );

        if (!currentSession) {
          throw new InvalidRefreshToken();
        }

        if (dayjs().isAfter(currentSession.expiredAt)) {
          throw new RefreshTokenExpired({
            expiredAt: dayjs(currentSession.expiredAt).format(),
          });
        }

        const jwt = await generateJwt({
          origin: ctx.headers?.['origin'] || 'http://localhost',
          userId: currentSession.userId,
          user,
        });

        const session = await this.sessionRepository.updateByRefreshToken(
          {
            data: { user: instanceToPlain(user), headers },
            expiredAt: jwt.expired,
            userId: currentSession.userId,
            token: jwt.token,
            refresh: jwt.refresh,
          },
          refreshToken,
          tx,
        );

        return session;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to refresh the token!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase session login')
  async login(ctx: IContext, body: TLoginSession): Promise<Session> {
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    try {
      return await this.db.$transaction(async (tx) => {
        const user = await this.userRepository.getByUsername(body.username, tx);

        if (!user) {
          throw new UserNotFound({ username: body.username });
        }

        const isMatch = await checkPassword(body.password, user.password);

        if (!isMatch) {
          throw new WrongPassword();
        }

        const customUser = this.convertToCompactUser(user);

        const jwt = await generateJwt({
          origin: ctx.headers?.['origin'] || 'http://localhost',
          user: customUser,
          userId: user.id,
        });

        const session = await this.repository.create(
          {
            data: { user: instanceToPlain(customUser), headers },
            userId: user.id,
            token: jwt.token,
            refresh: jwt.refresh,
            expiredAt: jwt.expired,
          },
          tx,
        );

        return session;
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to login!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
