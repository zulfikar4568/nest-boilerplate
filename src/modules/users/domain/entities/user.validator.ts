import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { User, Prisma, Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  TCreateUserRequestBody,
  TDeleteUserByIdRequestParams,
  TGetUserByIdRequestParams,
  TListUserRequestQuery,
  TUpdateUserByIdRequestParams,
  TUpdateUserRequestBody,
} from './user.entity';
import {
  BaseCursorQueryValidator,
  BasePaginationQueryValidator,
  IListCursorRequest,
  IListPaginationRequest,
  ListQueryField,
  StringFilterQuery,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

// For field filter in list whether cursor or pagination
export class ListUserQueryField
  extends ListQueryField
  implements Prisma.UserWhereInput
{
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  email?: string | null;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  phoneNumber?: string | null;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  username?: string;
}

// Create filters class for Cursor Type
export class ListCursorUserQueryValidator extends BaseCursorQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

// Create filters class for Pagination Type
export class ListPaginationUserQueryValidator extends BasePaginationQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

// implement filter class for Cursor Type
export class FilterCursorUserQueryValidator
  implements TListUserRequestQuery<IListCursorRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListCursorUserQueryValidator)
  filters: ListCursorUserQueryValidator;
}

// implement filter class for Pagination Type
export class FilterPaginationUserQueryValidator
  implements TListUserRequestQuery<IListPaginationRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPaginationUserQueryValidator)
  filters: ListPaginationUserQueryValidator;
}

export class CreateUserValidator
  extends CreateValidator
  implements TCreateUserRequestBody
{
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'John@company.com',
    description: 'Email User!',
  })
  email: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '085725653154',
    description: 'Phone Number User!',
  })
  phoneNumber: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john',
    description: 'Username User!',
  })
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({
    example: 'john123',
    description: 'Password User!',
  })
  password: string;

  @ApiProperty({
    example: 'john123',
    description: 'Harus sama dengan password',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    example: [Role.ADMIN, Role.USER],
    description: 'Beberapa User Role!',
  })
  @IsArray()
  @IsNotEmpty()
  roles: Role[];
}

export class UpsertUserValidator
  extends CreateUserValidator
  implements TUpdateUserRequestBody {}

export class UpdateUserParamsValidator
  extends IDValidator
  implements TUpdateUserByIdRequestParams {}

export class GetUserParamsValidator
  extends IDValidator
  implements TGetUserByIdRequestParams {}

export class DeleteUserParamsValidator
  extends IDValidator
  implements TDeleteUserByIdRequestParams {}

export class DeleteUserBatchBodyValidator extends IDsValidator {}

export class UpdateUserValidator
  extends UpdateValidator
  implements TUpdateUserRequestBody {}
