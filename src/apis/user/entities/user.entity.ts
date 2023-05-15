import { IntersectionType } from '@nestjs/swagger';
import { IdResponseType } from '@src/types/id-response-type';
import { DateResponseType } from '@src/types/date-response.type';
import { User } from '@prisma/client';

export class UserEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements User
{
  password: string;
  email: string;
  name: string | null;
  role: number;
}
