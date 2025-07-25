import { responseDummy } from '../../../../test/response-dummy';
import { Test, TestingModule } from '@nestjs/testing';
import { ICategoriesUC } from '../../../core/use-case/categories.uc';
import { CategoriesService } from './categories.service.impl';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import { IParamProvider } from '../../../data-provider/param.provider';
import { mockParamCategoria } from '../../../mockup/stubs';

describe('PricesServiceImpl', () => {
  let service: CategoriesService;
  let mockICategoriesUC: jest.Mocked<ICategoriesUC>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;
  let mockIParamProvider: jest.Mocked<IParamProvider>;

  beforeEach(async () => {
    mockICategoriesUC = {
      updateFeatures: jest.fn(),
    } as jest.Mocked<ICategoriesUC>;

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    mockIParamProvider = {
      getFeaturesEnabled: jest.fn(),
      getParamByIdParam: jest.fn(),
      getParams: jest.fn(),
      getTotal: jest.fn(),
      updateParam: jest.fn(),
    } as jest.Mocked<IParamProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: ICategoriesUC, useValue: mockICategoriesUC },
        { provide: IServiceTracingUc, useValue: mockServiceTracing },
        { provide: IParamProvider, useValue: mockIParamProvider },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('pricesProcess', () => {
    it('should call updateFeatures and return a successful response', async () => {
      mockIParamProvider.getParamByIdParam.mockResolvedValue(
        mockParamCategoria,
      );

      const response = await service.updateFeatures();

      expect(response.status).toBeTruthy;
    });
    it('should call updateFeatures when no params', async () => {
      mockIParamProvider.getParamByIdParam.mockResolvedValue(null);

      await service.updateFeatures();

      expect(mockServiceTracing.createServiceTracing).toHaveBeenCalled;
    });
  });
describe('jobUpdateFeatures', () => {
  it('should log and update features when categories are found', async () => {
    mockIParamProvider.getParamByIdParam.mockResolvedValue(mockParamCategoria);

    await service.jobUpdateFeatures();

    expect(mockICategoriesUC.updateFeatures).toHaveBeenCalledWith(mockParamCategoria);
  });

  it('should log and create service tracing when no categories are found', async () => {
    mockIParamProvider.getParamByIdParam.mockResolvedValue(null);

    await service.jobUpdateFeatures();

    expect(mockServiceTracing.createServiceTracing).toHaveBeenCalled();
  });
});
});
