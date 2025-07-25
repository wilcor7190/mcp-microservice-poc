import { Test, TestingModule } from '@nestjs/testing';
import { RequestHttpInterceptor } from './request-http.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import * as moment from 'moment';
import GeneralUtil from 'src/common/utils/generalUtil';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import databaseConfig from '../../common/configuration/database.config';
import * as APM from '@claro/general-utils-library';

describe('RequestHttpInterceptor', () => {
  let interceptor: RequestHttpInterceptor;
  let serviceTracingMock: IServiceTracingUc;

  beforeEach(async () => {
    serviceTracingMock = {
      createServiceTracing: jest.fn(),
    } as unknown as IServiceTracingUc;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestHttpInterceptor,
        { provide: IServiceTracingUc, useValue: serviceTracingMock },
      ],
    }).compile();

    interceptor = module.get<RequestHttpInterceptor>(RequestHttpInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and process the request and response correctly', async () => {
    const mockRequest = {
      body: {},
      query: { test: 'query' },
      method: 'GET',
    };
    const mockResponse = {
      statusCode: 200,
      status: jest.fn(),
    };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getArgs: jest.fn().mockReturnValue([{ url: '/test-url' }]),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'response data', status: 200 })),
    } as unknown as CallHandler;

    jest.spyOn(GeneralUtil, 'isEmptyObject').mockReturnValue(false);
    jest.spyOn(GeneralUtil, 'logRequestResponse').mockImplementation();
    
    jest.spyOn(GeneralUtil, 'getOrigin').mockReturnValue('origin-data');
   

    const result = await interceptor.intercept(mockContext, mockCallHandler).toPromise();

    expect(result).toEqual({
      data: 'response data',
      requestTime: expect.any(String),
      responseTime: expect.any(Number),
      method: 'GET',
      origen: 'origin-data',
      status: 200,
    });

    expect(GeneralUtil.logRequestResponse).toHaveBeenCalledTimes(2);
    expect(serviceTracingMock.createServiceTracing).toHaveBeenCalledTimes(2);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});