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
import { ApiPostComments } from '@src/apis/post-comments/controllers/post-comments.swagger';
import { CreatePostCommentRequestBodyDto } from '@src/apis/post-comments/dto/create-post-comment-request-body.dto';
import { FindPostCommentListQueryDto } from '@src/apis/post-comments/dto/find-post-comment-list-query.dto';
import { PatchUpdatePostCommentRequestBodyDto } from '@src/apis/post-comments/dto/patch-update-post-comment-request-body.dto';
import { PostCommentResponseDto } from '@src/apis/post-comments/dto/post-comment-response.dto';
import { PutUpdatePostCommentRequestBodyDto } from '@src/apis/post-comments/dto/put-update-post-comment-request-body.dto';
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
import { PostCommentsService } from '../services/post-comments.service';

@ApiBearerAuth()
@ApiTags('postComments')
@Controller('posts/:postId/post-comments')
export class PostCommentsController
  implements RestController<PostCommentResponseDto>
{
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @ApiPostComments.FindAllAndCount({
    summary: 'post comment 전체 조회',
    description: '페이지네이션',
  })
  @Version(ApiVersion.One)
  @SetResponse({ key: 'postComments', type: ResponseType.Pagination })
  @Get()
  async findAllAndCount(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Query() findPostCommentListQueryDto: FindPostCommentListQueryDto,
  ): Promise<[PostCommentResponseDto[], number]> {
    const [postComments, count] =
      await this.postCommentsService.findAllAndCount(
        postId,
        findPostCommentListQueryDto,
      );

    return [plainToInstance(PostCommentResponseDto, postComments), count];
  }

  @ApiPostComments.FindOne({ summary: 'postComment 단일 조회' })
  @Version(ApiVersion.One)
  @SetResponse({ key: 'postComment', type: ResponseType.Detail })
  @Get(':postCommentId')
  async findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('postCommentId', ParsePositiveIntPipe) postCommentId: number,
  ): Promise<PostCommentResponseDto> {
    const postComment = await this.postCommentsService.findOneOrNotFound(
      postId,
      postCommentId,
    );

    const response = await this.postCommentsService.buildDetailResponse(
      postId,
      postComment.id,
    );

    return new PostCommentResponseDto(response);
  }

  @ApiPostComments.Create({ summary: 'postComment 생성' })
  @Version(ApiVersion.One)
  @SetResponse({ key: 'postComment', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @User() user: UserEntity,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() createPostCommentRequestBodyDto: CreatePostCommentRequestBodyDto,
  ): Promise<PostCommentResponseDto> {
    return this.postCommentsService.create();
  }

  @ApiPostComments.PutUpdate({ summary: 'postComment 수정' })
  @Version(ApiVersion.One)
  @SetResponse({ key: 'postComment', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Put(':postCommentId')
  putUpdate(
    @User() user: UserEntity,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('postCommentId', ParsePositiveIntPipe) postCommentId: number,
    @Body()
    putUpdatePostCommentRequestBodyDto: PutUpdatePostCommentRequestBodyDto,
  ): Promise<PostCommentResponseDto> {
    return this.postCommentsService.putUpdate();
  }

  @ApiPostComments.PatchUpdate({ summary: 'postComment 부분 수정' })
  @Version(ApiVersion.One)
  @SetResponse({ key: 'postComment', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':postCommentId')
  patchUpdate(
    @User() user: UserEntity,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('postCommentId', ParsePositiveIntPipe) postCommentId: number,
    @Body()
    patchUpdatePostCommentRequestBodyDto: PatchUpdatePostCommentRequestBodyDto,
  ): Promise<PostCommentResponseDto> {
    return this.postCommentsService.patchUpdate();
  }

  @ApiPostComments.Remove({ summary: 'postComment 삭제' })
  @Version(ApiVersion.One)
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':postCommentId')
  remove(): Promise<number> {
    return this.postCommentsService.remove();
  }
}
