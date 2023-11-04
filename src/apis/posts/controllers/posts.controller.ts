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
  Version,
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
import { ApiVersion } from '@src/constants/enum';
import {
  ResponseType,
  SetResponse,
} from '@src/decorators/set-response.decorator';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { RestController } from '@src/types/type';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController implements RestController<PostResponseDto> {
  constructor(private readonly postService: PostsService) {}

  @Version(ApiVersion.One)
  @ApiFindAllAndCount('post 전체 조회')
  @SetResponse({ key: 'posts', type: ResponseType.Pagination })
  @Get()
  async findAllAndCount(
    @Query()
    findPostListQueryDto: FindPostListQueryDto,
  ): Promise<[PostResponseDto[], number]> {
    const [posts, count] = await this.postService.findAllAndCount(
      findPostListQueryDto,
    );

    return [plainToInstance(PostResponseDto, posts), count];
  }

  @Version(ApiVersion.One)
  @ApiFindOne('post 상세 조회')
  @SetResponse({ key: 'post', type: ResponseType.Detail })
  @Get(':postId')
  async findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<PostResponseDto> {
    const post = await this.postService.findOneOrNotFound(postId);

    const response = await this.postService.buildDetailResponse(post.id);

    return new PostResponseDto(response);
  }

  @Version(ApiVersion.One)
  @UseGuards(JwtAuthGuard)
  @ApiCreate('post 생성')
  @SetResponse({ key: 'post', type: ResponseType.Detail })
  @Post()
  async create(
    @User() user: UserEntity,
    @Body() createPostBodyDto: CreatePostRequestBodyDto,
  ): Promise<PostResponseDto> {
    const newPost = await this.postService.create(user.id, createPostBodyDto);

    const response = await this.postService.buildDetailResponse(newPost.id);

    return new PostResponseDto(response);
  }

  @Version(ApiVersion.One)
  @UseGuards(JwtAuthGuard)
  @ApiPutUpdate('post 수정')
  @SetResponse({ key: 'post', type: ResponseType.Detail })
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

    const response = await this.postService.buildDetailResponse(updatedPost.id);

    return new PostResponseDto(response);
  }

  @Version(ApiVersion.One)
  @ApiPatchUpdate('post 부분 수정')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'post', type: ResponseType.Detail })
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

    const response = await this.postService.buildDetailResponse(updatedPost.id);

    return new PostResponseDto(response);
  }

  @Version(ApiVersion.One)
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
