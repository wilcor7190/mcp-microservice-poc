import { TestingModule, Test } from "@nestjs/testing";
import { Agent, request } from 'undici';

import { ResponseHttp } from "../model/http/response-http.model";
import { HttpProvider } from "./http.provider.impl";
import { EHttpMethod, IRequestConfigHttp } from "../model/http/request-config-http.model";
import { IServiceTracingProvider } from '../service-tracing.provider';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { Etask } from '../../common/utils/enums/taks.enum';
import servicesConfig from '../../common/configuration/services.config';

jest.mock('undici', () => ({
  request: jest.fn(),
  Agent: jest.fn()
}));

describe('HttpProvider', () => {
  let httpProvider: HttpProvider;
  let iServiceTracingProvider: IServiceTracingProvider;

  beforeEach(async () => {

    iServiceTracingProvider = {
      createServiceTracing: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpProvider,
        { provide: IServiceTracingProvider, useValue: iServiceTracingProvider },]
    }).compile();

    httpProvider = module.get<HttpProvider>(HttpProvider);
  });

  afterEach(() => {
    jest.resetAllMocks
  });

  describe('executeRest', () => {
    it('should execute a successful REST request', async () => {
      const mockRequestConfig: IRequestConfigHttp = {
        url: 'http://example.com',
        method: EHttpMethod.get,
        data: undefined,
        params: undefined,
        headers: undefined
      };
  
      const mockResponse = {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: {
          json: jest.fn().mockResolvedValue({ success: true })
        }
      };
      (request as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpProvider.executeRest(mockRequestConfig, Etask.FINISH_JOB_DISPONIBILITY);
      expect(request).toHaveBeenCalledWith('http://example.com', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        body: undefined,
        dispatcher: new Agent({ connectTimeout: servicesConfig.httpConfig.timeout }),
        headersTimeout: servicesConfig.httpConfig.headersTimeout
      });
      expect(result.data).toEqual({ success: true });
      expect(result).toBeInstanceOf(ResponseHttp);
      expect(iServiceTracingProvider.createServiceTracing).toHaveBeenCalledTimes(1);
    });
  
    it('should handle an error during the REST request', async () => {
      const mockRequestConfig: IRequestConfigHttp = {
        url: 'http://example.com',
        method: EHttpMethod.get,
      };
      const mockError = new Error('Network error');
      (request as jest.Mock).mockRejectedValue(mockError);
      httpProvider.executeRest(mockRequestConfig, Etask.FINISH_JOB_DISPONIBILITY).catch((error) => {
        expect(error).toBeInstanceOf(BusinessException);
        expect(iServiceTracingProvider.createServiceTracing).toHaveBeenCalledTimes(1);
      });
  
    });


  });

 
})