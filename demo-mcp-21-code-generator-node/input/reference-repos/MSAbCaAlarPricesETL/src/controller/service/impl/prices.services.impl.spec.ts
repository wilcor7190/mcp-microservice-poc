import { Test, TestingModule } from '@nestjs/testing';
import { IOrchPricesUc } from '../../../core/use-case/orch-prices.uc';
import { PricesServiceImpl } from './prices.services.impl';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';

describe('PricesServiceImpl', () => {
  let service: PricesServiceImpl;
  let mockOrchPricesUc: jest.Mocked<IOrchPricesUc>;
  let serviceTracingUc: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {

    mockOrchPricesUc = {
      orchPricesUc: jest.fn(),
    } as jest.Mocked<IOrchPricesUc>;

    serviceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesServiceImpl,
        { provide: IOrchPricesUc, useValue: mockOrchPricesUc },
        { provide: IServiceTracingUc, useValue: serviceTracingUc },
      ],
    }).compile();

    service = module.get<PricesServiceImpl>(PricesServiceImpl);
  });

  describe('pricesProcess', () => {
    it('should call orchPricesUc and return a successful response', async () => {
      mockOrchPricesUc.orchPricesUc.mockResolvedValue({
        success: true,
        status: 200,
        message: 'OK',
      });

      const result = await service.pricesProcess();

      expect(mockOrchPricesUc.orchPricesUc).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          message: 'La carga inició',
          status: 200,
        }),
      );
    });
  });
});
