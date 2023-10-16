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
  BaseQueryValidator,
  ListQueryField,
  StringFilterQuery,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

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

export class ListUserQueryValidator extends BaseQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

export class FilterUserQueryValidator implements TListUserRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryValidator)
  filters: ListUserQueryValidator;
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
