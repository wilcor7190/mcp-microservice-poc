import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import {
  contingencyDummyFeatures,
} from '../../../../test/response-dummy';
import generalConfig from '../../../common/configuration/general.config';
import { ICategoriesProvider } from '../../../data-provider/categories.provider';
import { IParamProvider } from '../../../data-provider/param.provider';
import { IParentsProvider } from '../../../data-provider/parents.provider';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { CategoriesUCImpl } from './categories.uc.impl';
import {
  mockFeatureMappingTecnologia,
  mockFeatureMappingTerminales,
  mockGetContingencyFilterFeatures,
  mockGetContingencyFilterPrices,
  mockParamCategoria,
  mockParamTipoProducto,
} from '../../../mockup/stubs';
import {
  mockGetContingencyFilterTecnologia,
  mockGetContingencyFilterTecnologiaPrices,
} from '../../../mockup/stubs-2';

const categoriesProviderMock = {
  getContingency: jest.fn(),
  updateFeatures: jest.fn(),
  deleteCollections: jest.fn(),
  findCollections: jest.fn(),
};

const parentsProviderMock = {
  saveListParents: jest.fn(),
  deleteCollection: jest.fn(),
};

describe('SendOrderUcimpl', () => {
  let service: CategoriesUCImpl;
  let paramProvider: IParamProvider;
  let serviceErrorUc: IServiceErrorUc;
  let serviceTracingUc: IServiceTracingUc;
  let parentsProvider: IParentsProvider;
  let categoriesProvider: ICategoriesProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA',
            transport: Transport.KAFKA,
            options: {
              consumer: {
                groupId: generalConfig.kafkaIdGroup,
              },
              client: {
                brokers: [generalConfig.kafkaBroker],
                ssl: false,
              },
            },
          },
        ]),
      ],
      providers: [
        CategoriesUCImpl,
        {
          provide: ICategoriesProvider,
          useValue: categoriesProviderMock,
        },
        {
          provide: IParamProvider,
          useValue: {
            loadParams: jest.fn(),
            getParams: jest.fn(),
            getTotal: jest.fn(),
            getParamByIdParam: jest.fn(),
            updateParam: jest.fn(),
            getFeaturesEnabled: jest.fn(),
          },
        },
        {
          provide: IServiceErrorUc,
          useValue: {
            createServiceError: jest.fn(),
          },
        },
        {
          provide: IServiceTracingUc,
          useValue: {
            createServiceTracing: jest.fn(),
          },
        },
        {
          provide: IParentsProvider,
          useValue: parentsProviderMock,
        },
      ],
    }).compile();
    service = module.get<CategoriesUCImpl>(CategoriesUCImpl);
    paramProvider = module.get<IParamProvider>(IParamProvider);
    serviceErrorUc = module.get<IServiceErrorUc>(IServiceErrorUc);
    serviceTracingUc = module.get<IServiceTracingUc>(IServiceTracingUc);
    parentsProvider = module.get<IParentsProvider>(IParentsProvider);
    categoriesProvider = module.get<ICategoriesProvider>(ICategoriesProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('Should save features', async () => {
    jest
      .spyOn(parentsProvider, 'deleteCollection')
      .mockResolvedValue
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterFeatures);
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterPrices);
    jest
      .spyOn(paramProvider, 'getFeaturesEnabled')
      .mockResolvedValueOnce(mockFeatureMappingTerminales);
    jest
      .spyOn(categoriesProvider, 'deleteCollections')
      .mockResolvedValue
    jest
      .spyOn(paramProvider, 'getParamByIdParam')
      .mockResolvedValue(mockParamTipoProducto);

    await service.updateFeatures(mockParamCategoria);

    expect(parentsProvider.deleteCollection).toHaveBeenCalled;
    expect(categoriesProvider.getContingency).toHaveBeenCalledTimes(2);
    expect(paramProvider.getFeaturesEnabled).toHaveBeenCalled;
    expect(paramProvider.getParamByIdParam).toHaveBeenCalled;
  });

  it('Should save features technology', async () => {
    jest
      .spyOn(parentsProvider, 'deleteCollection')
      .mockResolvedValue
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterTecnologia);
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterTecnologiaPrices);
    jest
      .spyOn(paramProvider, 'getFeaturesEnabled')
      .mockResolvedValueOnce(mockFeatureMappingTecnologia);
    jest
      .spyOn(categoriesProvider, 'deleteCollections')
      .mockResolvedValue
    jest
      .spyOn(paramProvider, 'getParamByIdParam')
      .mockResolvedValue(mockParamTipoProducto);

    await service.updateFeatures(mockParamCategoria);

    expect(parentsProvider.deleteCollection).toHaveBeenCalled;
    expect(categoriesProvider.getContingency).toHaveBeenCalledTimes(2);
    expect(paramProvider.getFeaturesEnabled).toHaveBeenCalled;
    expect(paramProvider.getParamByIdParam).toHaveBeenCalled;
  });

  it('Should throw error deleteCollections', async () => {
    jest
      .spyOn(parentsProvider, 'deleteCollection')
      .mockResolvedValue
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterFeatures);
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterPrices);
    jest
      .spyOn(paramProvider, 'getFeaturesEnabled')
      .mockResolvedValueOnce(mockFeatureMappingTerminales);
    jest
      .spyOn(categoriesProviderMock, 'deleteCollections')
      .mockRejectedValue(new Error(''));

    await service.updateFeatures(mockParamCategoria);

    expect(categoriesProvider.getContingency).toHaveBeenCalled;
    expect(paramProvider.getFeaturesEnabled).toHaveBeenCalled;
    expect(serviceErrorUc.createServiceError).toHaveBeenCalled;
  });
  it('Should throw error findCollections', async () => {
    jest
      .spyOn(parentsProvider, 'deleteCollection')
      .mockResolvedValue
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterFeatures);
    jest
      .spyOn(categoriesProvider, 'getContingency')
      .mockResolvedValueOnce(mockGetContingencyFilterPrices);
    jest
      .spyOn(paramProvider, 'getFeaturesEnabled')
      .mockResolvedValueOnce(mockFeatureMappingTerminales);
    jest
      .spyOn(categoriesProvider, 'deleteCollections')
      .mockResolvedValue
    jest
      .spyOn(paramProvider, 'getParamByIdParam')
      .mockResolvedValue(mockParamTipoProducto);
    jest
      .spyOn(categoriesProviderMock, 'findCollections')
      .mockRejectedValue(new Error(''));

    await service.updateFeatures(mockParamCategoria);

    expect(categoriesProvider.getContingency).toHaveBeenCalled;
    expect(paramProvider.getFeaturesEnabled).toHaveBeenCalled;
    expect(serviceErrorUc.createServiceError).toHaveBeenCalled;
  });
});
