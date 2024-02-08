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

//#region Common
export enum ESortMode {
  ASC = 'asc',
  DESC = 'desc',
}

export type QueryMode = Prisma.QueryMode;

export interface IListRequestQuery<
  P = IListCursorRequest | IListPaginationRequest,
  E = any,
  F = any,
> {
  filters: {
    pagination: P;
    sort: {
      by: keyof E;
      mode: ESortMode;
    };
    field?: F;
  };
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
//#endregion

//#region Cursor
export interface ICursorMeta {
  total: number;
  lastCursor: string;
}

export interface IListCursorResult<T> {
  result: T[];
  meta: ICursorMeta;
}

export interface IListCursorRequest {
  cursor: string;
  limit: number;
}

export class CursorQuery {
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

export class BaseCursorQueryValidator<E> extends BaseQueryValidator<E> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => CursorQuery)
  @ApiPropertyOptional({ type: CursorQuery })
  pagination: CursorQuery;
}
//#endregion

//#region Pagination
export interface IPaginationMeta {
  count: number;
  total: number;
  page: number;
  totalPage: number;
}

export interface IListPaginationResult<T> {
  result: T[];
  meta: IPaginationMeta;
}

export interface IListPaginationRequest {
  page: number;
  limit: number;
}

export class PaginationQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page', example: 1 })
  page = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Limit', example: 25 })
  limit = 25;
}

export class BasePaginationQueryValidator<E> extends BaseQueryValidator<E> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PaginationQuery)
  @ApiPropertyOptional({ type: PaginationQuery })
  pagination: PaginationQuery;
}
//#endregion
