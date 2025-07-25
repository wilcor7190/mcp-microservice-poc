import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { TransformMovilFeatures } from './transform-movil-features.uc.impl';
import { TransformMovilPricesImpl } from './transform-movil-prices.uc.impl';

describe('TransformMovilPricesImpl', () => {
  let transformMovilPricesImpl: TransformMovilPricesImpl;

  let mockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;
  let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;

  beforeEach(async () => {
    mockIServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    mockIServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;

    transformMovilPricesImpl = new TransformMovilPricesImpl(
      mockIServiceTracingUc,
      mockIServiceErrorUc,
    );
  });
  describe('transformMovilPricesImpl', () => {
    it('should have the correct values on transformMovilPricesImpl', () => {
      expect(transformMovilPricesImpl).toBeDefined();
    });
  });
});
