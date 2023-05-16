import { IAuditServices } from 'src/core/abstracts';
import { Dashboard } from '../../core/entities';

export class AuditDashboardService implements IAuditServices<Dashboard> {
  addHistoryAudit(data: Dashboard): Promise<boolean> {
    return this.sendingDataToTheAudit(data);
  }

  private async sendingDataToTheAudit(data: Dashboard) {
    console.log(data);
    // Send the data to the Audit Microservice or another system
    return true;
  }
}
