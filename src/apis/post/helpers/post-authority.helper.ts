import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/core/database/prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostAuthorityHelper {
  constructor(private readonly prismaService: PrismaService) {}

  checkIdentification(postId: number, authorId: number): Promise<Post | null> {
    return this.prismaService.post.findFirst({
      where: {
        authorId,
        id: postId,
      },
    });
  }
}
