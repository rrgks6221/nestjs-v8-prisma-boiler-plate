import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { AccessTokenType } from '@src/apis/users/types/access-token.type';
import { UserResponseType } from '@src/apis/users/types/response/success/user-response.type';
import { ModelName } from '@src/constants/enum';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';

@ApiTags('유저')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiCreatedResponse({
    type: IntersectionType(UserResponseType, AccessTokenType),
  })
  create(
    @Body() createUserDto: CreateUserRequestBodyDto,
  ): Promise<Omit<User, 'password'> & AccessTokenType> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 조회' })
  @ApiOkResponse({ type: UserResponseType })
  findOne(
    @Param() @SetModelNameToParam(ModelName.User) param: IdRequestParamDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.findOne(param.id);
  }
}
