import { Test, TestingModule } from '@nestjs/testing';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { ParamUcimpl } from './param.resource.uc.impl';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { IServiceTracingUc } from '../service-tracing.resource.uc';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ParamUC', () => {
  let paramUcimpl: ParamUcimpl;
  let paramProvider: IParamProvider;
  let serviceErrorUc: IServiceErrorUc;
  let serviceTracingUc: IServiceTracingUc;

  beforeEach(async () => {
    paramProvider = {
      getParams: jest.fn(),
      getTotal: jest.fn(),
      getParamByIdParam: jest.fn(),
      updateParam: jest.fn(),
    } as jest.Mocked<IParamProvider>;
    serviceErrorUc = {
      createServiceError: jest.fn(),
      getServiceErrors: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;
    serviceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;
    const cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParamUcimpl,
        { provide: IParamProvider, useValue: paramProvider },
        { provide: IServiceErrorUc, useValue: serviceErrorUc },
        { provide: IServiceTracingUc, useValue: serviceTracingUc },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();
    paramUcimpl = module.get<ParamUcimpl>(ParamUcimpl);
  });

  describe('paramUcimpl', () => {
    it('Should be defined', async () => {
      expect(paramUcimpl).toBeTruthy();
    });
  });
});
