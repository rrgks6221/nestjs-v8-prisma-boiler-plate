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
import { Post as PostModel } from '@prisma/client';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
import { PatchUpdatePostDto } from '@src/apis/posts/dto/patch-update-post.dto';
import { PostListQueryDto } from '@src/apis/posts/dto/post-list-query-dto';
import { PutUpdatePostDto } from '@src/apis/posts/dto/put-update-post-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import {
  ResponseType,
  SetResponse,
} from '@src/decorators/set-response.decorator';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { CreatePostBodyDto } from '../dto/create-post-body.dto';
import { PostsService } from '../services/posts.service';

@ApiBearerAuth()
@ApiTags('post')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'post 전체 조회' })
  @ApiOkResponse({ type: [PostEntity] })
  @SetResponse({ key: 'posts', type: ResponseType.Pagination })
  findAllAndCount(
    @Query()
    query: PostListQueryDto,
  ): Promise<[PostModel[], number]> {
    return this.postService.findAllAndCount(query);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'post 상세 조회' })
  @ApiOkResponse({ type: PostEntity })
  @SetResponse({ key: 'post', type: ResponseType.Base })
  findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<PostModel> {
    return this.postService.findOne(postId);
  }

  @ApiOperation({ summary: 'post 생성' })
  @ApiCreatedResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Post()
  create(
    @User() user: UserEntity,
    @Body() createPostDto: CreatePostBodyDto,
  ): Promise<PostModel> {
    return this.postService.create(user.id, createPostDto);
  }

  @ApiOperation({ summary: 'post 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Put(':postId')
  putUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() putUpdatePostDto: PutUpdatePostDto,
  ): Promise<PostModel> {
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
    @Body() patchUpdatePostDto: PatchUpdatePostDto,
  ): Promise<PostModel> {
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
