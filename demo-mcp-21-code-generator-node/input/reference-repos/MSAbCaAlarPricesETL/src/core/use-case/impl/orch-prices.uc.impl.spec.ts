import { Test, TestingModule } from '@nestjs/testing';
import { IEventPricesKafkaUc } from '../eventPricesKafka.uc';
import { OrchPricesUcImpl } from './orch-prices.uc.impl';
import { IPricesHelper } from '../prices-helper.uc';

describe('OrchPricesUcImpl', () => {
  let service: OrchPricesUcImpl;
  let mockPricesHelper: jest.Mocked<IPricesHelper>;
  let mockEventPricesKafkaUc: jest.Mocked<IEventPricesKafkaUc>;

  beforeEach(async () => {
    mockPricesHelper = {
      pricesHelper: jest.fn(),
    } as jest.Mocked<IPricesHelper>;

    mockEventPricesKafkaUc = {
      eventPricesKafka: jest.fn(),
    } as jest.Mocked<IEventPricesKafkaUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrchPricesUcImpl,
        { provide: IPricesHelper, useValue: mockPricesHelper },
        { provide: IEventPricesKafkaUc, useValue: mockEventPricesKafkaUc },
      ],
    }).compile();

    service = module.get<OrchPricesUcImpl>(OrchPricesUcImpl);
  });

  describe('orchPricesUc', () => {
    it('should call all the price-related flows', async () => {
      await service.orchPricesUc();

      // Assert
      expect(mockPricesHelper.pricesHelper).toHaveBeenCalledTimes(5)
    });
  });

  describe('orchPricesKafkaUc', () => {
    it('should call eventPricesKafka', async () => {
      await service.orchPricesKafkaUc();

      expect(mockEventPricesKafkaUc.eventPricesKafka).toHaveBeenCalled();
    });
  });
});
