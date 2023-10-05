import { Prisma, User } from '@prisma/client';
import { IListRequestQuery } from './query-cursor.entity';

export type OptionalUser = Partial<User>;
export type RequiredUser = Required<User>;
export type TListUserRequestQuery = IListRequestQuery<
  User,
  Prisma.UserWhereInput
>;
export type TGetUserByIdRequestParams = Pick<User, 'id'>;
export type TUpdateUserByIdRequestParams = Pick<User, 'id'>;
export type TDeleteUserByIdRequestParams = Pick<User, 'id'>;
export type TCreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type TCreateUserRequestBody = TCreateUser & { confirmPassword: string };
export type TUpdateUser = Partial<TCreateUser>;
export type TUpdateUserRequestBody = Partial<TCreateUserRequestBody>;
export type TCompactUser = Omit<User, 'createdAt' | 'updatedAt'>;
