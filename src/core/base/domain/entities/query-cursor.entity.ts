import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DateTimeFilterQuery, StringFilterQuery } from './prisma.entity';

export enum ESortMode {
  ASC = 'asc',
  DESC = 'desc',
}

export type QueryMode = Prisma.QueryMode;
export interface IMeta {
  total: number;
  lastCursor: string;
}

export interface IListResult<T> {
  result: T[];
  meta: IMeta;
}

export interface IListRequestQuery<E = any, F = any> {
  filters: {
    pagination: {
      cursor: string;
      limit: number;
    };
    sort: {
      by: keyof E;
      mode: ESortMode;
    };
    field?: F;
  };
}

export class PaginationQuery {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    description: 'Cursor Id',
    example: '',
    type: 'string',
  })
  cursor = '';

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Limit', example: 25 })
  limit = 25;
}

export class SortQuery<E> {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Sort By',
    example: 'createdAt',
    type: String,
  })
  by: keyof E | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsEnum(ESortMode)
  @ApiPropertyOptional({ description: 'Sort', example: 'asc', enum: ESortMode })
  mode: ESortMode;
}

export class BaseQueryValidator<E> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PaginationQuery)
  @ApiPropertyOptional({ type: PaginationQuery })
  pagination: PaginationQuery;

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => SortQuery)
  @ApiPropertyOptional({ type: SortQuery<E> })
  sort: SortQuery<E>;
}

export class ListQueryField {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  id?: string | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  name?: string | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  description?: string | null | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => DateTimeFilterQuery)
  @ApiPropertyOptional({ type: DateTimeFilterQuery })
  createdAt?: string | Date | undefined;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => DateTimeFilterQuery)
  @ApiPropertyOptional({ type: DateTimeFilterQuery })
  updatedAt?: string | Date | undefined;
}
