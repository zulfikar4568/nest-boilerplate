import { Session as TSession, Prisma } from '@prisma/client';
import { IListRequestQuery } from '../../../../base/domain/entities/query.entity';
import { User } from '@/core/base/domain/entities/auth.entity';

export class Session implements TSession {
  id: string;
  userId: string;
  token: string;
  refresh: string;
  data: Prisma.JsonValue;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OptionalSession = Partial<Session>;
export type RequiredSession = Required<Session>;
export type TListSessionRequestQuery<P> = IListRequestQuery<
  P,
  Session,
  Prisma.SessionWhereInput
>;
export type TGetSessionByIdRequestParams = Pick<Session, 'id'>;
export type TUpdateSessionByIdRequestParams = Pick<Session, 'id'>;
export type TDeleteSessionByIdRequestParams = Pick<Session, 'id'>;
export type TCreateSessionRequestBody = Omit<
  Session,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpdateSessionRequestBody = Partial<TCreateSessionRequestBody>;
export type TLoginSession = Pick<User, 'username' | 'password'>;
