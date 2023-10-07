import { Role, User as TUser } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity implements TUser {
  email: string | null;
  noHP: string | null;
  deskripsi: string | null;
  username: string;
  password: string;
  roles: Role[];
}
export type TCompactUser = Omit<User, 'createdAt' | 'updatedAt'>;
export type OptionalUser = Partial<User>;
