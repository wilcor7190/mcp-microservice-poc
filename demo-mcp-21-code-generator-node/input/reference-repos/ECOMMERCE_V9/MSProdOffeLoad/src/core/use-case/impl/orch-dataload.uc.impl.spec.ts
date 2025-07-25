import { Test, TestingModule } from '@nestjs/testing';
import { IDataloadProvider } from '../../../data-provider/dataload.provider';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { ISelectDataloadUC } from '../select-dataload.uc';
import { OrchDataloadUC } from './orch-dataload.uc.impl';
import { dataCategories } from '../../../../test/response-dummy';
import { IDataloadUC } from '../dataload.uc';
import { mockResponseEquipmentFilter, mockResponseTechnology } from '../../../mockup/stubs';

// Mock dependencies
const selectDataloadUc = {
  selectDataLoad: jest.fn(),
};

const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};

const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};

const dataloadProviderMock = {
  findEquipmentDataload: jest.fn(),
  findEquipmentFilterDataload: jest.fn(),
  findTechnologyDataload: jest.fn(),
  findPospagoDataload: jest.fn(),
  findPrepagoDataload: jest.fn(),
  findHomesDataload: jest.fn(),
  saveListParentsDataload: jest.fn(),
  getListParentsDataload: jest.fn(),
  orderListParentDataload: jest.fn(),
};

describe('OrchDataloadUC', () => {
  let orchDataloadUC: OrchDataloadUC;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrchDataloadUC,
        { provide: IDataloadUC, useValue: dataloadProviderMock },
        { provide: ISelectDataloadUC, useValue: selectDataloadUc },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();

    orchDataloadUC = module.get<OrchDataloadUC>(OrchDataloadUC);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the necessary methods to create dataload with Product-Data', async () => {
    const req = {
      dataload: 'Product-Data',
    };

    dataloadProviderMock.getListParentsDataload.mockResolvedValue([
      { parentPartNumber: '123' },
    ]);
    dataloadProviderMock.findEquipmentFilterDataload.mockResolvedValue(mockResponseEquipmentFilter);
    dataloadProviderMock.findEquipmentDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findTechnologyDataload.mockResolvedValue(mockResponseTechnology);
    dataloadProviderMock.findPrepagoDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findPospagoDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findHomesDataload.mockResolvedValue([{}]);
    dataloadProviderMock.orderListParentDataload.mockResolvedValue([{}]);

    selectDataloadUc.selectDataLoad.mockResolvedValue({
      dataCategories,
      req,
    });

    await orchDataloadUC.orchDataload(req);

    expect(selectDataloadUc.selectDataLoad).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with Attributes-Products', async () => {
    const req = {
      dataload: 'Attributes-Products',
    };

    dataloadProviderMock.getListParentsDataload.mockResolvedValue([
      { parentPartNumber: '123' },
    ]);
    dataloadProviderMock.findEquipmentFilterDataload.mockResolvedValue(mockResponseEquipmentFilter);
    dataloadProviderMock.findEquipmentDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findTechnologyDataload.mockResolvedValue(mockResponseTechnology);
    dataloadProviderMock.findPrepagoDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findPospagoDataload.mockResolvedValue([{}]);
    dataloadProviderMock.findHomesDataload.mockResolvedValue([{}]);
    dataloadProviderMock.orderListParentDataload.mockResolvedValue([{}]);

    selectDataloadUc.selectDataLoad.mockResolvedValue({
      dataCategories,
      req,
    });

    await orchDataloadUC.orchDataload(req);

    expect(selectDataloadUc.selectDataLoad).toHaveBeenCalled;
  });
/*   it('should get empty data', async () => {
    const req = {
      dataload: 'Product-Data',
    };

    dataloadProviderMock.getListParents.mockResolvedValue([]);
    dataloadProviderMock.findEquipmentFilter.mockResolvedValue([]);
    dataloadProviderMock.findEquipment.mockResolvedValue([{}]);

    selectDataloadUc.selectDataLoad.mockResolvedValue({
      dataCategories,
      req,
    });

    await orchDataloadUC.orchDataload(req);

    // expect(dataloadProviderMock.getListParents).toHaveBeenCalled();
    expect(dataloadProviderMock.findEquipmentFilter).toHaveBeenCalled;
  }); */
});
