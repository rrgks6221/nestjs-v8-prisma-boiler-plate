import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsEmail } from 'class-validator';

export class PutUpdateUserBodyDto implements Partial<CreateUserRequestBodyDto> {
  @ApiProperty({
    example: 'example@example.com',
    description: 'user email',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: 'users 이름',
  })
  @IsNotEmptyString()
  nickname: string;
}
