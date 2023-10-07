import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum ESortMode {
  ASC = 'asc',
  DESC = 'desc',
}

export type QueryMode = Prisma.QueryMode;

export class StringFilterQuery
  implements Prisma.StringFilter, Prisma.StringNullableFilter
{
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'equals',
    example: '',
    type: String,
  })
  contains?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'endsWith',
    example: '',
    type: String,
  })
  endsWith?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'equals',
    example: '',
    type: String,
  })
  equals?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'gt',
    example: '',
    type: String,
  })
  gt?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'gte',
    example: '',
    type: String,
  })
  gte?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'in',
    example: [],
    type: [String],
  })
  in?: string[] | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'lt',
    example: '',
    type: String,
  })
  lt?: string | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'lte',
    example: '',
    type: String,
  })
  lte?: string | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'mode: "default" | "insensitive"',
    example: 'default',
    type: 'QueryMode',
  })
  mode?: Prisma.QueryMode | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'not',
    example: '',
    type: String,
  })
  not?: string | Prisma.NestedStringFilter<never> | undefined;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: 'notIn',
    example: [],
    type: [String],
  })
  notIn?: string[] | undefined;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'startsWith',
    example: '',
    type: String,
  })
  startsWith?: string | undefined;
}

export class DateTimeFilterQuery implements Prisma.DateTimeFilter {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'equals',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  equals?: string | Date | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'gt',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  gt?: string | Date | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'gte',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  gte?: string | Date | undefined;

  @Expose()
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: 'in',
    example: [new Date('2022-01-30'), new Date('2022-01-30')],
    oneOf: [{ type: 'string[]' }, { type: 'Date[]' }],
  })
  in?: string[] | Date[] | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'lt',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  lt?: string | Date | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'lte',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  lte?: string | Date | undefined;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'not',
    example: new Date('2022-01-30'),
    oneOf: [{ type: 'string' }, { type: 'Date' }],
  })
  not?: string | Date | Prisma.NestedDateTimeFilter<never> | undefined;

  @Expose()
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: 'notIn',
    example: [new Date('2022-01-30'), new Date('2022-01-30')],
    oneOf: [{ type: 'string[]' }, { type: 'Date[]' }],
  })
  notIn?: string[] | Date[] | undefined;
}
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
