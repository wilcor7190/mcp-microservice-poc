import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IMappingMovilOrchUC } from '../mapping-movil-orch.uc';
import { ItransformMovilFeatures } from '../transform-movil-features.uc';
import { ItransformMovilPrices } from '../transform-movil-prices.uc';
import { MappingMovilOrchUCImpl } from './mapping-movil-orch.uc.impl';

describe('MappingMovilOrchUCImpl', () => {
  let mappingMovilOrchUC: IMappingMovilOrchUC;
  let transformMovilFeaturesMock: jest.Mocked<ItransformMovilFeatures>;
  let transformMovilPricesMock: jest.Mocked<ItransformMovilPrices>;
  let serviceErrorMock: jest.Mocked<IServiceErrorUc>;

  beforeEach(() => {
    transformMovilFeaturesMock = {
      transformOriginalData: jest.fn(),
    };

    transformMovilPricesMock = {
      transformOriginalData: jest.fn(),
    };

    serviceErrorMock = {
      createServiceError: jest.fn(),
    };

    mappingMovilOrchUC = new MappingMovilOrchUCImpl(
      transformMovilFeaturesMock,
      transformMovilPricesMock,
      serviceErrorMock
    );
  });

  describe('mappingMovilOrch', () => {
    it('should call transformOriginalData for features and prices', async () => {
      // Arrange
      const arrayPrice = [{}];
      const arrayFeatures = [{}];

      // Act
      await mappingMovilOrchUC.mappingMovilOrch(arrayPrice, arrayFeatures);

      // Assert
      expect(transformMovilFeaturesMock.transformOriginalData).toHaveBeenCalledWith(arrayFeatures);
      expect(transformMovilPricesMock.transformOriginalData).toHaveBeenCalledWith(arrayPrice);
      expect(serviceErrorMock.createServiceError).not.toHaveBeenCalled();
    });

      
  });
});
