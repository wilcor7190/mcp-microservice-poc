
import { IGetDataPricesUc } from '../get-data-prices.uc';
import { TestingModule, Test } from "@nestjs/testing";
import { PricesUc } from '../impl/orch-prices.uc.impl';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';

describe('PricesUc', () => {
  let service: PricesUc;
  let mockIGetDataPricesUc: jest.Mocked<IGetDataPricesUc>;
  let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;

  beforeEach(async() => {
    mockIGetDataPricesUc = {
      getSftpFiles: jest.fn(),
    }as jest.Mocked<IGetDataPricesUc>;

    mockIGetErrorTracingUc={
      createTraceability: jest.fn(),
      getError: jest.fn(),
    }as jest.Mocked<IGetErrorTracingUc>;

   

    const module: TestingModule = await Test.createTestingModule({
        providers: [
            PricesUc,
            { provide: IGetDataPricesUc, useValue: mockIGetDataPricesUc },
            { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
        ],
    }).compile();

    service = module.get<PricesUc>(PricesUc);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
});

it('should call getSftpFiles', async () => {
    await mockIGetDataPricesUc.getSftpFiles();
    expect(mockIGetDataPricesUc.getSftpFiles).toHaveBeenCalled();
});

it('should call getOrch', async () => {
  jest.spyOn(service, 'getOrch')
  await service.getOrch()
  await mockIGetDataPricesUc.getSftpFiles();
  expect(mockIGetDataPricesUc.getSftpFiles).toHaveBeenCalled();
  expect(service.getOrch).toHaveBeenCalledTimes(1)
});

it('should call getOrch', async () => {
  jest.spyOn(service, 'getOrch')
  mockIGetDataPricesUc.getSftpFiles.mockRejectedValue(new Error());
  await service.getOrch();
  expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
});
  
})