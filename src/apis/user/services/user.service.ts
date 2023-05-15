import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '../dto/create-user-request-body.dto';
import { PrismaService } from '@src/core/database/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { AuthService } from '@src/core/auth/services/auth.service';
import { User } from '@prisma/client';
import { AccessTokenType } from '@src/apis/user/types/access-token.type';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  private readonly SALT = 10;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(
    createUserDto: CreateUserRequestBodyDto,
  ): Promise<Omit<User, 'password'> & AccessTokenType> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.SALT,
    );

    const { password, ...user }: User & AccessTokenType =
      await this.prismaService.user.create({
        data: createUserDto,
      });

    user.accessToken = this.authService.login(user.id);

    return user;
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const existUser: User | null = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!existUser) {
      throw new NotFoundException();
    }

    const { password, ...user } = existUser;

    return user;
  }
}
