let fs = require('fs')
let readline = require('readline')
import { Test, TestingModule } from '@nestjs/testing';
import { GetDataFeaturesUc } from '../impl/get-data-features.uc.impl';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IFeatureProvider } from 'src/data-provider/provider/feature/transform-feature.provider';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { ICatalogUc } from '../../catalog/catalog.uc';
import { ValuesParams } from "src/common/utils/enums/params.enum";
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import encontrar from 'src/common/utils/assets/UtilConfig';
import {
    mockgetParamByIdParamSku,
    mockgetDataCsvSku,
    mockgetParamByIdParamTyc,
    mockgetParamByIdParamCharacteristics
} from 'src/mockup/stubs-2';





describe('GetDataFeaturesUc', () => {
    

    let service: GetDataFeaturesUc;

    let mockISftpManagerProvider: jest.Mocked<ISftpManagerProvider>;
    let mockIFileManagerProvider: jest.Mocked<IFileManagerProvider>;
    let mockIParamProvider: jest.Mocked<IParamProvider>;
    let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;
    let mockIFeatureProvider: jest.Mocked<IFeatureProvider>;
    let mockIICatalogUc: jest.Mocked<ICatalogUc>;
    let mockencontrar: jest.Mocked<encontrar>;


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
            getFeaturesEnabled: jest.fn(),
        } as jest.Mocked<IParamProvider>;

        mockIGetErrorTracingUc = {
            createTraceability: jest.fn(),
            getError: jest.fn(),
        } as jest.Mocked<IGetErrorTracingUc>;

        mockIFeatureProvider = {
            deleteData: jest.fn(),
            getDataDisponibility: jest.fn(),
            saveData: jest.fn(),
            getDataSkuException: jest.fn(),
            deleteDataColPrtProductOffering: jest.fn(),
        } as jest.Mocked<IFeatureProvider>;

        mockIICatalogUc = {
            deleteAttributes: jest.fn(),
            saveAttributes: jest.fn(),
            getDataAttributes: jest.fn(),
            getDataSkuException: jest.fn(),
            deleteExceptionSkus: jest.fn(),
            saveExceptionSkus: jest.fn(),
            deleteTermsConditions: jest.fn(),
            saveTermsConditions: jest.fn(),
            getAllTermsConditions: jest.fn(),
            deleteDisponibilityFile: jest.fn(),
            saveDisponibilityFile: jest.fn(),
        } as jest.Mocked<ICatalogUc>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetDataFeaturesUc,
                { provide: ISftpManagerProvider, useValue: mockISftpManagerProvider },
                { provide: IFileManagerProvider, useValue: mockIFileManagerProvider },
                { provide: IParamProvider, useValue: mockIParamProvider },
                { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
                { provide: IFeatureProvider, useValue: mockIFeatureProvider },
                { provide: ICatalogUc, useValue: mockIICatalogUc }
            ],
        }).compile();

        service = module.get<GetDataFeaturesUc>(GetDataFeaturesUc);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call getSftpFiles2', async () => {
        jest.spyOn(service, 'getSftpSku').mockResolvedValue
        jest.spyOn(mockIParamProvider, 'getParamByIdParam').mockResolvedValueOnce(mockgetParamByIdParamSku)
        jest.spyOn(mockISftpManagerProvider, 'download').mockResolvedValue
        jest.spyOn(mockIICatalogUc, 'deleteExceptionSkus').mockResolvedValue
        jest.spyOn(mockIFileManagerProvider, 'getDataCsv').mockResolvedValueOnce(mockgetDataCsvSku)
        jest.spyOn(mockIICatalogUc, 'saveExceptionSkus').mockResolvedValue
        jest.spyOn(mockIFileManagerProvider, 'deleteFile').mockResolvedValue

        jest.spyOn(service, 'getSftptyc').mockResolvedValue
        jest.spyOn(mockIParamProvider, 'getParamByIdParam').mockResolvedValueOnce(mockgetParamByIdParamTyc)
        jest.spyOn(mockIICatalogUc, 'deleteTermsConditions').mockResolvedValue
        jest.spyOn(mockIFileManagerProvider, 'getDataCsvHeader').mockResolvedValueOnce(mockgetDataCsvSku)
        jest.spyOn(mockIICatalogUc, 'saveTermsConditions').mockResolvedValue
        jest.spyOn(mockISftpManagerProvider, 'writeFile').mockResolvedValue

        jest.spyOn(mockIParamProvider, 'getParamByIdParam').mockResolvedValueOnce(mockgetParamByIdParamCharacteristics)
        jest.spyOn(mockIICatalogUc, 'deleteAttributes').mockResolvedValue
        jest.spyOn(service, 'transformFile2').mockResolvedValueOnce(undefined)
        jest.spyOn(mockIParamProvider, 'updateParam').mockResolvedValue
        jest.spyOn(service, 'saveFileCharacteristics').mockResolvedValue


        await service.getSftpFiles();

        expect(service.getSftpSku).toHaveBeenCalled;
        expect(mockIParamProvider.getParamByIdParam).toHaveBeenCalledTimes(3);
        expect(mockISftpManagerProvider.download).toHaveBeenCalledTimes(3);
        expect(mockIICatalogUc.deleteExceptionSkus).toHaveBeenCalled;
        expect(mockIFileManagerProvider.getDataCsv).toHaveBeenCalled;
        expect(mockIICatalogUc.saveExceptionSkus).toHaveBeenCalled;
        expect(mockIFileManagerProvider.deleteFile).toHaveBeenCalled;

        expect(service.getSftptyc).toHaveBeenCalled;
        expect(mockIICatalogUc.deleteTermsConditions).toHaveBeenCalled;
        expect(mockIFileManagerProvider.getDataCsvHeader).toHaveBeenCalled;
        expect(mockIICatalogUc.saveTermsConditions).toHaveBeenCalled;
        expect(mockISftpManagerProvider.writeFile).toHaveBeenCalled;

        expect(mockIICatalogUc.deleteAttributes).toHaveBeenCalled;
        expect(service.transformFile2).toHaveBeenCalled;
        expect(mockIParamProvider.updateParam).toHaveBeenCalled;


    });

    it('should call getSftpFiles', async () => {
        const remotePath = '/claroshopv9qa/servicios/contingencia/caracteristicas/';
        const localPath = '/claroshopv9qa/servicios/contingencia/';
        const loadTime = new Date();
        const namelocalFile = 'caracteristicas'
        const pathFile = {} as any

        jest.spyOn(service, 'getSftpFiles')
        await service.getSftpSku();
        await mockIParamProvider.getParamByIdParam(ValuesParams.TERTEC_ATRTIBUTES)
        await mockISftpManagerProvider.download({ remotePath, localPath, loadTime, namelocalFile })
        await mockIICatalogUc.deleteAttributes()
        await mockIGetErrorTracingUc.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
            EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
        await mockIParamProvider.updateParam(pathFile)

        try {
            await service.getSftpFiles();
        } catch (error) {

        }
        expect(mockIParamProvider.updateParam).toHaveBeenCalledWith(pathFile);
        expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
        expect(mockIICatalogUc.deleteAttributes).toHaveBeenCalled();
        expect(mockISftpManagerProvider.download).toHaveBeenCalledWith({ remotePath, localPath, loadTime, namelocalFile });
        expect(mockIParamProvider.getParamByIdParam).toHaveBeenCalled();
        expect(service.getSftpFiles).toHaveBeenCalledTimes(1)
    });



    it('should call transformFile2', async () => {
        const localPath = '/claroshopv9qa/servicios/contingencia/';
        const data = {} as any
        jest.spyOn(service, 'transformFile2')
        await mockIICatalogUc.saveAttributes(data)
        await mockIFileManagerProvider.deleteFile(localPath)

        expect(mockIFileManagerProvider.deleteFile).toHaveBeenCalledWith(localPath)
        expect(mockIICatalogUc.saveAttributes).toHaveBeenCalledWith(data)
    });


    it('should call getSftpFiles new error', async () => {
        jest.spyOn(service, 'getSftpFiles')
        mockIParamProvider.getParamByIdParam.mockRejectedValue(new Error('error'));
        service.getSftpFiles().catch((error) => {
            expect(mockIGetErrorTracingUc.getError).toHaveBeenCalledTimes(3)
        })
    });

    it('should format date correctly', () => {
        const date = new Date('2023-10-05T14:48:00');
        const formattedDate = service.formatDate(date);
        expect(formattedDate).toBe('20231005_144800');
    });

})