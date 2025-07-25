import { Test, TestingModule } from '@nestjs/testing';
import { ServiceErrorProvider } from './service-error.provider.impl';
import { IServiceErrorProvider } from '../service-error.provider';
import { getModelToken } from '@nestjs/mongoose';
import { IServiceError, ServiceErrorModel } from '@claro/generic-models-library';

describe('ServiceErrorProvider', () => {
  let serviceErrorProvider: IServiceErrorProvider;

  beforeEach(async () => {
    const serviceErrorModel = {
      insertMany: jest.fn(),
    } as unknown as jest.Mocked<ServiceErrorModel>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceErrorProvider,
        {
          provide: getModelToken(ServiceErrorModel.name),
          useValue: serviceErrorModel,
        },
        { provide: ServiceErrorModel, useValue: serviceErrorModel },
      ],
    }).compile();

    serviceErrorProvider = module.get<IServiceErrorProvider>(ServiceErrorProvider);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createServiceError', () => {
    it('should insert service error data', async () => {
      const serviceError: IServiceError = {
        success: true,
        origin: 'Service 1',
        method: 'Service 1',
        message: 'Service 1',
        channel: 'Service 1',
        stack: 'Service 1',
        request: 'Service 1',
        serviceId: 'Service 1',
        response:'Service 1',
      };

      const serviceErrorModel = jest.fn().mockImplementation(() => ({
        insertMany: jest.fn().mockReturnValue(serviceError),
      }))();

      const serviceErrorProvider = new ServiceErrorProvider(serviceErrorModel);

      await serviceErrorProvider.createServiceError(serviceError);

      expect(serviceErrorModel.insertMany).toHaveBeenCalledWith(serviceError);
    });

  });

});