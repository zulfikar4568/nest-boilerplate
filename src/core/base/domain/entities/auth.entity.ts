import { Role, User as TUser } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity implements TUser {
  email: string | null;
  phoneNumber: string | null;
  username: string;
  password: string;
  roles: Role[];
}
export type TCompactUser = Omit<User, 'createdAt' | 'updatedAt' | 'password'>;
export type OptionalUser = Partial<User>;
