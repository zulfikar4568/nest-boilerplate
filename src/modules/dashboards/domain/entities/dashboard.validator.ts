import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Dashboard, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  TCreateDashboardRequestBody,
  TDeleteDashboardByIdRequestParams,
  TGetDashboardByIdRequestParams,
  TListDashboardRequestQuery,
  TUpdateDashboardByIdRequestParams,
  TUpdateDashboardRequestBody,
} from '../entities/dashboard.entity';
import {
  BaseQueryValidator,
  ListQueryField,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

export class ListDashboardQueryField
  extends ListQueryField
  implements Prisma.DashboardWhereInput {}

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

export class CreateDashboardValidator
  extends CreateValidator
  implements TCreateDashboardRequestBody {}

export class GetDashboardParamsValidator
  extends IDValidator
  implements TGetDashboardByIdRequestParams {}

export class UpdateDashboardParamsValidator
  extends IDValidator
  implements TUpdateDashboardByIdRequestParams {}

export class DeleteDashboardParamsValidator
  extends IDValidator
  implements TDeleteDashboardByIdRequestParams {}

export class DeleteDashboardBatchBodyValidator extends IDsValidator {}

export class UpdateDashboardValidator
  extends UpdateValidator
  implements TUpdateDashboardRequestBody {}
