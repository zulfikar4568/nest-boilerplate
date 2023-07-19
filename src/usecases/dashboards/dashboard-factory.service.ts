import { Injectable } from '@nestjs/common';
import {
  CreateDashboardDto,
  UpdateDashboardDto,
} from '../../core/dtos/dashboard.dto';
import { Dashboard } from '../../core/entities';

// We are using the dashboardFactoryService to convert our DTO to a business Dashboard object
@Injectable()
export class DashboardFactoryService {
  createDashboard(createDashboardDto: CreateDashboardDto) {
    const newDashboard = new Dashboard();

    newDashboard.name = createDashboardDto.name;
    newDashboard.description = createDashboardDto.description;

    return newDashboard;
  }

  updateDashboard(createDashboardDto: UpdateDashboardDto) {
    const newDashboard = new Dashboard();

    if (createDashboardDto.name) newDashboard.name = createDashboardDto.name;
    if (createDashboardDto.description)
      newDashboard.description = createDashboardDto.description;

    return newDashboard;
  }
}
