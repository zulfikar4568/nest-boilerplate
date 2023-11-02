import { Module } from '@nestjs/common';
import { SessionModule } from './sessions/session.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, SessionModule],
})
export class RegistrationModule {}
