import { Module } from '@nestjs/common';
import { AuditDashboardModule } from '../../frameworks/audit-services';

@Module({
  imports: [AuditDashboardModule],
  exports: [AuditDashboardModule],
})
export class AuditServiceModule {}
