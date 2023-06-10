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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
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

@ApiBearerAuth()
@ApiTags('post')
@Controller('api/posts')
export class PostsController
  implements BaseController<PostEntity, PostBaseResponseDto>
{
  constructor(private readonly postService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'post 전체 조회' })
  @ApiOkResponse({ type: [PostEntity] })
  @SetResponse({ key: 'posts', type: ResponseType.Pagination })
  findAllAndCount(
    @Query()
    findPostListQueryDto: FindPostListQueryDto,
  ): Promise<[PostEntity[], number]> {
    return this.postService.findAllAndCount(findPostListQueryDto);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'post 상세 조회' })
  @ApiOkResponse({ type: PostEntity })
  @SetResponse({ key: 'post', type: ResponseType.Base })
  findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.findOne(postId);
  }

  @ApiOperation({ summary: 'post 생성' })
  @ApiCreatedResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Post()
  create(
    @User() user: UserEntity,
    @Body() createPostBodyDto: CreatePostBodyDto,
  ): Promise<PostEntity> {
    return this.postService.create(user.id, createPostBodyDto);
  }

  @ApiOperation({ summary: 'post 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Put(':postId')
  putUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() putUpdatePostDto: PutUpdatePostBodyDto,
  ): Promise<PostEntity> {
    return this.postService.putUpdate(postId, user.id, putUpdatePostDto);
  }

  @ApiOperation({ summary: 'post 일부 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Patch(':postId')
  patchUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() patchUpdatePostDto: PatchUpdatePostBodyDto,
  ): Promise<PostEntity> {
    return this.postService.patchUpdate(postId, user.id, patchUpdatePostDto);
  }

  @ApiOperation({ summary: 'post 삭제' })
  @ApiOkResponse({ type: PostEntity })
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
