import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@src/modules/core/database/prisma/prisma.service');

const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
  },
};

describe('IsRecord decorator validate 메서드', () => {
  let isRecordConstraint: IsRecordConstraint;
  const args: any = {
    value: '',
    constraints: [{ model: 'user', field: 'id' }],
    targetName: '',
    object: {},
    property: '',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsRecordConstraint,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    isRecordConstraint = module.get<IsRecordConstraint>(IsRecordConstraint);
  });

  beforeEach(() => {
    args.constraints = [{ model: 'user', field: 'id' }];
  });

  it('raw 가 존재해야하고 실제 존재할 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(true);
    args.constraints.push(true);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).toBeTruthy();
  });

  it('raw 가 존재해야하고 실제 존재하지 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(false);
    args.constraints.push(true);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).not.toBeTruthy();
  });

  it('raw 가 존재해야하지 않고 실제 존재할 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(true);
    args.constraints.push(false);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).not.toBeTruthy();
  });

  it('raw 가 존재해야하지 않고 실제 존재하지 않는 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(false);
    args.constraints.push(false);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).toBeTruthy();
  });

  afterEach(() => {
    mockPrismaService.user.findFirst.mockRestore();
  });
});
