import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { BaseUseCase } from '../domain/usecase/base.usecase';
import { IDValidator, IDsValidator } from '../domain/entities/validator.entity';
import SerializerInterceptor from '../frameworks/shared/interceptors/serializer.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';

export abstract class BaseController<T extends Record<string, any>, C, U> {
  constructor(protected _usecase: BaseUseCase<T, C, U>) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization(Role.USER)
  public async allSimple() {
    const result = await this._usecase.listDropdown();

    return new SuccessResponse('dashboard fetched successfully', result);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  // @UseList(FilterDashboardQueryValidator)
  // @Serializer(ListDashboardSerializer)
  // @ApiFilterQuery('filters', ListDashboardQueryValidator)
  @Authentication(true)
  @Authorization(Role.USER)
  public async lists(@Context() ctx: IContext) {
    const { meta, result } = await this._usecase.list(ctx);

    return new SuccessResponse('dashboard fetched successfully', result, meta);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Serializer(CreateDashboardSerializer)
  @UseInterceptors(SerializerInterceptor)
  @Authentication(true)
  @Authorization(Role.USER)
  public async create(@Body() body: C): Promise<SuccessResponse> {
    const result = await this._usecase.create(body);

    return new SuccessResponse('dashboard created successfully', result);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // @Serializer(GetDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async get(@Param() params: IDValidator) {
    const result = await this._usecase.get(params);

    return new SuccessResponse('dashboard fetched successfully', result);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  // @Serializer(UpdateDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async update(
    @Param() params: IDValidator,
    @Body() body: U,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.update(params, body);

    return new SuccessResponse('dashboard updated successfully', result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  // @Serializer(DeleteDashboardSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async delete(@Param() params: IDValidator): Promise<SuccessResponse> {
    const result = await this._usecase.delete(params);

    return new SuccessResponse('dashboard deleted successfully', result);
  }

  @Delete('/batch/delete')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization(Role.USER)
  public async deleteBatch(
    @Body() body: IDsValidator,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.deleteBatch(body);

    return new SuccessResponse('dashboard delete batched successfully', result);
  }
}
