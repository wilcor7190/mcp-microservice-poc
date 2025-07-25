import { ContingencyJob } from './contingency.job';
import { IContingencyService } from '../service/contingency.service';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';

describe('ContingencyJob', () => {
  let contingencyJob: ContingencyJob;
  let contingencyServiceMock: jest.Mocked<IContingencyService>;
  let serviceTracingMock: jest.Mocked<IServiceTracingUc>;

  beforeEach(() => {
    contingencyServiceMock = {
      getData: jest.fn(),
      getDataMobile: jest.fn(),
      getDataHomes: jest.fn(),
      getDataManual: jest.fn(),
    };

    serviceTracingMock = {
      createServiceTracing: jest.fn(),
    };

    contingencyJob = new ContingencyJob(contingencyServiceMock, serviceTracingMock);
  });

  describe('getFeaturesPrices', () => {
    it('should call createServiceTracing and getData', () => {
      // Arrange
      const createServiceTracingMock = jest.spyOn(serviceTracingMock, 'createServiceTracing');
      const getDataMock = jest.spyOn(contingencyServiceMock, 'getData');

      // Act
      contingencyJob.getFeaturesPrices();

      // Assert
      expect(createServiceTracingMock).toHaveBeenCalled();
      expect(getDataMock).toHaveBeenCalled();

      createServiceTracingMock.mockRestore();
      getDataMock.mockRestore();
    });
  });

  describe('getDataMobile', () => {
    it('should call getDataMobile', () => {
      // Arrange
      const getDataMobileMock = jest.spyOn(contingencyServiceMock, 'getDataMobile');

      // Act
      contingencyJob.getDataMobile();

      // Assert
      expect(getDataMobileMock).toHaveBeenCalled();

      getDataMobileMock.mockRestore();
    });
  });

  describe('getDataHomes', () => {
    it('should call getDataHomes', () => {
      // Arrange
      const getDataHomesMock = jest.spyOn(contingencyServiceMock, 'getDataHomes');

      // Act
      contingencyJob.getDataHomes();

      // Assert
      expect(getDataHomesMock).toHaveBeenCalled();

      getDataHomesMock.mockRestore();
    });
  });
});
