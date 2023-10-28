import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const ApiPropertyOrderBy = (
  allowFields: readonly string[],
): PropertyDecorator => {
  return applyDecorators(
    ApiPropertyOptional({
      description:
        '정렬 필드<br>' +
        '공백을 제거한 csv 형태로 보내야합니다.<br>' +
        '- 가 붙으면 내림차순 - 가 붙지 않으면 오름차순<br>' +
        '허용된 filed: ' +
        allowFields.join(' '),
      example: '-id,updatedAt',
      default: 'id',
      type: String,
    }),
  );
};
