export const mockRequest = {
  query: {},
};
export const mockCtx = {
  switchToHttp() {
    return this;
  },
  getRequest() {
    return mockRequest;
  },
};
