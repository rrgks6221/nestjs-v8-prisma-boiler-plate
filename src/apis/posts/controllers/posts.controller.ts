import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
import {
  ApiCreate,
  ApiFindAllAndCount,
  ApiFindOne,
  ApiPatchUpdate,
  ApiPutUpdate,
  ApiRemove,
} from '@src/apis/posts/controllers/posts.swagger';
import { CreatePostBodyDto } from '@src/apis/posts/dto/create-post-body.dto';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query-dto';
import { PatchUpdatePostBodyDto } from '@src/apis/posts/dto/patch-update-post-body.dto';
import { PostBaseResponseDto } from '@src/apis/posts/dto/post-base-response.dto';
import { PutUpdatePostBodyDto } from '@src/apis/posts/dto/put-update-post-body-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import {
  ResponseType,
  SetResponse,
} from '@src/decorators/set-response.decorator';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { BaseController } from '@src/types/type';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('api/posts')
export class PostsController
  implements BaseController<PostEntity, PostBaseResponseDto>
{
  constructor(private readonly postService: PostsService) {}

  @Get()
  @ApiFindAllAndCount('post 전체 조회')
  @SetResponse({ key: 'posts', type: ResponseType.Pagination })
  async findAllAndCount(
    @Query()
    findPostListQueryDto: FindPostListQueryDto,
  ): Promise<[PostEntity[], number]> {
    const [posts, count] = await this.postService.findAllAndCount(
      findPostListQueryDto,
    );

    return [plainToInstance(PostEntity, posts), count];
  }

  @Get(':postId')
  @ApiFindOne('post 상세 조회')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  async findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<PostBaseResponseDto> {
    const post = await this.postService.findOne(postId);

    return new PostBaseResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreate('post 생성')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Post()
  async create(
    @User() user: UserEntity,
    @Body() createPostBodyDto: CreatePostBodyDto,
  ): Promise<PostBaseResponseDto> {
    const newPost = await this.postService.create(user.id, createPostBodyDto);

    return new PostBaseResponseDto(newPost);
  }

  @UseGuards(JwtAuthGuard)
  @ApiPutUpdate('post 수정')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Put(':postId')
  async putUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() putUpdatePostDto: PutUpdatePostBodyDto,
  ): Promise<PostBaseResponseDto> {
    const updatedPost = await this.postService.putUpdate(
      postId,
      user.id,
      putUpdatePostDto,
    );

    return new PostBaseResponseDto(updatedPost);
  }

  @ApiPatchUpdate('post 부분 수정')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Patch(':postId')
  async patchUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() patchUpdatePostDto: PatchUpdatePostBodyDto,
  ): Promise<PostBaseResponseDto> {
    const updatedPost = await this.postService.patchUpdate(
      postId,
      user.id,
      patchUpdatePostDto,
    );

    return new PostBaseResponseDto(updatedPost);
  }

  @ApiRemove('post 삭제')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Delete })
  @Delete(':postId')
  remove(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
  ): Promise<number> {
    return this.postService.remove(postId, user.id);
  }
}
