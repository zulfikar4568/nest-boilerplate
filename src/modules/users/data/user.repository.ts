import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../domain/entities/user.entity';
import { BaseRepository } from '@/core/base/data/base.repository';
import { TPrismaTx } from '@/core/base/domain/entities';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserInclude,
  Prisma.UserSelect,
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
  Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  Prisma.UserCreateManyInput[] | Prisma.UserCreateManyInput,
  Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
> {
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
