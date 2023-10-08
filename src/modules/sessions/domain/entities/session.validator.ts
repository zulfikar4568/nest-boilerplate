import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TLoginSession } from './session.entity';

export class LoginSessionRequestBodyValidator implements TLoginSession {
  @ApiProperty({
    example: 'admin',
    description: 'Insert your username in Here!',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'admin',
    description: 'Insert your Password in Here!',
  })
  @IsString()
  password: string;
}
