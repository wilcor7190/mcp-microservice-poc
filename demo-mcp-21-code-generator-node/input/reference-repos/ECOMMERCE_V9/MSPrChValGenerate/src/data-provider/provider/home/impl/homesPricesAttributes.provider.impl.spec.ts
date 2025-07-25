import { HomePricesAttributesProvider } from "./homesPricesAttributes.provider.impl";
import { GeneralModel } from "src/data-provider/model/general/general.model";
import { Model } from 'mongoose';
import DbConnection from "src/common/utils/dbConnection";
import { CollectionsNames } from "src/common/utils/enums/collectionsNames.enum";
let mongoose = require('mongoose');
import databaseConfig from "src/common/configuration/database.config";
jest.mock('mongoose');


jest.setTimeout(35000);

describe('DisponibilityProviderImpl', () => {
    let service: HomePricesAttributesProvider;
    let mockGeneralModel: Model<GeneralModel>;

    beforeEach(async () => {

        mockGeneralModel = {} as Model<GeneralModel>;
        service = new HomePricesAttributesProvider(mockGeneralModel);

    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('deleteDataHomeAttributes', async () => {
        jest.spyOn(service, "deleteDataHomeAttributes")
        const collectionMock = {
            deleteMany: jest.fn().mockResolvedValue({}),
        };
        const dbConnectionMock = {
            collection: jest.fn().mockReturnValue(collectionMock),
        };

        const dbConnectionHomesMock = jest.spyOn(DbConnection, 'dbConnectionHomes').mockResolvedValue(dbConnectionMock);

        await service.deleteDataHomeAttributes();

        expect(dbConnectionHomesMock).toHaveBeenCalled();
        expect(dbConnectionMock.collection).toHaveBeenCalledWith(CollectionsNames.HOGARESATTRIBUTES);
        expect(collectionMock.deleteMany).toHaveBeenCalledWith({});
        expect(service.deleteDataHomeAttributes).toHaveBeenCalledTimes(1)
        dbConnectionHomesMock.mockRestore();
    });

    it('deleteDataHomePrices', async () => {
        jest.spyOn(service, "deleteDataHomePrices")
        const collectionMock = {
            deleteMany: jest.fn().mockResolvedValue({}),
        };
        const dbConnectionMock = {
            collection: jest.fn().mockReturnValue(collectionMock),
        };

        const dbConnectionHomesMock = jest.spyOn(DbConnection, 'dbConnectionHomes').mockResolvedValue(dbConnectionMock);

        await service.deleteDataHomePrices();

        expect(dbConnectionHomesMock).toHaveBeenCalled();
        expect(dbConnectionMock.collection).toHaveBeenCalledWith(CollectionsNames.HOGARESPRICES);
        expect(collectionMock.deleteMany).toHaveBeenCalledWith({});
        expect(service.deleteDataHomePrices).toHaveBeenCalledTimes(1)
        dbConnectionHomesMock.mockRestore();
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
    
        const result = await service.getDataMongoCollection(collectionName);
    
        expect(mongoose.connect).toHaveBeenCalledWith(databaseConfig.databaseCatalog, { useNewUrlParser: true });
        expect(mongoose.connection.db.collection).toHaveBeenCalledWith(collectionName);
        expect(findMock).toHaveBeenCalledWith({});

        expect(result).toEqual(['mockData']);
    
        expect(mongoose.connection.close).toHaveBeenCalled();
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

    it('saveDataHomePricesAttributes', async () => {
        const content = {} as any;
        const insertManyResult = {} as any;

        jest.spyOn(service, 'saveDataHomePricesAttributes')
        mockGeneralModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);
        await service.saveDataHomePricesAttributes(content);

        expect(mockGeneralModel.insertMany).toHaveBeenCalledWith(content);
        expect(service.saveDataHomePricesAttributes).toHaveBeenCalledTimes(1);

    });

    it('deleteDataBaseHomeAttributes', async () => {
        const content = {} as any;
        const insertManyResult = {} as any;
        const params = {
            family: '',
            type: ''
        }

        jest.spyOn(service, 'deleteDataBaseHomeAttributes')
        mockGeneralModel.deleteMany = jest.fn().mockResolvedValue(insertManyResult);
        await service.deleteDataBaseHomeAttributes(params);

        expect(mockGeneralModel.deleteMany).toHaveBeenCalled();
        expect(service.deleteDataBaseHomeAttributes).toHaveBeenCalledTimes(1);

    });

    it('deleteDataBaseHomePrices', async () => {
        const content = {} as any;
        const insertManyResult = {} as any;
        const params = {
            family: '',
            type: ''
        }

        jest.spyOn(service, 'deleteDataBaseHomePrices')
        mockGeneralModel.deleteMany = jest.fn().mockResolvedValue(insertManyResult);
        await service.deleteDataBaseHomePrices(params);

        expect(mockGeneralModel.deleteMany).toHaveBeenCalled();
        expect(service.deleteDataBaseHomePrices).toHaveBeenCalledTimes(1);

    });

    it('processExecutionTime', () => {
        // Arrange
        const startTime = [0, 0];

        // Act
        const result = service.processExecutionTime(startTime);

        // Assert
        expect(result).toHaveReturned;
    });

})