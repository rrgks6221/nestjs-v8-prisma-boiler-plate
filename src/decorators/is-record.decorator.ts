import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '@src/core/database/prisma/prisma.service';
import { Target } from '@src/types/type';
import { ConflictException, NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class IsRecordConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { model, field }: Target = args.constraints[0];
    const isShouldBeExist = args.constraints[1];
    const targetName = field || args.property;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const modelName = model || args.object.model;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uniqueRecord = await this.prismaService[modelName].findFirst({
      where: {
        [targetName]: value,
      },
    });

    return isShouldBeExist === !!uniqueRecord;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property, constraints, object } = validationArguments;
    const { model, field } = constraints[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const modelName = model || object['model'];
    const isShouldBeExist = constraints[1];

    if (isShouldBeExist) {
      throw new NotFoundException(
        `${value} 'doesn't exist' ${field || property} in ${modelName}`,
      );
    }

    throw new ConflictException(
      `${value} 'is already exist' ${field || property} in ${modelName}`,
    );
  }
}

export function IsRecord(
  target: Target,
  isShouldBeExist: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [target, isShouldBeExist],
      validator: IsRecordConstraint,
    });
  };
}
