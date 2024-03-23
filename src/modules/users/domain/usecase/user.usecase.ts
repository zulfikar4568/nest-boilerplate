import { Injectable } from '@nestjs/common';
import { Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import PrismaService from '../../../../core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { UserRepository } from '../../data/user.repository';
import {
  TCompactUser,
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
} from '@/modules/users/domain/entities/user.exception';
import { generatePassword } from '@/core/base/frameworks/shared/utils/password.util';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserUseCase extends BaseUseCase<
  User,
  Prisma.UserInclude,
  Prisma.UserSelect,
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
  Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  Prisma.UserCreateManyInput[] | Prisma.UserCreateManyInput,
  Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
> {
  constructor(
    protected repository: UserRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  /**
   * This is overriding method
   * @param {TCreateUserRequestBody} body
   * @returns {Promise<User>}
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
          message: `Error unexpected during create a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overriding method
   * @param {TUpdateUserByIdRequestParams} params
   * @param {TUpdateUserRequestBody} body
   * @returns {Promise<User>}
   */
  @Span('usecase update user')
  async update(
    params: TUpdateUserByIdRequestParams,
    body: TUpdateUserRequestBody,
  ): Promise<User> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.getById(params.id, tx);

        if (body.password !== body.confirmPassword) {
          throw new PasswordIsNotMatch({
            message: 'Failed update the user!',
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
          message: `Error unexpected during change a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * Delete with check current user, we cannot delete our self
   * @param {TDeleteUserByIdRequestParams} params
   * @param {TCompactUser} currentUser
   * @returns {Promise<User>}
   */
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
        await this.repository.getById(params.id, tx);
        return await this.repository.delete(params.id, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
