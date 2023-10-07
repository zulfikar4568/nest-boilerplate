import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Dashboard, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  TCreateDashboardRequestBody,
  TDeleteDashboardByIdRequestParams,
  TListDashboardRequestQuery,
  TUpdateDashboardByIdRequestParams,
  TUpdateDashboardRequestBody,
} from '../entities/dashboard.entity';
import {
  BaseQueryValidator,
  DateTimeFilterQuery,
  StringFilterQuery,
} from '@/core/base/domain/entities';

export class ListDashboardQueryField implements Prisma.DashboardWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  id?: string | Prisma.StringFilter<'Dashboard'> | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  name?: string | Prisma.StringFilter<'Dashboard'> | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  description?:
    | string
    | Prisma.StringNullableFilter<'Dashboard'>
    | null
    | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => DateTimeFilterQuery)
  @ApiPropertyOptional({ type: DateTimeFilterQuery })
  createdAt?: string | Date | Prisma.DateTimeFilter<'Dashboard'> | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => DateTimeFilterQuery)
  @ApiPropertyOptional({ type: DateTimeFilterQuery })
  updatedAt?: string | Date | Prisma.DateTimeFilter<'Dashboard'> | undefined;
}

export class ListDashboardQueryValidator extends BaseQueryValidator<Dashboard> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDashboardQueryField)
  @ApiPropertyOptional({ type: ListDashboardQueryField })
  field?: ListDashboardQueryField;
}

export class FilterDashboardQueryValidator
  implements TListDashboardRequestQuery
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDashboardQueryValidator)
  filters: ListDashboardQueryValidator;
}

export class CreateDashboardValidator implements TCreateDashboardRequestBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Test',
    description: 'Name!',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Test Description',
    description: 'Description Dashboard!',
  })
  description: string | null;
}

export class UpdateDashboardParamsValidator
  implements TUpdateDashboardByIdRequestParams
{
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
    description: 'Dashboard ID!',
  })
  id: string;
}

export class DeleteDashboardParamsValidator
  extends UpdateDashboardParamsValidator
  implements TDeleteDashboardByIdRequestParams {}

export class UpdateDashboardValidator implements TUpdateDashboardRequestBody {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Test',
    description: 'Name!',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Test Description',
    description: 'Description Dashboard!',
  })
  description?: string | null;
}
