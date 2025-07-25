import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { ServiceTracingModel } from '../model/service-tracing/service-tracing.model';
import { ServiceTracingProvider } from './service-tracing.provider.impl';
import { IServiceTracing } from 'src/core/entity/service-tracing/service-tracing.entity';

describe('ServiceErrorProvider', () => {
  let serviceTracingProvider: IServiceTracingProvider;

  beforeEach(async () => {
    const serviceTracingModel = {
      insertMany: jest.fn(),
    } as unknown as jest.Mocked<ServiceTracingModel>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTracingProvider,
        {
          provide: getModelToken(ServiceTracingModel.name),
          useValue: serviceTracingModel,
        },
        { provide: ServiceTracingModel, useValue: serviceTracingModel },
      ],
    }).compile();

    serviceTracingProvider = module.get<IServiceTracingProvider>(ServiceTracingModel);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createServiceError', () => {
    it('should insert service tracing data', async () => {


      const serviceTracingModel = jest.fn().mockImplementation(() => ({
        insertMany: jest.fn().mockReturnValue(''),
      }))();

      const serviceTracingProvider = new ServiceTracingProvider(serviceTracingModel);

      const dto: IServiceTracing = {

      }

      const result = await serviceTracingProvider.createServiceTracing(dto);

      expect(result).toBeDefined
    });
  });
});