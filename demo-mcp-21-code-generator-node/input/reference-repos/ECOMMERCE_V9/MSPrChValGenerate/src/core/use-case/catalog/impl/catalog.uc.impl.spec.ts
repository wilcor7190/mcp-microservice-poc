import { Test, TestingModule } from '@nestjs/testing';

import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { ICatalogProvider } from 'src/data-provider/provider/catalog/catalog.provider';
import { CatalogUcImpl } from './catalog.uc.impl';
import { FamilyParams } from 'src/common/utils/enums/params.enum';

describe('CatalogUcImpl', () => {
  let service: CatalogUcImpl;

  let mockICatalogProvider: jest.Mocked<ICatalogProvider>;
  let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;

  beforeEach(async () => {
    mockICatalogProvider = {
      deleteAttributes: jest.fn(),
      saveAttributes: jest.fn(),
      getDataAttributes: jest.fn(),
      getDataSkuException: jest.fn(),
      deleteExceptionSkus: jest.fn(),
      saveExceptionSkus: jest.fn(),
      deleteTermsConditions: jest.fn(),
      saveTermsConditions: jest.fn(),
      getAllTermsConditions: jest.fn(),
      deleteDisponibilityFile: jest.fn(),
      saveDisponibilityFile: jest.fn(),
    } as jest.Mocked<ICatalogProvider>;

    mockIGetErrorTracingUc = {
      getError: jest.fn(),
      createTraceability: jest.fn(),
    } as jest.Mocked<IGetErrorTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogUcImpl,
        { provide: ICatalogProvider, useValue: mockICatalogProvider },
        { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
      ],
    }).compile();

    service = module.get<CatalogUcImpl>(CatalogUcImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deleteAttributes', async () => {
    mockICatalogProvider.deleteAttributes.mockResolvedValue;

    await service.deleteAttributes();

    expect(mockICatalogProvider.deleteAttributes).toHaveBeenCalled();
  });
  it('deleteAttributes Error', async () => {
    mockICatalogProvider.deleteAttributes.mockRejectedValue(new Error());

    await service.deleteAttributes();

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });
  it('saveAttributes', async () => {
    mockICatalogProvider.saveAttributes.mockResolvedValue;

    await service.saveAttributes('');

    expect(mockICatalogProvider.saveAttributes).toHaveBeenCalled();
  });
  it('saveAttributes Error', async () => {
    mockICatalogProvider.saveAttributes.mockRejectedValue(new Error());

    await service.saveAttributes('');

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });
  it('getDataAttributes', async () => {
    mockICatalogProvider.getDataAttributes.mockResolvedValue;

    await service.getDataAttributes(FamilyParams.equipment);

    expect(mockICatalogProvider.getDataAttributes).toHaveBeenCalled();
  });
  it('getDataAttributes Error', async () => {
    mockICatalogProvider.getDataAttributes.mockRejectedValue(new Error());

    await service.getDataAttributes(FamilyParams.equipment);

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });
  it('deleteExceptionSkus', async () => {
    mockICatalogProvider.deleteExceptionSkus.mockResolvedValue;

    await service.deleteExceptionSkus();

    expect(mockICatalogProvider.deleteExceptionSkus).toHaveBeenCalled();
  });
  it('deleteExceptionSkus Error', async () => {
    mockICatalogProvider.deleteExceptionSkus.mockRejectedValue(new Error());

    await service.deleteExceptionSkus();

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });
  it('saveExceptionSkus', async () => {
    mockICatalogProvider.saveExceptionSkus.mockResolvedValue;

    await service.saveExceptionSkus('');

    expect(mockICatalogProvider.saveExceptionSkus).toHaveBeenCalled();
  });
  it('getDataSkuException Error', async () => {
    mockICatalogProvider.getDataSkuException.mockRejectedValue(new Error());

    await service.getDataSkuException(FamilyParams.equipment);

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });
  it('getDataSkuException', async () => {
    mockICatalogProvider.getDataSkuException.mockResolvedValue;

    await service.getDataSkuException(FamilyParams.equipment);

    expect(mockICatalogProvider.getDataSkuException).toHaveBeenCalled();
  });
  it('saveExceptionSkus Error', async () => {
    mockICatalogProvider.saveExceptionSkus.mockRejectedValue(new Error());

    await service.saveExceptionSkus('');

    expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
  });

});
