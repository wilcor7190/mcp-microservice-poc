import { Model } from 'mongoose';
import { ServiceErrorProvider } from './service-error.provider.impl';
import { IServiceError, ServiceErrorModel } from '@claro/generic-models-library';

describe('ServiceErrorProvider', () => {
  let service: ServiceErrorProvider;
  let serviceErrorModelmock: Model<ServiceErrorModel>;

  beforeEach(async () => {
    serviceErrorModelmock = {} as Model<ServiceErrorModel>;
    service = new ServiceErrorProvider(serviceErrorModelmock);
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

});