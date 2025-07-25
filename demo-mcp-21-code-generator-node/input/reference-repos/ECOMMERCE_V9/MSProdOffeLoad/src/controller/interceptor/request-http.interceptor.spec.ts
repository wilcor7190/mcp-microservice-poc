import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import GeneralUtil from '../../common/utils/generalUtil';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { RequestHttpInterceptor } from './request-http.interceptor';

describe('RequestHttpInterceptor', () => {
  let interceptor: RequestHttpInterceptor;
  let serviceTracingMock: IServiceTracingUc;
  let callHandlerMock: CallHandler;

  beforeEach(async () => {
    serviceTracingMock = { createServiceTracing: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestHttpInterceptor,
        { provide: IServiceTracingUc, useValue: serviceTracingMock },
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
    expect(serviceTracingMock.createServiceTracing).toHaveBeenCalled();
  });

  it('should log request and response', async () => {
    const logRequestResponseSpy = jest.spyOn(GeneralUtil, 'logRequestResponse');
    const traceabilityInterceptorSpy = jest.spyOn(GeneralUtil, 'traceabilityInterceptor').mockReturnValue({
      getTraceability: jest.fn(),
    } as any);

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

    await interceptor.intercept(executionContextMock, callHandlerMock).toPromise();

    expect(logRequestResponseSpy).toHaveBeenCalled();
    expect(traceabilityInterceptorSpy).toHaveBeenCalled();
  });
});