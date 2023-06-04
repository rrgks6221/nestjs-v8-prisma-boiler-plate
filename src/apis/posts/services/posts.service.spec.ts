import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { MockQueryHelper } from '@test/mock/helper.mock';
import { mockPrismaService } from '@test/mock/prisma-service.mock';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QueryHelper,
          useClass: MockQueryHelper,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
