import { AuthHelper } from '@src/apis/auth/helpers/auth.helper';
import { QueryHelper } from '@src/helpers/query.helper';
import { MockClass } from '@test/mock/type';

export class MockPostAuthorityHelper {
  checkIdentification = jest.fn();
}

export class MockAUthHelper implements MockClass<AuthHelper> {
  getRefreshKeyInStore = jest.fn();
  getBearerToken = jest.fn();
}

export class MockQueryHelper implements MockClass<QueryHelper> {
  buildWherePropForFind = jest.fn();
  buildOrderByPropForFind = jest.fn();
}
