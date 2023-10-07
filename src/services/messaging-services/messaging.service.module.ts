import { Module } from '@nestjs/common';
import { MessagingDashboardModule } from '../../frameworks/messaging-services';

@Module({
  imports: [MessagingDashboardModule],
  exports: [MessagingDashboardModule],
})
export class MessagingServiceModule {}
