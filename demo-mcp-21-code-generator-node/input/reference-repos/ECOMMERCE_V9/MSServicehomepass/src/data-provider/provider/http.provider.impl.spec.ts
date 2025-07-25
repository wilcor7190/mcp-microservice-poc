import { IServiceTracingProvider } from '../service-tracing.provider';
import { EHttpMethod, IRequestConfigHttp } from '../model/http/request-config-http.model';
import { Etask } from '../../common/utils/enums/task.enum';
import { Agent, request } from 'undici';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { HttpProvider } from './http.provider.impl';
import { ResponseHttp } from '../model/http/response-http.model';
import servicesConfig from 'src/common/configuration/services.config';

jest.mock('undici', () => ({
  request: jest.fn(),
  Agent: jest.fn()
}));

describe('HttpProvider', () => {
  let httpProvider: HttpProvider;
  let serviceTracingProvider: IServiceTracingProvider;

  beforeEach(() => {
    serviceTracingProvider = {
      createServiceTracing: jest.fn()
    } as any;
    httpProvider = new HttpProvider(serviceTracingProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    jest.spyOn(httpProvider['logger'], 'write').mockReturnThis();
    (request as jest.Mock).mockResolvedValue(mockResponse);
    const result = await httpProvider.executeRest(mockRequestConfig, Etask.APM);
    expect(request).toHaveBeenCalledWith('http://example.com', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      body: undefined,
      dispatcher: new Agent({ connectTimeout: servicesConfig.httpConfig.timeout }),
      headersTimeout: servicesConfig.httpConfig.headersTimeout
    });
    expect(result.data).toEqual({ success: true });
    expect(result).toBeInstanceOf(ResponseHttp);
    expect(serviceTracingProvider.createServiceTracing).toHaveBeenCalledTimes(2);
    expect(httpProvider['logger'].write).toHaveBeenCalledTimes(2);
  });

  it('should handle an error during the REST request', async () => {
    const mockRequestConfig: IRequestConfigHttp = {
      url: 'http://example.com',
      method: EHttpMethod.get,
    };
    jest.spyOn(httpProvider['logger'], 'write').mockReturnThis();
    const mockError = new Error('Network error');
    (request as jest.Mock).mockRejectedValue(mockError);
    httpProvider.executeRest(mockRequestConfig, Etask.APM).catch((error) => {
      expect(error).toBeInstanceOf(BusinessException);
      expect(httpProvider['logger'].write).toHaveBeenCalledTimes(2);
      expect(serviceTracingProvider.createServiceTracing).toHaveBeenCalledTimes(2);
    });

  });
});
