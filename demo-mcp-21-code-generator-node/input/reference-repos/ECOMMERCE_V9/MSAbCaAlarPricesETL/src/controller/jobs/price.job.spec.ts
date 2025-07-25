import { IPricesService } from '../service/prices.service';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import {
  EStatusTracingGeneral,
  EDescriptionTracingGeneral,
  ETaskTracingGeneral,
} from '../../common/utils/enums/tracing.enum';
import { PriceJob } from './price.job';

describe('PriceJob', () => {
  let priceJob: PriceJob;
  let mockPricesService: jest.Mocked<IPricesService>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;

  beforeEach(() => {
    mockPricesService = {
      // Mock the methods from IPricesService used by the implementation
      pricesProcess: jest.fn(),
    } as jest.Mocked<IPricesService>;

    mockServiceTracing = {
      // Mock the methods from IServiceTracingUc used by the implementation
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    priceJob = new PriceJob(mockPricesService, mockServiceTracing);
  });

  describe('disponibilityJob', () => {
    it('should execute pricesProcess and create service tracing on success', async () => {
      mockPricesService.pricesProcess.mockResolvedValue({
        success: true,
        status: 200,
        message: "OK"
      });

      await priceJob.pricesJob();

      expect(mockServiceTracing.createServiceTracing).toHaveBeenCalledWith({
        status: EStatusTracingGeneral.STATUS_SUCCESS,
        description: EDescriptionTracingGeneral.START_JOB_PROCESS,
        task: ETaskTracingGeneral.EXEC_CRON,
      });

      expect(mockPricesService.pricesProcess).toHaveBeenCalled();
    });
  });
});
