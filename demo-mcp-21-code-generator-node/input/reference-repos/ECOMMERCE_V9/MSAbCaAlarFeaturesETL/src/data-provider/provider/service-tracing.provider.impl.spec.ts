import { IServiceTracing, ServiceTracingModel } from '@claro/generic-models-library';
import { Model } from 'mongoose';
import { ServiceTracingProvider } from './service-tracing.provider.impl';

describe('ServiceTracingProvider', () => {
  let service: ServiceTracingProvider;
  let serviceTracingModelMock: Model<ServiceTracingModel>;

  beforeEach(async () => {
    serviceTracingModelMock = {} as Model<ServiceTracingModel>;
    service = new ServiceTracingProvider(serviceTracingModelMock);
  });

  afterEach(() => {
    jest.resetAllMocks;
  });

  describe('createServiceTracing', () => {
    it('should insert service tracing data', async () => {
      // Arrange
      const serviceTracing: IServiceTracing = {
        transactionId: 'value1',
        status: 'value1',
        origin: 'value1',
        task: 'value1',
        description: 'value1',
        request: 'value1',
        method: 'value1',
        response: 'value1',
        processingTime: 11,
      };
      const serviceTracingModel = jest.fn().mockImplementation(() => ({
        insertMany: jest.fn().mockReturnValue(serviceTracing),
      }))();

      const serviceTracingProvider = new ServiceTracingProvider(
        serviceTracingModel,
      );

      // Act
      await serviceTracingProvider.createServiceTracing(serviceTracing);

      // Assert
      expect(serviceTracingModel.insertMany).toHaveBeenCalled;
    });
  });

  // Add more test cases for other methods in the ServiceTracingProvider class
});
