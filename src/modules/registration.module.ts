import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboards/dashboard.module';
import { SessionModule } from './sessions/session.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [DashboardModule, UserModule, SessionModule],
})
export class RegistrationModule {}
