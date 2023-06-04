import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { AccessTokenType } from '@src/apis/users/types/access-token.type';
import { PrismaService } from '@src/core/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CreateUserRequestBodyDto } from '../dto/create-user-request-body.dto';

@Injectable()
export class UsersService {
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
