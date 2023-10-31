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
import { CreatePostRequestBodyDto } from '@src/apis/posts/dto/create-post-request-body.dto';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query-dto';
import { PatchUpdatePostBodyDto } from '@src/apis/posts/dto/patch-update-post-body.dto';
import { PostResponseDto } from '@src/apis/posts/dto/post-response.dto';
import { PutUpdatePostBodyDto } from '@src/apis/posts/dto/put-update-post-body-dto';
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
export class PostsController implements BaseController<PostResponseDto> {
  constructor(private readonly postService: PostsService) {}

  @Get()
  @ApiFindAllAndCount('post 전체 조회')
  @SetResponse({ key: 'posts', type: ResponseType.Pagination })
  async findAllAndCount(
    @Query()
    findPostListQueryDto: FindPostListQueryDto,
  ): Promise<[PostResponseDto[], number]> {
    const [posts, count] = await this.postService.findAllAndCount(
      findPostListQueryDto,
    );

    return [plainToInstance(PostResponseDto, posts), count];
  }

  @Get(':postId')
  @ApiFindOne('post 상세 조회')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  async findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<PostResponseDto> {
    const post = await this.postService.findOneOrNotFound(postId);

    const response = await this.postService.buildBaseResponse(post.id);

    return new PostResponseDto(response);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreate('post 생성')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Post()
  async create(
    @User() user: UserEntity,
    @Body() createPostBodyDto: CreatePostRequestBodyDto,
  ): Promise<PostResponseDto> {
    const newPost = await this.postService.create(user.id, createPostBodyDto);

    const response = await this.postService.buildBaseResponse(newPost.id);

    return new PostResponseDto(response);
  }

  @UseGuards(JwtAuthGuard)
  @ApiPutUpdate('post 수정')
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Put(':postId')
  async putUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() putUpdatePostDto: PutUpdatePostBodyDto,
  ): Promise<PostResponseDto> {
    const updatedPost = await this.postService.putUpdate(
      postId,
      user.id,
      putUpdatePostDto,
    );

    const response = await this.postService.buildBaseResponse(updatedPost.id);

    return new PostResponseDto(response);
  }

  @ApiPatchUpdate('post 부분 수정')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Base })
  @Patch(':postId')
  async patchUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserEntity,
    @Body() patchUpdatePostDto: PatchUpdatePostBodyDto,
  ): Promise<PostResponseDto> {
    const updatedPost = await this.postService.patchUpdate(
      postId,
      user.id,
      patchUpdatePostDto,
    );

    const response = await this.postService.buildBaseResponse(updatedPost.id);

    return new PostResponseDto(response);
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
