import { MockClass } from '@test/mock/type';

export class MockEmbedBuilder {
  setTitle() {
    return this;
  }

  setColor() {
    return this;
  }

  setTimestamp() {
    return this;
  }

  setFields() {
    return this;
  }

  setDescription() {
    return this;
  }
}

export class MockWebhookClient {
  constructor(option: unknown) {
    return this;
  }

  send() {
    return Promise.resolve(jest.fn());
  }
}

export class MockEncryption {
  hash = jest.fn();
  compare = jest.fn();
}

export class MockCacheManager implements MockClass<Cache> {
  add = jest.fn();
  addAll = jest.fn();
  delete = jest.fn();
  keys = jest.fn();
  match = jest.fn();
  matchAll = jest.fn();
  put = jest.fn();
}
