import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Dashboard } from '../entities';

export class CreateDashboardDto extends Dashboard {
  @IsString()
  @IsNotEmpty()
  @Length(0, 5)
  name: string;

  @IsString()
  description: string | null;
}

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) {}
