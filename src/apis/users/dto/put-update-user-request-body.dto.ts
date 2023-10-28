import { PickType } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';

export class PutUpdateUserRequestBodyDto extends PickType(
  CreateUserRequestBodyDto,
  ['email', 'nickname'],
) {}
