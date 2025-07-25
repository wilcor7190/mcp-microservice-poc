import { Test, TestingModule } from '@nestjs/testing';
import { CollectionMongoDBProvider } from './collectionMongoDB.provider.impl'; 
const mongoose = require('mongoose'); 
import databaseConfig from "src/common/configuration/database.config";

jest.mock('mongoose');

describe('CollectionMongoDBProvider', () => {
  let service: CollectionMongoDBProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionMongoDBProvider],
    }).compile();

    service = module.get<CollectionMongoDBProvider>(CollectionMongoDBProvider);
  });

  it('getDataMongoCollectionAggregate', async () => {
    const aggregateMock = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue(['mockData']),
    });

    const collectionMock = {
      aggregate: aggregateMock,
    };

    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    (mongoose.connection as any) = { db: dbMock, close: jest.fn() };

    const collectionName = 'testCollection';
    const aggregatePipeline = [{ $match: { test: 'test' } }];

    const result = await service.getDataMongoCollectionAggregate(collectionName, aggregatePipeline);

    expect(mongoose.connect).toHaveBeenCalledWith(databaseConfig.databaseCatalog, { useNewUrlParser: true });
    expect(mongoose.connection.db.collection).toHaveBeenCalledWith(collectionName);
    expect(aggregateMock).toHaveBeenCalledWith(aggregatePipeline);
    expect(result).toEqual(['mockData']);
    expect(mongoose.connection.close).toHaveBeenCalled();
  });

  it('getDataMongoCollection', async () => {
    const findMock = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue(['mockData']),
    });

    const collectionMock = {
      find: findMock,
    };

    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    (mongoose.connection as any) = { db: dbMock, close: jest.fn() };

    const collectionName = 'testCollection';
    const filter ='value' ;

    const result = await service.getDataMongoCollection(collectionName, filter);

    expect(mongoose.connect).toHaveBeenCalledWith(databaseConfig.databaseCatalog, { useNewUrlParser: true });
    expect(mongoose.connection.db.collection).toHaveBeenCalledWith(collectionName);
    expect(findMock).toHaveBeenCalledWith(filter);
    expect(result).toEqual(['mockData']);
    expect(mongoose.connection.close).toHaveBeenCalled();
  });

  it('getDataMongoCollectionPruebas', async () => {
    const findMock = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue(['mockData']),
    });

    const collectionMock = {
      find: findMock,
    };

    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    (mongoose.connection as any) = { db: dbMock, close: jest.fn() };

    const collectionName = 'testCollection';
    const filter ='value' ;

    const result = await service.getDataMongoCollectionPruebas(collectionName);

    expect(mongoose.connect).toHaveBeenCalledWith(databaseConfig.databaseCatalog, { useNewUrlParser: true });
    expect(mongoose.connection.db.collection).toHaveBeenCalledWith(collectionName);
    expect(result).toEqual(['mockData']);
    expect(mongoose.connection.close).toHaveBeenCalled();
  });
});
