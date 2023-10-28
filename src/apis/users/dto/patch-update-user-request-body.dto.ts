import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_NICKNAME_LENGTH } from '@src/apis/users/constants/user.constant';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class PatchUpdateUserRequestBodyDto
  implements Partial<CreateUserRequestBodyDto>
{
  @ApiPropertyOptional({
    example: 'example@example.com',
    description: 'user email',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '홍길동',
    description: 'users 이름',
    minLength: USER_NICKNAME_LENGTH.MIN,
    maxLength: USER_NICKNAME_LENGTH.MAX,
  })
  @Length(USER_NICKNAME_LENGTH.MIN, USER_NICKNAME_LENGTH.MAX)
  @IsNotEmptyString()
  @IsOptional()
  nickname?: string;
}
