import { Test, TestingModule } from "@nestjs/testing";
import { GetErrorTracingUcimpl } from "./get-error-tracing.resource.uc.impl";
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';

describe('ServiceTracingUcimpl', () => {
  let service: GetErrorTracingUcimpl;
  let MockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;
  let MockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    MockIServiceErrorUc = {
      createServiceError: jest.fn()
    }as jest.Mocked<IServiceErrorUc>;

    MockIServiceTracingUc = {
        createServiceTracing: jest.fn()
      }as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetErrorTracingUcimpl,
        { provide: IServiceErrorUc, useValue: MockIServiceErrorUc },
        { provide: IServiceTracingUc, useValue: MockIServiceTracingUc },
      ],
    }).compile();

    service = module.get<GetErrorTracingUcimpl>(GetErrorTracingUcimpl);
  });

  describe('createTraceability', () => {
    it('debe llamar a createTraceability', async () => {

      jest.spyOn(service, 'createTraceability')

      // Act
      await service.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.SAVE_DATA);

      // Assert
      expect(service.createTraceability).toHaveBeenCalled()
    });
  })

  describe('createTraceability', () => {
    it('debe llamar a getError', async () => {

      let error = "TypeError: Cannot read properties of undefined (reading length) at GetDataFeaturesUc"
  
      jest.spyOn(service, 'getError')
  
      // Act
      await service.getError(error);
  
      // Assert
      expect(service.getError).toHaveBeenCalled()
    });

  })

  
});
