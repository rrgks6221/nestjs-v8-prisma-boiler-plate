import { PickType } from '@nestjs/swagger';
import { CreatePostBodyDto } from '@src/apis/posts/dto/create-post-body.dto';

export class PutUpdatePostBodyDto extends PickType(CreatePostBodyDto, [
  'title',
  'description',
] as const) {}
