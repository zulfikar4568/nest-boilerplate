import { Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import { Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import PrismaService from '../../../../core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { UserRepository } from '../../data/user.repository';
import {
  TCompactUser,
  TCreateUser,
  TCreateUserRequestBody,
  TDeleteUserByIdRequestParams,
  TUpdateUserByIdRequestParams,
  TUpdateUserRequestBody,
  User,
} from '../entities/user.entity';
import {
  DeleteUnauthorized,
  DuplicateUser,
  PasswordIsNotMatch,
} from '@/core/base/frameworks/shared/exceptions/user.exception';
import { generatePassword } from '@/core/base/frameworks/shared/utils/password.util';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';

@Injectable()
export class UserUseCase extends BaseUseCase<
  Dashboard,
  TCreateUser,
  TUpdateUserRequestBody
> {
  constructor(
    protected repository: UserRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  /**
   * This is overring method
   * @param {TCreateUserRequestBody} body
   */
  @Span('usecase create user')
  async create(body: TCreateUserRequestBody): Promise<User> {
    try {
      return await this.db.$transaction(async (tx) => {
        const user = await this.repository.getByUsername(body.username, tx);

        if (user) {
          throw new DuplicateUser({
            username: body.username,
          });
        }

        if (body.password !== body.confirmPassword) {
          throw new PasswordIsNotMatch({
            message: 'Failed create user!',
          });
        }

        return await this.repository.create(
          {
            description: body.description,
            email: body.email,
            name: body.name,
            phoneNumber: body.phoneNumber,
            password: await generatePassword(body.password),
            roles: body.roles,
            username: body.username,
          },
          tx,
        );
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika membuat user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overring method
   * @param {TUpdateUserByIdRequestParams} params
   * @param {TUpdateUserRequestBody} body
   * @returns {User}
   */
  @Span('usecase update user')
  async update(
    params: TUpdateUserByIdRequestParams,
    body: TUpdateUserRequestBody,
  ): Promise<User> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.get(params.id, tx);

        if (body.password !== body.confirmPassword) {
          throw new PasswordIsNotMatch({
            message: 'Failed update user!',
          });
        }

        delete body.confirmPassword;
        if (body.password)
          body.password = await generatePassword(body.password);

        return await this.repository.update(params.id, body, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengubah user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase delete user')
  async deleteWithCurrentUserCheck(
    params: TDeleteUserByIdRequestParams,
    currentUser: TCompactUser,
  ): Promise<User> {
    if (currentUser.id === params.id) {
      throw new DeleteUnauthorized({
        username: currentUser.username,
      });
    }

    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.get(params.id, tx);
        return await this.repository.delete(params.id, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika menghapus user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
