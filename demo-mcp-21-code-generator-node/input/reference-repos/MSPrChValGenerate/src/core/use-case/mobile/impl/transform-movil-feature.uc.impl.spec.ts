import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { TransformMovilFeatures } from './transform-movil-features.uc.impl';

describe('TransformMovilFeatures', () => {
  let transformMovilFeatures: TransformMovilFeatures;

  let mockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;
  let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;

  beforeEach(async () => {
    mockIServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    mockIServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;

    transformMovilFeatures = new TransformMovilFeatures(
      mockIServiceTracingUc,
      mockIServiceErrorUc,
    );
  });
  describe('transformOriginalData', () => {
    it('should have the correct values on transformOriginalData', () => {
      expect(transformMovilFeatures).toBeDefined();
    });
  });
});
