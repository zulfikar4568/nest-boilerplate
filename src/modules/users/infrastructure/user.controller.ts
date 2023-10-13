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
  ListUserSerializer,
  UpdateUserSerializer,
} from '@/modules/Users/domain/entities/User.serializer';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import {
  CreateUserValidator,
  DeleteUserBatchBodyValidator,
  DeleteUserParamsValidator,
  FilterUserQueryValidator,
  ListUserQueryValidator,
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

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization(Role.USER)
  public async allSimple() {
    const result = await this._usecase.listDropdown();

    return new SuccessResponse('user fetched successfully', result);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseList(FilterUserQueryValidator)
  @Serializer(ListUserSerializer)
  @ApiFilterQuery('filters', ListUserQueryValidator)
  @Authentication(true)
  @Authorization(Role.USER)
  public async lists(@Context() ctx: IContext) {
    const { meta, result } = await this._usecase.list(ctx);

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
