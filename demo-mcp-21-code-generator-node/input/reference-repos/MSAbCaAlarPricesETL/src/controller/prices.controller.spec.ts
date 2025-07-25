import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { IPricesService } from './service/prices.service';
import { IServiceTracingUc } from '../core/use-case/resource/service-tracing.resource.uc';
import {
  EStatusTracingGeneral,
  EDescriptionTracingGeneral,
  ETaskTracingGeneral,
} from '../common/utils/enums/tracing.enum';
import { dataSuccess } from '../mockup/data-validate-service';
import { PriceController } from './prices.controller';

describe('PriceController', () => {
  let controller: PriceController;
  let mockPricesService: jest.Mocked<IPricesService>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    mockPricesService = {
      // Mock the methods from IPricesService used by the implementation
      pricesProcess: jest.fn(),
    } as jest.Mocked<IPricesService>;

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceController],
      providers: [
        { provide: IPricesService, useValue: mockPricesService },
        { provide: IServiceTracingUc, useValue: mockServiceTracing },
      ],
    }).compile();

    controller = module.get<PriceController>(PriceController);
  });

  describe('getPricesManual', () => {
    it('should trigger pricesProcess and create service tracing on success', async () => {
      mockPricesService.pricesProcess.mockResolvedValue({
        success: true,
        status: HttpStatus.OK,
        message: 'OK',
        documents: dataSuccess,
      });

      const result = await controller.getPricesManual();

      expect(mockPricesService.pricesProcess).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.documents).toEqual(dataSuccess);
    });
  });
});
