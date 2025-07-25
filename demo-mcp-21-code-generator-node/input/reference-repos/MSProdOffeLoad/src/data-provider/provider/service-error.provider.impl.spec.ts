import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ServiceErrorProvider } from './service-error.provider.impl';
import { getModelToken } from '@nestjs/mongoose';
import databaseConfig from '../../common/configuration/database.config';
import { IServiceError, ServiceErrorModel } from '@claro/generic-models-library';

describe('ServiceErrorProvider', () => {
  let serviceErrorProvider: ServiceErrorProvider;
  let serviceErrorModel: Model<ServiceErrorModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceErrorProvider,
        {
          provide: getModelToken(
            ServiceErrorModel.name,
            databaseConfig.database,
          ),
          useValue: {
            insertMany: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    serviceErrorProvider =
      module.get<ServiceErrorProvider>(ServiceErrorProvider);
    serviceErrorModel = module.get<Model<ServiceErrorModel>>(
      getModelToken(ServiceErrorModel.name, databaseConfig.database),
    );
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
        response: 'Service 1',
      };

      // Act
      await serviceErrorProvider.createServiceError(serviceError);

      // Assert
      expect(serviceErrorModel.insertMany).toHaveBeenCalled;
    });
    it('should call countDocuments', async () => {

      // Act
      await serviceErrorProvider.getTotal('');

      // Assert
      expect(serviceErrorModel.countDocuments).toHaveBeenCalled;
    });
    it('should call find', async () => {

      // Act
      await serviceErrorProvider.getServiceErrors('');

      // Assert
      expect(serviceErrorModel.find).toHaveBeenCalled;
    });
    it('should call findOne', async () => {

      // Act
      await serviceErrorProvider.getServiceError('');

      // Assert
      expect(serviceErrorModel.findOne).toHaveBeenCalled;
    });
  });

  // Add more test cases for other methods in the ServiceErrorProvider class
});
