import { Module } from '@nestjs/common';
import { IMessagingServices } from '../../core/abstracts';
import { MessagingDashboardService } from './messaging-dashboard.service';

@Module({
  providers: [
    {
      provide: IMessagingServices,
      useClass: MessagingDashboardService,
    },
  ],
  exports: [IMessagingServices],
})
export class MessagingDashboardModule {}
