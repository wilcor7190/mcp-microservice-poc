import { Test, TestingModule } from '@nestjs/testing';
import { responseDummy } from '../../test/response-dummy';
import { EventsController } from './events.controller';
import { IEventsService } from './service/events.service';
import { IServiceErrorUc } from '../core/use-case/resource/service-error.resource.uc';

describe('EventsController', () => {
  let controller: EventsController;
  let mockEventsService: jest.Mocked<IEventsService>;
  let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;


  beforeEach(async () => {
    mockEventsService = {
      orchDataloadKafka: jest.fn(),
    } as jest.Mocked<IEventsService>;

    mockIServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: IEventsService, useValue: mockEventsService },
        { provide: IServiceErrorUc, useValue: mockIServiceErrorUc }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  describe('onFeatureCalendarAlarmEvent', () => {
    it('should success', async () => {
      mockEventsService.orchDataloadKafka.mockResolvedValue({});

      const payload = {
        service: 'MSAbCaAlarFeaturesETL', status: 'Created',
      };

      await controller.onFeatureCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).toHaveBeenCalledWith("features");
    });
    it('should not success', async () => {

      const payload = {
        value: { service: '', status: '' },
      };

      await controller.onFeatureCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).not.toHaveBeenCalled;
    });
  });

  describe('onPricesCalendarAlarmEvent', () => {
    it('should success', async () => {
      mockEventsService.orchDataloadKafka.mockResolvedValue({});

      const payload = {
        service: 'MSAbCaAlarPricesETL', status: 'Created',
      };

      await controller.onPricesCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).toHaveBeenCalledWith("prices");
    });
    it('should not success', async () => {

      const payload = {
        value: { service: '', status: '' },
      };

      await controller.onPricesCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).not.toHaveBeenCalled;
    });
  });
  describe('onDisponibilityCalendarAlarmEvent', () => {
    it('should success', async () => {
      mockEventsService.orchDataloadKafka.mockResolvedValue({});

      const payload = {
        service: 'MSAbCaAlarDisponibilityETL', status: 'Created',
      };

      await controller.onDisponibilityCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).toHaveBeenCalledWith("disponibility");
    });
    it('should not success', async () => {

      const payload = {
        value: { service: '', status: '' },
      };

      await controller.onDisponibilityCalendarAlarmEvent(payload);

      expect(mockEventsService.orchDataloadKafka).not.toHaveBeenCalled;
    });
  });
});
