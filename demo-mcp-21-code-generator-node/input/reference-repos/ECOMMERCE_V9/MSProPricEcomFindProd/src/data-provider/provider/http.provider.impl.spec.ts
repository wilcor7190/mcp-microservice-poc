import { Test, TestingModule } from '@nestjs/testing';
import { ResponseHttp } from '../model/http/response-http.model';
import { HttpProvider } from './http.provider.impl';
import { AxiosResponse } from 'axios';
import { EHttpMethod, IRequestConfigHttp } from '../model/http/request-config-http.model';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { IServiceTracing } from 'src/core/entity/service-tracing/service-tracing.entity';


describe('HttpProvider', () => {
  let httpProvider: HttpProvider;
  let iServiceTracingProvider: IServiceTracingProvider;
  let httpService: HttpService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpProvider,
        { provide: IServiceTracingProvider, useValue: iServiceTracingProvider },
        { provide: HttpService, useValue: httpService },],
    }).compile();

    httpProvider = module.get<HttpProvider>(HttpProvider);
  });

  afterEach(() => {
    jest.resetAllMocks
  });

  describe('executeRest', () => {
    it('should execute a REST request successfully', async () => {
      const requestConfig: IRequestConfigHttp = {
        method: EHttpMethod.get,
        url: ""
      };

      const mockHeaders: Record<string, string | string[]> = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
        requestStartedAt: "1703351372162",
        processingTime: "20",
      };

      const mockResponse: AxiosResponse = {
        data: 'mock data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: "",
          method: "get",
          headers: mockHeaders as any,

          transformRequest: [(data: any) => data],
          transformResponse: [(data: any) => data],
          timeout: 0,
          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN",
          maxContentLength: -1,
          maxBodyLength: -1,
        },
        request: { sillegoalgo: "sillegoalgo" }

      };

      const mockResponseconfig = {
        config: {
          headers: mockHeaders as any,
        },
      };

      const httpService = jest.fn().mockImplementation(() => ({
        request: jest.fn().mockReturnValue(of(mockResponse)),
        axiosRef: { interceptors: { request: { use: jest.fn().mockReturnValue(mockResponseconfig) }, response: { use: jest.fn(() => mockResponseconfig) } } },
      }))();

      const serviceTracing: IServiceTracing = {
        transactionId: "123456789",
        status: "success",
        task: "processData",
        description: "Processing data",
        request: { data: "example" },
        method: "POST",
        response: { message: "Data processed successfully" },
        processingTime: 1000
      };

      const iServiceTracingProvider: IServiceTracingProvider = {
        createServiceTracing: jest.fn().mockReturnValue(serviceTracing),
      };

      httpProvider = new HttpProvider(iServiceTracingProvider, httpService);
      const result: ResponseHttp<any> = await httpProvider.executeRest(requestConfig);

      expect(result.status).toEqual(200);

    });

  });
  
})