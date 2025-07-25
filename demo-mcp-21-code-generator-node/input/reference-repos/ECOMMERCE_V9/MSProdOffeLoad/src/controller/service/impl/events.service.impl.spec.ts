import { Test, TestingModule } from '@nestjs/testing';
import { IServiceErrorUc } from '../../../core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import { IOrchDataloadUC } from '../../../core/use-case/orch-dataload.uc';
import { EventsService } from './events.service.impl';

describe('EventsService Implementation', () => {
  let service: EventsService;
  let mockOrchDataloadUC: jest.Mocked<IOrchDataloadUC>;
  let mockServiceErrorUc: jest.Mocked<IServiceErrorUc>;
  let mockServiceTracingUc: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    mockOrchDataloadUC = {
      orchDataload: jest.fn(),
    } as jest.Mocked<IOrchDataloadUC>;
    mockServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;
    mockServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: IOrchDataloadUC, useValue: mockOrchDataloadUC },
        { provide: IServiceErrorUc, useValue: mockServiceErrorUc },
        { provide: IServiceTracingUc, useValue: mockServiceTracingUc },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('orchDataloadKafka', () => {
    it('should default', async () => {
      await service.orchDataloadKafka('');

      expect(mockOrchDataloadUC.orchDataload).not.toHaveBeenCalled;
    });
    it('feature case', async () => {
      await service.orchDataloadKafka('features');

      expect(mockOrchDataloadUC.orchDataload).toHaveBeenCalledTimes(4);
    });
    it('prices case', async () => {
      await service.orchDataloadKafka('prices');

      expect(mockOrchDataloadUC.orchDataload).toHaveBeenCalledTimes(1);
    });
    it('disponibility case', async () => {
      await service.orchDataloadKafka('disponibility');

      expect(mockOrchDataloadUC.orchDataload).toHaveBeenCalledTimes(1);
    });
    it('Error case', async () => {
      jest
        .spyOn(mockOrchDataloadUC, 'orchDataload')
        .mockRejectedValue(new Error('No connection'));
      await service.orchDataloadKafka('disponibility');

      expect(mockServiceTracingUc.createServiceTracing).toHaveBeenCalled;
    });
  });
});
