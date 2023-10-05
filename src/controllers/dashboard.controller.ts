import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardUseCase } from '../usecases/dashboards';
import SuccessResponse from '@/frameworks/shared/responses/success.response';
import {
  CreateDashboardSerializer,
  DeleteDashboardSerializer,
  UpdateDashboardSerializer,
} from '@/core/serializer/dashboard.serializer';
import Serializer from '@/frameworks/shared/decorators/serializer.decorator';
import {
  CreateDashboardValidator,
  DeleteDashboardParamsValidator,
  UpdateDashboardParamsValidator,
  UpdateDashboardValidator,
} from '@/core/validator/dashboard.validator';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardUseCase: DashboardUseCase) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  // @Authentication(true)
  // @Authorization(Role.USER)
  public async allSimple() {
    const result = await this.dashboardUseCase.allSimpleDashboard();

    return new SuccessResponse('dashboard fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateDashboardSerializer)
  // @Authentication(true)
  // @Authorization(Role.USER)
  public async create(
    @Body() body: CreateDashboardValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.createDashboard(body);

    return new SuccessResponse('dashboard created successfully', result);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdateDashboardSerializer)
  // @Authentication(true)
  // @Authorization(Role.USER)
  public async update(
    @Param() params: UpdateDashboardParamsValidator,
    @Body() body: UpdateDashboardValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.updateDashboard(params, body);

    return new SuccessResponse('dashboard updated successfully', result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteDashboardSerializer)
  // @Authentication(true)
  // @Authorization(Role.USER)
  public async delete(
    @Param() params: DeleteDashboardParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.deleteBarang(params);

    return new SuccessResponse('dashboard deleted successfully', result);
  }
}
