import { Module } from '@nestjs/common';
import { DataServiceModule } from './services/data-services/data-service.module';
import { DashboardUseCaseModule } from './usecases/dashboards/dashboard.usecase.module';
import { AuditServiceModule } from './services/audit-services/audit.service.module';
import { DashboardController } from './controllers';

@Module({
  imports: [DataServiceModule, DashboardUseCaseModule, AuditServiceModule],
  controllers: [DashboardController],
  providers: [],
})
export class AppModule {}
