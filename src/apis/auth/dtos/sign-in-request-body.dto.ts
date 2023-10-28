import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDtoRequestBody {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  password: string;
}
