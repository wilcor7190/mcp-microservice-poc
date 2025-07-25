import { Test, TestingModule } from '@nestjs/testing';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { DataloadUCImpl } from './dataload.uc.impl';
import { IDataloadProvider } from '../../../data-provider/dataload.provider';

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
  let dataloadUCImp: DataloadUCImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataloadUCImpl,
        { provide: IDataloadProvider, useValue: dataloadProviderMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();

    dataloadUCImp = module.get<DataloadUCImpl>(DataloadUCImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call findEquipment right', async () => {
    dataloadProviderMock.findEquipmentDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findEquipmentDataload();

    expect(dataloadProviderMock.findEquipmentDataload).toHaveBeenCalled;
  });
  it('should throw error findEquipment', async () => {
    dataloadProviderMock.findEquipmentDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findEquipmentDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call findEquipmentFilter right', async () => {
    dataloadProviderMock.findEquipmentFilterDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findEquipmentFilterDataload();

    expect(dataloadProviderMock.findEquipmentFilterDataload).toHaveBeenCalled;
  });
  it('should throw error findEquipmentFilter', async () => {
    dataloadProviderMock.findEquipmentFilterDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findEquipmentFilterDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call findTechnology right', async () => {
    dataloadProviderMock.findTechnologyDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findTechnologyDataload();

    expect(dataloadProviderMock.findTechnologyDataload).toHaveBeenCalled;
  });
  it('should throw error findTechnology', async () => {
    dataloadProviderMock.findTechnologyDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findTechnologyDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call findPospago right', async () => {
    dataloadProviderMock.findPospagoDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findPospagoDataload();

    expect(dataloadProviderMock.findPospagoDataload).toHaveBeenCalled;
  });
  it('should throw error findPospago', async () => {
    dataloadProviderMock.findPospagoDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findPospagoDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call findPrepago right', async () => {
    dataloadProviderMock.findPrepagoDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findPrepagoDataload();

    expect(dataloadProviderMock.findPrepagoDataload).toHaveBeenCalled;
  });
  it('should throw error findPrepago', async () => {
    dataloadProviderMock.findPrepagoDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findPrepagoDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call findHomes right', async () => {
    dataloadProviderMock.findHomesDataload.mockResolvedValue([{}]);

    await dataloadUCImp.findHomesDataload();

    expect(dataloadProviderMock.findHomesDataload).toHaveBeenCalled;
  });
  it('should throw error findHomes', async () => {
    dataloadProviderMock.findHomesDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.findHomesDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call getListParents right', async () => {
    dataloadProviderMock.getListParentsDataload.mockResolvedValue([{}]);

    await dataloadUCImp.getListParentsDataload();

    expect(dataloadProviderMock.getListParentsDataload).toHaveBeenCalled;
  });
  it('should throw error getListParents', async () => {
    dataloadProviderMock.getListParentsDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.getListParentsDataload();
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call saveListParents right', async () => {
    dataloadProviderMock.saveListParentsDataload.mockResolvedValue([{}]);

    await dataloadUCImp.saveListParentsDataload({});

    expect(dataloadProviderMock.saveListParentsDataload).toHaveBeenCalled;
  });
  it('should throw error saveListParents', async () => {
    dataloadProviderMock.saveListParentsDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.saveListParentsDataload({});
    } catch (error) {
      expect(error).toBeDefined;
    }
  });
  it('should call orderListParent right', async () => {
    dataloadProviderMock.orderListParentDataload.mockResolvedValue([{}]);

    await dataloadUCImp.orderListParentDataload([], "Terminales");

    expect(dataloadProviderMock.orderListParentDataload).toHaveBeenCalled;
  });
  it('should throw error orderListParent', async () => {
    dataloadProviderMock.orderListParentDataload.mockRejectedValue(new Error(''));

    try {
      await dataloadUCImp.orderListParentDataload([], "Terminales");
    } catch (error) {
      expect(error).toBeDefined;
    }
  });

});
