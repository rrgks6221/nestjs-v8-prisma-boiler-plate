import { ApiProperty } from '@nestjs/swagger';

export class IdResponseType {
  @ApiProperty({
    example: 1,
    description: 'users 고유 id',
    required: true,
    type: 'number',
  })
  id: number;
}
