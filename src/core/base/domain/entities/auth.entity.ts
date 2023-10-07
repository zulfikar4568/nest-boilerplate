import { Role, User as TUser } from '@prisma/client';

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
export type TCompactUser = Omit<User, 'createdAt' | 'updatedAt'>;
export type OptionalUser = Partial<User>;
