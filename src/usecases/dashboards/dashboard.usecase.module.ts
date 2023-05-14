import { Module } from '@nestjs/common';
import { AuditServiceModule } from 'src/services/audit-services/audit.service.module';
import { DataServiceModule } from 'src/services/data-services/data-service.module';
import { DashboardUseCase } from './dashboard.usecase';
import { DashboardFactoryService } from './dashboard-factory.service';

@Module({
  imports: [DataServiceModule, AuditServiceModule],
  providers: [DashboardFactoryService, DashboardUseCase],
  exports: [DashboardFactoryService, DashboardUseCase],
})
export class DashboardUseCaseModule {}
