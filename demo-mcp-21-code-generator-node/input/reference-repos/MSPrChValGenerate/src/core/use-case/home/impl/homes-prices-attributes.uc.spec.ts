import { Test, TestingModule } from '@nestjs/testing';
import { HomesPricesAttributesUc } from '../impl/orch-homes-prices-attributes.uc.impl';
import { NameCollectionDataBase, ValuesParams } from 'src/common/utils/enums/params.enum';
import { EFilterPrices, EhomesAttributesPrices, EHomesCharacteristics } from 'src/common/utils/enums/homesAttributesPrices.enum';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IHomePricesAttributesProvider } from 'src/data-provider/provider/home/homesPricesAttributes.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { version } from 'os';
import { versions } from 'process';

describe('HomesPricesAttributesUc', () => {
    let service: HomesPricesAttributesUc;

    let mockISftpManagerProvider: jest.Mocked<ISftpManagerProvider>;
    let mockIFileManagerProvider: jest.Mocked<IFileManagerProvider>;
    let mockIParamProvider: jest.Mocked<IParamProvider>;
    let mockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;
    let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;
    let mockIHomePricesAttributesProvider: jest.Mocked<IHomePricesAttributesProvider>;

    beforeEach(async () => {
        mockISftpManagerProvider = {
            downloadMovHom: jest.fn(),
            download: jest.fn(),
            writeFile: jest.fn()
        } as jest.Mocked<ISftpManagerProvider>;

        mockIFileManagerProvider = {
            deleteFile: jest.fn(),
            getDataCsv: jest.fn(),
            getDataCsvHeader: jest.fn(),
            readFile: jest.fn(),
            readLineFile: jest.fn(),
            saveDataTemporalCollection: jest.fn(),
            saveDataTemporalCollectionDisponibility: jest.fn(),
            saveDataTemporalCollectionHomes: jest.fn(),
            saveFile: jest.fn(),
            transformFile: jest.fn(),
        } as jest.Mocked<IFileManagerProvider>;

        mockIParamProvider = {
            getParamByIdParam: jest.fn(),
            getParamByIdParamPrices: jest.fn(),
            getParams: jest.fn(),
            getTotal: jest.fn(),
            setLoadTime: jest.fn(),
            updateParam: jest.fn(),
            setLoadTimeExcp:jest.fn(),
            getFeaturesEnabled: jest.fn(),
        } as jest.Mocked<IParamProvider>;

        mockIServiceTracingUc = {
            createServiceTracing: jest.fn(),
        } as jest.Mocked<IServiceTracingUc>;

        mockIServiceErrorUc = {
            createServiceError: jest.fn(),
            getServiceErrors: jest.fn(),
        } as jest.Mocked<IServiceErrorUc>;

        mockIHomePricesAttributesProvider = {
            deleteDataBaseHomeAttributes: jest.fn(),
            deleteDataBaseHomePrices: jest.fn(),
            deleteDataHomeAttributes: jest.fn(),
            deleteDataHomePrices: jest.fn(),
            getDataMongoCollection: jest.fn(),
            getDataMongoCollectionAggregate: jest.fn(),
            saveDataHomePricesAttributes: jest.fn(),
        } as jest.Mocked<IHomePricesAttributesProvider>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HomesPricesAttributesUc,
                { provide: ISftpManagerProvider, useValue: mockISftpManagerProvider },
                { provide: IFileManagerProvider, useValue: mockIFileManagerProvider },
                { provide: IParamProvider, useValue: mockIParamProvider },
                { provide: IServiceTracingUc, useValue: mockIServiceTracingUc },
                { provide: IServiceErrorUc, useValue: mockIServiceErrorUc },
                { provide: IHomePricesAttributesProvider, useValue: mockIHomePricesAttributesProvider }
            ],
        }).compile();

        service = module.get<HomesPricesAttributesUc>(HomesPricesAttributesUc);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call getHomeAttributes', async () => {
        const spy = jest.spyOn(service, 'getHomeAttributes');
        await service.getOrchHomes();
        expect(spy).toHaveBeenCalled();
    });

    it('should call getHomePrices', async () => {
        const spy = jest.spyOn(service, 'getHomePrices');
        await service.getOrchHomes();
        expect(spy).toHaveBeenCalled();
    });
});
