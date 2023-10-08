import { Exclude } from 'class-transformer';
import { Session } from './session.entity';

export class CreateSessionSerializer implements Session {
  id: string;

  @Exclude()
  userId: string;

  token: string;
  refresh: string;

  @Exclude()
  data: Record<string, any>;

  expiredAt: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class RefreshSessionSerializer extends CreateSessionSerializer {}
