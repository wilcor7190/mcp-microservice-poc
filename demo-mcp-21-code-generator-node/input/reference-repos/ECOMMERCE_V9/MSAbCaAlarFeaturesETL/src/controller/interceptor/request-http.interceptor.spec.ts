import { Test, TestingModule } from '@nestjs/testing';
import { RequestHttpInterceptor } from './request-http.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('RequestHttpInterceptor', () => {
  let interceptor: RequestHttpInterceptor;
  let callHandlerMock: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestHttpInterceptor,
      ],
    }).compile();

    interceptor = module.get<RequestHttpInterceptor>(RequestHttpInterceptor);
    callHandlerMock = {
      handle: jest.fn(() => of({ status: 200 })),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and process request', async () => {
    const requestMock = {
      method: 'GET',
      body: {},
      query: {},
      url: '/test-url',
    };

    const responseMock = {
      status: jest.fn(),
    };

    const executionContextMock: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: jest.fn(() => requestMock),
        getResponse: jest.fn(() => responseMock),
      }),
      getArgs: () => [{ url: '/test-url' }],
    } as any;

    const result = await interceptor.intercept(executionContextMock, callHandlerMock).toPromise();

    expect(result).toHaveProperty('requestTime');
    expect(result).toHaveProperty('responseTime');
    expect(result).toHaveProperty('method', 'GET');
    expect(result).toHaveProperty('origen');
    expect(result).toHaveProperty('status', 200);
    expect(callHandlerMock.handle).toHaveBeenCalled();
  });
});