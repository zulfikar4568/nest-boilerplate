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
import { Role } from '@prisma/client';
import { DashboardUseCase } from '../domain/usecase/dashboard.usecase';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import {
  CreateDashboardSerializer,
  DeleteDashboardSerializer,
  ListDashboardSerializer,
  UpdateDashboardSerializer,
} from '@/modules/dashboards/domain/entities/dashboard.serializer';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import {
  CreateDashboardValidator,
  DeleteDashboardParamsValidator,
  FilterDashboardQueryValidator,
  ListDashboardQueryValidator,
  UpdateDashboardParamsValidator,
  UpdateDashboardValidator,
} from '@/modules/dashboards/domain/entities/dashboard.validator';
import UseList from '@/core/base/frameworks/shared/decorators/uselist.decorator';
import { ApiFilterQuery } from '@/core/base/frameworks/shared/decorators/api-filter-query.decorator';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardUseCase: DashboardUseCase) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization(Role.USER)
  public async allSimple() {
    const result = await this.dashboardUseCase.listDropdown();

    return new SuccessResponse('dashboard fetched successfully', result);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseList(FilterDashboardQueryValidator)
  @Serializer(ListDashboardSerializer)
  @ApiFilterQuery('filters', ListDashboardQueryValidator)
  @Authentication(true)
  @Authorization(Role.USER)
  public async lists(@Context() ctx: IContext) {
    const { meta, result } = await this.dashboardUseCase.list(ctx);

    return new SuccessResponse('barang fetched successfully', result, meta);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async create(
    @Body() body: CreateDashboardValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.create(body);

    return new SuccessResponse('dashboard created successfully', result);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdateDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async update(
    @Param() params: UpdateDashboardParamsValidator,
    @Body() body: UpdateDashboardValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.update(params, body);

    return new SuccessResponse('dashboard updated successfully', result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async delete(
    @Param() params: DeleteDashboardParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardUseCase.delete(params);

    return new SuccessResponse('dashboard deleted successfully', result);
  }
}
