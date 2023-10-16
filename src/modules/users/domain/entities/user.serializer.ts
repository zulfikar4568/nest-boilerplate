import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { User } from '@/core/base/domain/entities/auth.entity';

export class ListUserSerializer implements User {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  description: string | null;
  username: string;

  @Exclude()
  password: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserSerializer implements User {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  description: string | null;
  username: string;

  @Exclude()
  password: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateUserSerializer extends CreateUserSerializer {}
export class DeleteUserSerializer extends CreateUserSerializer {}
export class GetUserSerializer extends CreateUserSerializer {}
