import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export abstract class IDsValidator {
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    example: [
      '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
      '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
      '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
    ],
    description: 'IDs',
  })
  ids: string[];
}

export abstract class IDValidator {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
    description: 'ID!',
  })
  id: string;
}

export abstract class CreateValidator {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Test Name',
    description: 'Name!',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Test Description',
    description: 'Description!',
  })
  description: string | null;
}

export abstract class UpdateValidator {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Test Update',
    description: 'Name Update!',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Test Description Update',
    description: 'Description Update!',
  })
  description?: string | null;
}
