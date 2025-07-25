import DbConnection from 'src/common/utils/dbConnection';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { FileManagerProvider } from './file-manager.provider.impl';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessException } from 'src/common/lib/business-exceptions';

describe('FileManagerProvider', () => {
    let service: FileManagerProvider;
    let IGetErrorTracingUcMock: jest.Mocked<IGetErrorTracingUc>;


    beforeEach(async () => {


        IGetErrorTracingUcMock = {
            createTraceability: jest.fn(),
            getError: jest.fn(),
        } as jest.Mocked<IGetErrorTracingUc>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileManagerProvider,
                { provide: IGetErrorTracingUc, useValue: IGetErrorTracingUcMock },
            ],

        }).compile();

        service = module.get<FileManagerProvider>(FileManagerProvider);

    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return JSON object when CSV file is valid', async () => {
        jest.spyOn(service, 'getDataCsvHeader')
        const mockJsonData = [{ "Equipo": "70010932" }];
        const result = await service.getDataCsvHeader('src/mockup/getcsv.csv', ',');
        expect(result).toEqual(mockJsonData);
        expect(service.getDataCsvHeader).toHaveBeenCalledTimes(1)
    });
    it('deleteFile', async () => {
        jest.spyOn(service, 'deleteFile')
        const resul = await service.deleteFile('src/mockup/get.csv');
        expect(resul).toBe('FileDeleted')
        expect(service.deleteFile).toHaveBeenCalledTimes(1)
    });

    it('getDataCsv', async () => {
        jest.spyOn(service, 'getDataCsv')
        const headers = []
        const mockJsonData = [{ "Equipo": "70010932" }];
        const resul = await service.getDataCsv('src/mockup/getcsv.csv', headers, ' ');
        expect(resul).toStrictEqual(mockJsonData)
        expect(service.getDataCsv).toHaveBeenCalledTimes(1)
    });
    it('should thorw error getDataCsv', async () => {
        jest.spyOn(service, 'getDataCsv')
        service
        const headers = []
        try {
            await service.getDataCsv('', headers, ' ')
        } catch(error) {
            expect(error).toBeInstanceOf(BusinessException)
        }
    });

    it('saveDataTemporalCollection', async () => {
        const mockDbConnection = {
            db: {
                collection: jest.fn().mockReturnThis(),
                insertMany: jest.fn().mockResolvedValue(true),
            },
            client: {
                close: jest.fn(),
            },
        };

        // Simula el método dbConnection() en el servicio
        jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

        const nameCollection = 'testCollection';
        const content = {} as any;

        await service.saveDataTemporalCollection(nameCollection, content)

        expect(mockDbConnection.db.collection).toHaveBeenCalledWith('testCollection');
        expect(mockDbConnection.client.close).toHaveBeenCalled();
    });
    it('should throw error saveDataTemporalCollection', async () => {
        const mockDbConnection = {
            db: {
                collection: jest.fn().mockReturnThis(),
                insertMany: jest.fn().mockRejectedValue(new Error('')),
            },
            client: {
                close: jest.fn(),
            },
        };

        // Simula el método dbConnection() en el servicio
        jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

        const nameCollection = 'testCollection';
        const content = {} as any;
        try {
            await service.saveDataTemporalCollection(nameCollection, content)
        } catch(error) {
            expect(mockDbConnection.client.close).toHaveBeenCalled();
            expect(IGetErrorTracingUcMock.createTraceability).toHaveBeenCalled
        }
    });
    it('saveDataTemporalCollectionHomes', async () => {
        const mockDbConnection = {
            db: {
                collection: jest.fn().mockReturnThis(),
                insertMany: jest.fn().mockResolvedValue(true),
            },
            client: {
                close: jest.fn(),
            },
        };

        // Simula el método dbConnection() en el servicio
        jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

        const nameCollection = 'testCollection';
        const content = {} as any;

        await service.saveDataTemporalCollectionHomes(nameCollection, content)

        expect(mockDbConnection.db.collection).toHaveBeenCalledWith('testCollection');
        expect(mockDbConnection.client.close).toHaveBeenCalled();
    });
    it('should throw error saveDataTemporalCollectionHomes', async () => {
        const mockDbConnection = {
            db: {
                collection: jest.fn().mockReturnThis(),
                insertMany: jest.fn().mockRejectedValue(new Error('')),
            },
            client: {
                close: jest.fn(),
            },
        };

        // Simula el método dbConnection() en el servicio
        jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

        const nameCollection = 'testCollection';
        const content = {} as any;

        try {
            await service.saveDataTemporalCollectionHomes(nameCollection, content)
        } catch(error) {
            expect(IGetErrorTracingUcMock.createTraceability).toHaveBeenCalled
            expect(mockDbConnection.client.close).toHaveBeenCalled();
        }

    });

    it('processExecutionTime', () => {
        // Arrange
        const startTime = [0, 0];

        // Act
        const result = service.processExecutionTime(startTime);

        // Assert
        expect(result).toHaveReturned;
    });



});