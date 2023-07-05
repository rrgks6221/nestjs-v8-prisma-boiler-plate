import { Injectable } from '@nestjs/common';
import { JWT_TOKEN_TYPE } from '@src/apis/auth/constants/auth.constant';

@Injectable()
export class AuthHelper {
  getRefreshKeyInStore(userId: number): string {
    return 'refreshUserId' + ':' + String(userId);
  }

  getBearerToken(token: string): string {
    return JWT_TOKEN_TYPE + ' ' + token;
  }
}
