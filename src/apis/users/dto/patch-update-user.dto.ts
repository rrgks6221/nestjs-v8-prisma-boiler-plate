import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsEmail, IsOptional } from 'class-validator';

export class PatchUpdateUserBodyDto
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
  })
  @IsNotEmptyString()
  @IsOptional()
  nickname?: string;
}
