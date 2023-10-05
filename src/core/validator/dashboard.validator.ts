import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  TCreateDashboardRequestBody,
  TDeleteDashboardByIdRequestParams,
  TUpdateDashboardByIdRequestParams,
  TUpdateDashboardRequestBody,
} from '../entities';

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
