import { ERROR_CODE } from '@src/constants/error-response-code.constant';

export const ERROR_REASON = {
  [ERROR_CODE.CODE001]: 'server error',
  [ERROR_CODE.CODE002]: 'api path not found',
  [ERROR_CODE.CODE003]: 'invalid request parameter',
  [ERROR_CODE.CODE004]: 'invalid token',
} as const;
