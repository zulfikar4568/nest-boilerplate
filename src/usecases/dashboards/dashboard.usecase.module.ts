import { Module } from '@nestjs/common';
import { MessagingServiceModule } from '../../services/messaging-services/messaging.service.module';
import { DataServiceModule } from '../../services/data-services/data-service.module';
import { DashboardUseCase } from './dashboard.usecase';

@Module({
  imports: [DataServiceModule, MessagingServiceModule],
  providers: [DashboardUseCase],
  exports: [DashboardUseCase],
})
export class DashboardUseCaseModule {}
