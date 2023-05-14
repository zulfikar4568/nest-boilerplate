import { Dashboard } from '../entities';

export class CreateDashboardResponseDto {
  success: boolean;

  createdDashboard: Dashboard;
}
