import { Module } from '@nestjs/common';
import { AuditServiceModule } from '../../services/audit-services/audit.service.module';
import { DataServiceModule } from '../../services/data-services/data-service.module';
import { DashboardUseCase } from './dashboard.usecase';

@Module({
  imports: [DataServiceModule, AuditServiceModule],
  providers: [DashboardUseCase],
  exports: [DashboardUseCase],
})
export class DashboardUseCaseModule {}
