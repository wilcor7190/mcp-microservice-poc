import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { parentsData } from "../../../test/response-dummy";
import databaseConfig from "../../common/configuration/database.config";
import { IServiceErrorUc } from "../../core/use-case/resource/service-error.resource.uc";
import { ParentsChildsModel } from "../model/parentsChilds.model";
import { ParentsTemporaryModel } from "../model/parents.model";
import { ParentsProviderImpl } from "./parents.provider.impl";


describe('TestService ParentsProviderImpl', () => {
  let service: ParentsProviderImpl;
  let serviceErrorUc: IServiceErrorUc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentsProviderImpl,
        {
          provide: IServiceErrorUc,
          useValue: {
            createServiceError: jest.fn(),
          }
        },
        { provide: getModelToken(ParentsChildsModel.name, databaseConfig.dbFeatures), useValue: { insertMany: jest.fn(), deleteMany: jest.fn() }},
        { provide: getModelToken(ParentsTemporaryModel.name, databaseConfig.dbFeatures), useValue: { insertMany: jest.fn(), deleteMany: jest.fn() }},
        {
          provide: getModelToken(ParentsTemporaryModel.name, databaseConfig.dbFeatures),
          useValue: {
            insertMany: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ParentsProviderImpl>(ParentsProviderImpl)
    serviceErrorUc = module.get<IServiceErrorUc>(IServiceErrorUc);
  })

  it('Should call saveListParents', async() => {
    jest.spyOn(service, "saveListParents")
    await service.saveListParents(parentsData)
    
    expect(service.saveListParents).toHaveBeenCalledTimes(1)
    expect(service.saveListParents).toHaveBeenCalledWith(parentsData)
  })

  it('Should call deleteCollection', async() => {
    jest.spyOn(service, 'deleteCollection')
    await service.deleteCollection()

    expect(service.deleteCollection).toHaveBeenCalledTimes(1) 
  })

  it('Should handle error in saveListParents', async () => {
    const error = new Error('Test error');
    jest.spyOn(service['parentsChildsModel'], 'insertMany').mockRejectedValueOnce(error);
    const createServiceErrorSpy = jest.spyOn(serviceErrorUc, 'createServiceError');

    await service.saveListParents(parentsData);

    expect(createServiceErrorSpy).toHaveBeenCalledTimes(1);
    expect(createServiceErrorSpy).toHaveBeenCalledWith(error, {
      name: expect.any(String),
      description: expect.any(String),
    });
  });

  it('Should call saveListParentsCollection', async () => {
    jest.spyOn(service, 'saveListParentsCollection')
    const mockData = [{ parentId: 1, name: 'Parent 1' }];
    await service.saveListParentsCollection(mockData);

    expect(service.saveListParentsCollection).toHaveBeenCalledTimes(1);
    expect(service.saveListParentsCollection).toHaveBeenCalledWith(mockData);
  });
})