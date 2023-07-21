import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDashboardResponseDto } from '../core/dtos/create-dashboard.dto';
import {
  CreateDashboardDto,
  UpdateDashboardDto,
} from '../core/dtos/dashboard.dto';
import { DashboardUseCase } from '../usecases/dashboards';
import { DashboardFactoryService } from '../usecases/dashboards/dashboard-factory.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardUseCase: DashboardUseCase,
    private dashboardFactory: DashboardFactoryService,
  ) {}

  @Get()
  async getAll() {
    return this.dashboardUseCase.getAllDashboards();
  }

  @Get(':id')
  async getById(@Param('id') id: any) {
    return this.dashboardUseCase.getDashboardById(id);
  }

  @Post()
  async createDashboard(
    @Body() dashboardDto: CreateDashboardDto,
  ): Promise<CreateDashboardResponseDto> {
    const createDashboardResponse = new CreateDashboardResponseDto();
    try {
      const dashboard = this.dashboardFactory.createDashboard(dashboardDto);
      const createDashboard = await this.dashboardUseCase.createDashboard(
        dashboard,
      );

      createDashboardResponse.success = true;
      createDashboardResponse.createdDashboard = createDashboard;
    } catch (error) {
      createDashboardResponse.success = false;
    }

    return createDashboardResponse;
  }

  @Put(':id')
  updateDashboard(
    @Param('id') dashboardId: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    const dashboard = this.dashboardFactory.updateDashboard(updateDashboardDto);
    return this.dashboardUseCase.updateDashboard(dashboardId, dashboard);
  }
}
