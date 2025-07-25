import { Test, TestingModule } from '@nestjs/testing';
import { IServiceError, ServiceErrorModel } from '@claro/generic-models-library';
import { Model } from 'mongoose';
import { ServiceErrorProvider } from './service-error.provider.impl';
import { IServiceErrorProvider } from '../service-error.provider';
import { getModelToken } from '@nestjs/mongoose';
import databaseConfig from '../../common/configuration/database.config';

describe('ServiceErrorProvider', () => {
  let serviceErrorProvider: IServiceErrorProvider;
  let serviceErrorModel: Model<ServiceErrorModel>;

  beforeEach(async () => {
    const serviceErrorModel = {
      insertMany: jest.fn(),
    } as unknown as jest.Mocked<ServiceErrorModel>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceErrorProvider,
        {
          provide: getModelToken(ServiceErrorModel.name, databaseConfig.dbFeatures),
          useValue: serviceErrorModel,
        },
        { provide: ServiceErrorModel, useValue: serviceErrorModel },
      ],
    }).compile();

    serviceErrorProvider = module.get<IServiceErrorProvider>(ServiceErrorProvider);
    //serviceErrorModel = module.get<Model<ServiceErrorModel>>(getModelToken(ServiceErrorModel.name));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createServiceError', () => {
    it('should insert service error data', async () => {
      // Arrange
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

      // Act
      await serviceErrorProvider.createServiceError(serviceError);

      // Assert
      expect(serviceErrorModel.insertMany).toHaveBeenCalledWith(serviceError);
    });
  });

  // Add more test cases for other methods in the ServiceErrorProvider class
});