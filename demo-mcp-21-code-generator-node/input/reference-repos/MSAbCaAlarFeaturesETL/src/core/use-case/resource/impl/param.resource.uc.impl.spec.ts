import { Test, TestingModule } from '@nestjs/testing';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { ParamUcimpl } from './param.resource.uc.impl';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ParamUC', () => {
  let paramUcimpl: ParamUcimpl;
  let paramProvider: IParamProvider;
  let serviceErrorUc: IServiceErrorUc;

  beforeEach(async () => {
    paramProvider = {
      getParams: jest.fn(),
      getTotal: jest.fn(),
      getParamByIdParam: jest.fn(),
      updateParam: jest.fn(),
      getFeaturesEnabled: jest.fn(),
    } as jest.Mocked<IParamProvider>;
    serviceErrorUc = {
      createServiceError: jest.fn(),
      getServiceErrors: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;
    const cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParamUcimpl,
        { provide: IParamProvider, useValue: paramProvider },
        { provide: IServiceErrorUc, useValue: serviceErrorUc },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();
    paramUcimpl = module.get<ParamUcimpl>(ParamUcimpl);
  });

  describe('paramUcimpl', () => {
    it('Should be defined', async () => {
      expect(paramUcimpl).toBeTruthy();
    });
    it('Should go to catch', async () => {
      jest
        .spyOn(paramProvider, 'getParams')
        .mockRejectedValue(new Error('No connection'));

      await paramUcimpl.loadParams();

      expect(serviceErrorUc.createServiceError).toHaveBeenCalled;
    });
  });
});
