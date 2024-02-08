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
import { UserUseCase } from '../domain/usecase/user.usecase';
import { TCompactUser } from '../domain/entities/user.entity';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import {
  CreateUserSerializer,
  DeleteUserSerializer,
  GetUserSerializer,
  ListUserSerializer,
  UpdateUserSerializer,
} from '@/modules/Users/domain/entities/User.serializer';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import {
  CreateUserValidator,
  DeleteUserBatchBodyValidator,
  DeleteUserParamsValidator,
  FilterCursorUserQueryValidator,
  FilterPaginationUserQueryValidator,
  GetUserParamsValidator,
  ListCursorUserQueryValidator,
  ListPaginationUserQueryValidator,
  UpdateUserParamsValidator,
  UpdateUserValidator,
} from '@/modules/Users/domain/entities/User.validator';
import UseList from '@/core/base/frameworks/shared/decorators/uselist.decorator';
import { ApiFilterQuery } from '@/core/base/frameworks/shared/decorators/api-filter-query.decorator';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import User from '@/core/base/frameworks/shared/decorators/user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private _usecase: UserUseCase) {}

  @Get('dropdown')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization(Role.USER)
  public async listDropdown() {
    const result = await this._usecase.listDropdown();

    return new SuccessResponse('user fetched successfully', result);
  }

  @Get('pagination')
  @HttpCode(HttpStatus.OK)
  @UseList(FilterPaginationUserQueryValidator)
  @Serializer(ListUserSerializer)
  @ApiFilterQuery('filters', ListPaginationUserQueryValidator)
  @Authentication(true)
  @Authorization(Role.USER)
  public async listPagination(@Context() ctx: IContext) {
    const { result, meta } = await this._usecase.listPagination(ctx);

    return new SuccessResponse('user fetched successfully', result, meta);
  }

  @Get('cursor')
  @HttpCode(HttpStatus.OK)
  @UseList(FilterCursorUserQueryValidator)
  @Serializer(ListUserSerializer)
  @ApiFilterQuery('filters', ListCursorUserQueryValidator)
  @Authentication(true)
  @Authorization(Role.USER)
  public async listCursor(@Context() ctx: IContext) {
    const { meta, result } = await this._usecase.listCursor(ctx);

    return new SuccessResponse('user fetched successfully', result, meta);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateUserSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async create(
    @Body() body: CreateUserValidator,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.create(body);

    return new SuccessResponse('user created successfully', result);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Serializer(GetUserSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async get(@Param() params: GetUserParamsValidator) {
    const result = await this._usecase.get(params);

    return new SuccessResponse('user fetched successfully', result);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(UpdateUserSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async update(
    @Param() params: UpdateUserParamsValidator,
    @Body() body: UpdateUserValidator,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.update(params, body);

    return new SuccessResponse('user updated successfully', result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteUserSerializer)
  @Authentication(true)
  @Authorization(Role.USER)
  public async delete(
    @Param() params: DeleteUserParamsValidator,
    @User() currentUser: TCompactUser,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.deleteWithCurrentUserCheck(
      params,
      currentUser,
    );

    return new SuccessResponse('user deleted successfully', result);
  }

  @Delete('/batch/delete')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization(Role.USER)
  public async deleteBatch(
    @Body() body: DeleteUserBatchBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this._usecase.deleteBatch(body);

    return new SuccessResponse('user delete batched successfully', result);
  }
}
