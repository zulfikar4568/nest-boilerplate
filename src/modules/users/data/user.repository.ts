import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../domain/entities/user.entity';
import { BaseRepository } from '@/core/base/data/base.repository';
import { TPrismaTx } from '@/core/base/domain/entities';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(User, cacheManager);
  }

  async getByUsername(username: string, tx: TPrismaTx): Promise<User | null> {
    const user = await tx.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }
}
