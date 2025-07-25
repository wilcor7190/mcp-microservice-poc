import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from '../../common/common.module';
import { DataProviderModule } from '../data-provider.module';
import { CoreModule } from '../../core/core.module';
import { ControllerModule } from '../../controller/controller.module';
import { getModelToken } from '@nestjs/mongoose';
import { CategoriesProviderImpl } from './categories.provider.impl';
import { EquipmentModel } from '../model/categories/equipment.model';
import { TechnologyModel } from '../model/categories/technology.model';
import { PospagoModel } from '../model/categories/pospago.model';
import { PrepagoModel } from '../model/categories/prepago.model';
import { HomeModel } from '../model/categories/home.model';
import { ContingencyModel } from '../model/contingency.model';
import {
  contingencyDummyFeatures,
  mockData,
} from '../../../test/response-dummy';
import databaseConfig from '../../common/configuration/database.config';
import { IServiceErrorUc } from '../../core/use-case/resource/service-error.resource.uc';
import { Aggregate, Model } from 'mongoose';
import { ParamModel } from '@claro/generic-models-library';

describe('TestService CategoriesProviderImpl', () => {
  let service: CategoriesProviderImpl;
  let serviceErrorUc: IServiceErrorUc;
  let equipmentModel: jest.Mocked<Model<EquipmentModel>>
  let technologyModel: jest.Mocked<Model<TechnologyModel>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesProviderImpl,
        {
          provide: IServiceErrorUc,
          useValue: {
            createServiceError: jest.fn(),
          },
        },
        {
          provide: getModelToken(EquipmentModel.name, databaseConfig.dbFeatures),
          useValue: { 
            insertMany: jest.fn(), 
            deleteMany: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(TechnologyModel.name, databaseConfig.dbFeatures),
          useValue: { 
            insertMany: jest.fn(), 
            deleteMany: jest.fn(),
            find: jest.fn()
          },
        },
        {
          provide: getModelToken(PospagoModel.name, databaseConfig.dbFeatures),
          useValue: { insertMany: jest.fn(), deleteMany: jest.fn() },
        },
        {
          provide: getModelToken(PrepagoModel.name, databaseConfig.dbFeatures),
          useValue: { insertMany: jest.fn(), deleteMany: jest.fn() },
        },
        {
          provide: getModelToken(HomeModel.name, databaseConfig.dbFeatures),
          useValue: { insertMany: jest.fn(), deleteMany: jest.fn() },
        },
        {
          provide: getModelToken(
            ContingencyModel.name,
            databaseConfig.dbContingency,
          ),
          useValue: {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(contingencyDummyFeatures),
          },
        }
      ],
    }).compile();

    service = module.get<CategoriesProviderImpl>(CategoriesProviderImpl);
    equipmentModel = module.get(getModelToken(EquipmentModel.name, databaseConfig.dbFeatures))
    technologyModel = module.get(getModelToken(TechnologyModel.name, databaseConfig.dbFeatures))
  });

  it('Should call updateFeatures (Terminales)', async () => {
    jest.spyOn(service, 'updateFeatures');
    await service.updateFeatures(mockData, 'Terminales');

    expect(service.updateFeatures).toHaveBeenCalledTimes(1);
    expect(service.updateFeatures).toHaveBeenCalledWith(mockData, 'Terminales');
  });

  it('Should call updateFeatures (Tecnologia)', async () => {
    jest.spyOn(service, 'updateFeatures');
    await service.updateFeatures(mockData, 'Tecnologia');

    expect(service.updateFeatures).toHaveBeenCalledTimes(1);
    expect(service.updateFeatures).toHaveBeenCalledWith(mockData, 'Tecnologia');
  });

  it('Should call updateFeatures (Prepago)', async () => {
    jest.spyOn(service, 'updateFeatures');
    await service.updateFeatures(mockData, 'Prepago');

    expect(service.updateFeatures).toHaveBeenCalledTimes(1);
    expect(service.updateFeatures).toHaveBeenCalledWith(mockData, 'Prepago');
  });

  it('Should call updateFeatures (Pospago)', async () => {
    jest.spyOn(service, 'updateFeatures');
    await service.updateFeatures(mockData, 'Pospago');

    expect(service.updateFeatures).toHaveBeenCalledTimes(1);
    expect(service.updateFeatures).toHaveBeenCalledWith(mockData, 'Pospago');
  });

  it('Should call updateFeatures (Hogares)', async () => {
    jest.spyOn(service, 'updateFeatures');
    await service.updateFeatures(mockData, 'Hogares');

    expect(service.updateFeatures).toHaveBeenCalledTimes(1);
    expect(service.updateFeatures).toHaveBeenCalledWith(mockData, 'Hogares');
  });

  it('Should call deleteCollections (Terminales)', async () => {
    jest.spyOn(service, 'deleteCollections');
    await service.deleteCollections('Terminales');

    expect(service.deleteCollections).toHaveBeenCalledTimes(1);
    expect(service.deleteCollections).toHaveBeenCalledWith('Terminales');
  });

  it('Should call deleteCollections (Tecnologia)', async () => {
    jest.spyOn(service, 'deleteCollections');
    await service.deleteCollections('Tecnologia');

    expect(service.deleteCollections).toHaveBeenCalledTimes(1);
    expect(service.deleteCollections).toHaveBeenCalledWith('Tecnologia');
  });

  it('Should call deleteCollections (Prepago)', async () => {
    jest.spyOn(service, 'deleteCollections');
    await service.deleteCollections('Prepago');

    expect(service.deleteCollections).toHaveBeenCalledTimes(1);
    expect(service.deleteCollections).toHaveBeenCalledWith('Prepago');
  });

  it('Should call deleteCollections (Pospago)', async () => {
    jest.spyOn(service, 'deleteCollections');
    await service.deleteCollections('Pospago');

    expect(service.deleteCollections).toHaveBeenCalledTimes(1);
    expect(service.deleteCollections).toHaveBeenCalledWith('Pospago');
  });

  it('Should call deleteCollections (Hogares)', async () => {
    jest.spyOn(service, 'deleteCollections');
    await service.deleteCollections('Hogares');

    expect(service.deleteCollections).toHaveBeenCalledTimes(1);
    expect(service.deleteCollections).toHaveBeenCalledWith('Hogares');
  });

  it('Should call getContingency', async () => {
    const resp = await service.getContingency({
      family: 'Terminales',
      type: 'characteristics',
    });

    expect(resp).toBeDefined();
    expect(resp).toMatchObject({ ...contingencyDummyFeatures });
  });

  it('Should find collections - Terminales', async () => {
    equipmentModel.find = jest.fn().mockResolvedValue(mockData)
    const result = await service.findCollections('Terminales');

    expect(result).toMatchObject(mockData);
  })

  it('Should find collections - Tecnología', async () => {
    technologyModel.find = jest.fn().mockResolvedValue(mockData)
    const result = await service.findCollections('Tecnologia');

    expect(result).toMatchObject(mockData);
  })
});
