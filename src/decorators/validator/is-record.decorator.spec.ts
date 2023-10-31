import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { IsRecordConstraint } from '@src/decorators/validator/is-record.decorator';
import { mockPrismaService } from '@test/mock/prisma-service.mock';

describe(IsRecordConstraint.name, () => {
  let isRecordConstraint: IsRecordConstraint;
  const args: any = {
    value: '',
    constraints: [{ model: 'user', field: 'id' }],
    targetName: '',
    object: {},
    property: '',
  };

  beforeEach(async () => {
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
    args.constraints = [{ model: 'user', field: 'id' }];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(isRecordConstraint).toBeDefined();
  });

  it('raw 가 존재해야하고 실제 존재할 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(true as any);
    args.constraints.push(true);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).toBeTruthy();
  });

  it('raw 가 존재해야하고 실제 존재하지 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(false as any);
    args.constraints.push(true);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).not.toBeTruthy();
  });

  it('raw 가 존재해야하지 않고 실제 존재할 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(true as any);
    args.constraints.push(false);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).not.toBeTruthy();
  });

  it('raw 가 존재해야하지 않고 실제 존재하지 않는 경우', async () => {
    mockPrismaService.user.findFirst.mockReturnValue(false as any);
    args.constraints.push(false);

    const isRecord = await isRecordConstraint.validate('', args);

    expect(isRecord).toBeTruthy();
  });
});
