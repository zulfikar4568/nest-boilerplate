import { Prisma, Role, User as TUser } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';

export class User implements TUser {
  id: string;
  namaLengkap: string;
  email: string | null;
  noHP: string | null;
  deskripsi: string | null;
  username: string;
  password: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

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
