import { TestingModule, Test } from '@nestjs/testing';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';
import { PricesProductOfferingUC } from './product-offering-prices.uc.impl';

describe('PricesProductOfferingUC', () => {
  let service: PricesProductOfferingUC;

  let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;
  let mockServiceTracingUc: jest.Mocked<IServiceTracingUc>;
  let mockPriceProvider: jest.Mocked<IPriceProvider>;

  beforeEach(async () => {
    mockIGetErrorTracingUc = {
      createTraceability: jest.fn(),
      getError: jest.fn(),
    } as jest.Mocked<IGetErrorTracingUc>;

    mockServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    mockPriceProvider = {
      saveTransformData: jest.fn(),
      deleteDataColPrtProductOffering: jest.fn(),
      deletePricesCollections: jest.fn(),
      getJoinPricesFeatures: jest.fn(),
    } as jest.Mocked<IPriceProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesProductOfferingUC,
        { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
        { provide: IServiceTracingUc, useValue: mockServiceTracingUc },
        { provide: IPriceProvider, useValue: mockPriceProvider },
      ],
    }).compile();

    service = module.get<PricesProductOfferingUC>(PricesProductOfferingUC);
  });

  it('should call success deleteDataColPrtProductOffering', async () => {
    await service.deleteDataColPrtProductOffering('');
    expect(
      mockPriceProvider.deleteDataColPrtProductOffering,
    ).toHaveBeenCalled();
  });
  it('error case deleteDataColPrtProductOffering', async () => {
    try {
      mockPriceProvider.deleteDataColPrtProductOffering.mockRejectedValue(
        new Error('No Connection'),
      );
      await service.deleteDataColPrtProductOffering('');
    } catch (error) {
      expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
    }
  });

  it('should call success saveTransformData', async () => {
    const content = {} as any
    await service.saveTransformData(content);
    expect(
      mockPriceProvider.saveTransformData,
    ).toHaveBeenCalledWith(content);
  });

  it('error case saveTransformData', async () => {
    try {
      const content = {} as any
      mockPriceProvider.saveTransformData.mockRejectedValue(
        new Error('No Connection'),
      );
      await service.saveTransformData(content);
    } catch (error) {
      expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
    }
  });
});
