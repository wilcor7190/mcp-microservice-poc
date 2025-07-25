import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ServiceErrorProvider } from './service-error.provider.impl';
import databaseConfig from '../../common/configuration/database.config';
import { ServiceErrorModel } from '@claro/generic-models-library';

describe('ServiceErrorProvider', () => {
  let service: ServiceErrorProvider;
  let model: Model<ServiceErrorModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceErrorProvider,
        {
          provide: getModelToken(ServiceErrorModel.name, databaseConfig.database),
          useValue: {
            find: jest.fn().mockReturnThis(),
            countDocuments: jest.fn(),
            findOne: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceErrorProvider>(ServiceErrorProvider);
    model = module.get<Model<ServiceErrorModel>>(
      getModelToken(ServiceErrorModel.name, databaseConfig.database),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('createServiceError', () => {
    it('should create a new service error', async () => {
      const serviceError = {  serviceid: '123456', origen: 'ERR001', message: 'Error 1', success: true, documents: { error: "" }, stack: 'stack' };
    
      jest.spyOn(model, 'insertMany').mockImplementation(async () => undefined);


      await service.createServiceError(serviceError);

      expect(model.insertMany).toHaveBeenCalledWith(serviceError);
    });
  });
});
