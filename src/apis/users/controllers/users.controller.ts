import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
import {
  ApiFindAllAndCount,
  ApiFindOne,
  ApiPatchUpdate,
  ApiPutUpdate,
  ApiRemove,
} from '@src/apis/users/controllers/users.swagger';
import { FindUserListQueryDto } from '@src/apis/users/dto/find-user-list-query.dto';
import { PatchUpdateUserBodyDto } from '@src/apis/users/dto/patch-update-user.dto';
import { PutUpdateUserBodyDto } from '@src/apis/users/dto/put-update-user.dto';
import { UserBaseResponseDto } from '@src/apis/users/dto/user-base-response.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { ModelName } from '@src/constants/enum';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import {
  ResponseType,
  SetResponse,
} from '@src/decorators/set-response.decorator';
import { User } from '@src/decorators/user.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { BaseController } from '@src/types/type';
import { plainToInstance } from 'class-transformer';

@ApiTags('users')
@Controller('api/users')
export class UsersController
  implements Omit<BaseController<UserModel, UserBaseResponseDto>, 'create'>
{
  constructor(private readonly userService: UsersService) {}

  @SetResponse({ key: 'users', type: ResponseType.Pagination })
  @ApiFindAllAndCount('유저 리스트 조회')
  @Get()
  async findAllAndCount(
    @Query() findUserListQueryDto: FindUserListQueryDto,
  ): Promise<[UserModel[], number]> {
    const [users, count] = await this.userService.findAllAndCount(
      findUserListQueryDto,
    );

    return [plainToInstance(UserEntity, users), count];
  }

  @ApiFindOne('유저 단일 조회')
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Get(':id')
  async findOne(
    @Param() @SetModelNameToParam(ModelName.User) param: IdRequestParamDto,
  ): Promise<UserBaseResponseDto> {
    const existUser = await this.userService.findOne(param.id);

    const response = await this.userService.buildBaseResponse(existUser.id);

    return new UserBaseResponseDto(response);
  }

  @ApiPatchUpdate('유저 부분 수정')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Patch(':userId')
  async patchUpdate(
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @Body() patchUpdateUserBodyDto: PatchUpdateUserBodyDto,
    @User() user: UserEntity,
  ): Promise<UserBaseResponseDto> {
    const newUser = await this.userService.patchUpdate(
      userId,
      user.id,
      patchUpdateUserBodyDto,
    );

    const response = await this.userService.buildBaseResponse(newUser.id);

    return new UserBaseResponseDto(response);
  }

  @ApiPutUpdate('유저 수정')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Put(':userId')
  async putUpdate(
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @Body() putUpdateUserBodyDto: PutUpdateUserBodyDto,
    @User() user: UserEntity,
  ): Promise<UserBaseResponseDto> {
    const newUser = await this.userService.putUpdate(
      userId,
      user.id,
      putUpdateUserBodyDto,
    );

    const response = await this.userService.buildBaseResponse(newUser.id);

    return new UserBaseResponseDto(response);
  }

  @ApiRemove('유저 삭제')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Delete })
  @Delete(':userId')
  async remove(
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @User() user: UserEntity,
  ): Promise<number> {
    return this.userService.remove(userId, user.id);
  }
}
