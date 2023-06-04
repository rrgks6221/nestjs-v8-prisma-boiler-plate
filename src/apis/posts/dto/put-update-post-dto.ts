import { PickType } from '@nestjs/swagger';
import { CreatePostDto } from '@src/apis/posts/dto/create-post.dto';

export class PutUpdatePostDto extends PickType(CreatePostDto, [
  'title',
  'description',
] as const) {}
