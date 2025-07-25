import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { IServiceTracingUc } from "../../core/use-case/resource/service-tracing.resource.uc";
import { dataCategories, dataEquipmentDummy, dataHomesDummy, dataParentsDummy, dataPospagoDummy, dataPrepagoDummy, dataTechnologyDummy } from "../../../test/response-dummy";
import { ParentsChildsModel } from "../model/dataload/colprtclasifparents.model";
import { EquipmentModel } from "../model/dataload/equipment.model";
import { HomesModel } from "../model/dataload/homes.model";
import { PospagoModel } from "../model/dataload/pospago.model";
import { PrepagoModel } from "../model/dataload/prepago.model";
import { TechnologyModel } from "../model/dataload/technology.model";
import { DataloadProviderImpl } from "./dataload.provider.impl";
import databaseConfig from "../../common/configuration/database.config";


const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};
 
 
describe('AttributesDictionaryUC', () => {
  let dataloadProviderImpl: DataloadProviderImpl;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataloadProviderImpl,
        { provide: getModelToken(EquipmentModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataEquipmentDummy)
        }},
        { provide: getModelToken(TechnologyModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataTechnologyDummy)
        }},
        { provide: getModelToken(PospagoModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataPospagoDummy)
        }},
        { provide: getModelToken(PrepagoModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataPrepagoDummy)
        }},
        { provide: getModelToken(HomesModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataHomesDummy)
        }},
        { provide: getModelToken(ParentsChildsModel.name, databaseConfig.databaseFeatures), useValue: {
          find: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(dataParentsDummy)
        }},
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
        
    
      ],
    }).compile();
 
    dataloadProviderImpl = module.get<DataloadProviderImpl>(DataloadProviderImpl);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should call the necessary methods to create dataload', async () => {
 
    // Call the method
    await dataloadProviderImpl.findEquipment();
    await dataloadProviderImpl.findEquipmentFilter();
    await dataloadProviderImpl.findTechnology();
    await dataloadProviderImpl.findPospago();
    await dataloadProviderImpl.findPrepago();
    await dataloadProviderImpl.findHomes();
    await dataloadProviderImpl.saveListParents(dataCategories);
    await dataloadProviderImpl.getListParents("Terminales");
    await dataloadProviderImpl.orderListParent(dataEquipmentDummy, "Terminales");
 
  });
});