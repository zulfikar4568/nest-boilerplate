import { Module } from '@nestjs/common';
import { AuditDashboardModule } from 'src/frameworks/audit-services';

@Module({
  imports: [AuditDashboardModule],
  exports: [AuditDashboardModule],
})
export class AuditServiceModule {}
