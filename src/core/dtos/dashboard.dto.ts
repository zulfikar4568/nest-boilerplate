import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Dashboard } from '../entities';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDashboardDto extends Dashboard {
  @IsString()
  @IsNotEmpty()
  @Length(0, 5)
  name: string;

  @IsString()
  description: string | null;
}

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) {}
