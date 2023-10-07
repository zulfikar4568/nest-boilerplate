import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export type TPrismaTx = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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
