import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboards/dashboard.module';

@Module({
  imports: [DashboardModule],
})
export class RegistrationModule {}
