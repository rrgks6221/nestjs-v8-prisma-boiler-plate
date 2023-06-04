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
import { PatchUpdatePostDto } from '@src/apis/posts/dto/patch-update-post.dto';
import { PostListQueryDto } from '@src/apis/posts/dto/post-list-query-dto';
import { PutUpdatePostDto } from '@src/apis/posts/dto/put-update-post-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { ModelName } from '@src/constants/enum';
import { SetDefaultPageSize } from '@src/decorators/set-default-page-size.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { User } from '@src/decorators/user.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../services/posts.service';

@ApiBearerAuth()
@ApiTags('post')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @ApiOperation({ summary: 'posts 생성' })
  @ApiCreatedResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @User() user: UserEntity,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    return this.postService.create(user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'posts 전체 조회' })
  @ApiOkResponse({ type: [PostEntity] })
  findAll(
    @Query()
    @SetDefaultPageSize(30)
    query: PostListQueryDto,
  ) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'posts 상세 조회' })
  @ApiOkResponse({ type: PostEntity })
  findOne(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
  ): Promise<PostModel> {
    return this.postService.findOne(param.id);
  }

  @ApiOperation({ summary: 'posts 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  putUpdate(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @User('id') authorId: number,
    @Body() putUpdatePostDto: PutUpdatePostDto,
  ): Promise<PostModel> {
    return this.postService.putUpdate(param.id, authorId, putUpdatePostDto);
  }

  @ApiOperation({ summary: 'posts 일부 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUpdate(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @User('id') authorId: number,
    @Body() patchUpdatePostDto: PatchUpdatePostDto,
  ): Promise<PostModel> {
    return this.postService.patchUpdate(param.id, authorId, patchUpdatePostDto);
  }

  @ApiOperation({ summary: 'posts 삭제' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @User('id') authorId: number,
  ): Promise<number> {
    return this.postService.remove(param.id, authorId);
  }
}
