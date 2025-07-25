import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { KafkaTracingProvider } from './kafka-tracing.provider.imp';
import { ClientProxy } from '@nestjs/microservices';
import { IServiceTracing } from 'src/core/entity/service-tracing/service-tracing.entity';
import * as rxjs from 'rxjs';
import { ETaskDesc, Etask } from 'src/common/utils/enums/taks.enum';
import { ETraceStatus } from 'src/common/utils/enums/tracing.enum';

describe('KafkaTracingProvider', () => {
  let serviceProvider: KafkaTracingProvider;
  let serviceError: IServiceErrorUc;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    clientProxy = {} as ClientProxy;
    serviceError = {} as IServiceErrorUc;
    serviceProvider = new KafkaTracingProvider(clientProxy, serviceError);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createServiceTracing', () => {
    const serviceTracing: IServiceTracing = {
      transactionId: '123',
      origen: 'test',
      status: 'BD_ERROR',
      task: 'test task',
      description: 'test description',
      request: {},
      response: {},
      processingTime: 100
    };

    it('It should end without going through the catch', async () => {
      clientProxy.emit = jest.fn().mockImplementation(() => {});
      serviceError.createServiceError = jest.fn().mockReturnThis();
      jest.spyOn(rxjs, 'firstValueFrom').mockImplementation(() => Promise.resolve({}));
      await serviceProvider.createServiceTracing(serviceTracing);
      expect(rxjs.firstValueFrom).toHaveBeenCalledTimes(1);
      expect(clientProxy.emit).toHaveBeenCalledTimes(1);
    });
    it('should go through the catch and assign the error task.', async () => {
      const mockError = new Error('Test.');
      clientProxy.emit = jest.fn().mockImplementation(() => {});
      serviceError.createServiceError = jest.fn().mockReturnThis();
      jest.spyOn(rxjs, 'firstValueFrom').mockImplementation(() => Promise.reject(mockError));
      await serviceProvider.createServiceTracing(serviceTracing);
      expect(rxjs.firstValueFrom).toHaveBeenCalledTimes(1);
      expect(clientProxy.emit).toHaveBeenCalledTimes(1);
      expect(mockError['task_name']).toBe(Etask.TRACE_KAFKA);
      expect(mockError['task_description']).toBe(ETaskDesc.TRACE_KAFKA);
    });
  });

  describe('mapServiceTracingToTraceEvent', () =>{
    it('servicetracing with status "WARN"', () => {
      const mockTrace: IServiceTracing = {
        status: 'WARN',
        transactionId: '',
        task: '',
        description: '',
        origen: '',
        request: '',
        response: '',
        processingTime: 1,
      }
      const response = serviceProvider.mapServiceTracingToTraceEvent(mockTrace);
      expect(response.event.traceabilityStatus).toBe(ETraceStatus.FAILED);
      expect(response.event.description).toBe('');
    });
    it('servicetracing with status "FAILED"', () => {
      const mockTrace: IServiceTracing = {
        status: 'FAILED'
      }
      const response = serviceProvider.mapServiceTracingToTraceEvent(mockTrace);
      expect(response.event.traceabilityStatus).toBe(ETraceStatus.FAILED);
      expect(response.event.description).toBe('');
    });
  })
});
