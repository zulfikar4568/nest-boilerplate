import { Injectable } from '@nestjs/common';
import {
  TCreateUserRequestBody,
  TUpdateUserRequestBody,
  User,
} from '../domain/entities/user.entity';
import { BaseRepository } from '@/core/base/data/base.repository';
import { TPrismaTx } from '@/core/base/domain/entities';

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  TCreateUserRequestBody,
  TUpdateUserRequestBody
> {
  constructor() {
    super(User);
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
