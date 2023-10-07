import { Dashboard } from '@prisma/client';
import { IMessagingServices } from 'src/core/abstracts';

export class MessagingDashboardService
  implements IMessagingServices<Dashboard>
{
  sendAudit(data: Dashboard): Promise<boolean> {
    return this.sendingDataToTheAudit(data);
  }

  private async sendingDataToTheAudit(data: Dashboard) {
    console.log(data);
    // Send the data to the Audit Microservice or another system
    return true;
  }
}
