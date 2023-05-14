import { Module } from '@nestjs/common';
import { IAuditServices } from 'src/core/abstracts';
import { AuditDashboardService } from './audit-dashboard.service';

@Module({
  providers: [
    {
      provide: IAuditServices,
      useClass: AuditDashboardService,
    },
  ],
  exports: [IAuditServices],
})
export class AuditDashboardModule {}
