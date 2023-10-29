import { Prisma } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Session,
  TUpdateSessionRequestBody,
} from '../domain/entities/session.entity';
import { BaseRepository } from '@/core/base/data/base.repository';
import { TPrismaTx } from '@/core/base/domain/entities';
import { InvalidRefreshToken } from '@/core/base/frameworks/shared/exceptions/session.exception';

@Injectable()
export class SessionRepository extends BaseRepository<Session> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(Session, cacheManager);
  }

  async deleteByUserId(userId: string, tx: TPrismaTx): Promise<void> {
    await tx[this._entity].deleteMany({
      where: {
        userId,
      },
    });
  }

  async findByRefreshToken(
    refreshToken: string,
    tx: TPrismaTx,
  ): Promise<Session> {
    const session = await tx[this._entity].findUnique({
      where: {
        refresh: refreshToken,
      },
    });

    if (!session) {
      throw new InvalidRefreshToken();
    }

    return session;
  }

  async updateByRefreshToken(
    body: TUpdateSessionRequestBody,
    refreshToken: string,
    tx: TPrismaTx,
  ): Promise<Session> {
    const session = await tx[this._entity].update({
      where: {
        refresh: refreshToken,
      },
      data: {
        userId: body.userId,
        token: body.token,
        refresh: body.refresh,
        expiredAt: body.expiredAt,
        data: body.data as Prisma.JsonObject,
      },
    });

    return session;
  }
}
