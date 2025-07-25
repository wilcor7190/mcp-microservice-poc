import { Test, TestingModule } from '@nestjs/testing';
import { IGetDataFeaturesUc } from '../get-data-features.uc';
import { FeaturesUC } from '../impl/orch-feature.uc.impl';
import { ITransformFeatureUc } from '../transform-feature.uc.';
import { FamilyParams } from "src/common/utils/enums/params.enum";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';

describe('GetDataFeaturesUc', () => {

    let service: FeaturesUC;

    let mockIGetDataFeaturesUc: jest.Mocked<IGetDataFeaturesUc>;
    let mockITransformFeatureUc: jest.Mocked<ITransformFeatureUc>;
    let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;

    beforeEach(async () => {
        mockIGetDataFeaturesUc = {
            getSftpFiles: jest.fn(),
        } as jest.Mocked<IGetDataFeaturesUc>;

        mockITransformFeatureUc = {
            getOriginalData: jest.fn(),
            transformOriginalData: jest.fn()
        } as jest.Mocked<ITransformFeatureUc>;

        mockIGetErrorTracingUc = {
            createTraceability: jest.fn(),
            getError: jest.fn(),
        } as jest.Mocked<IGetErrorTracingUc>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeaturesUC,
                { provide: IGetDataFeaturesUc, useValue: mockIGetDataFeaturesUc },
                { provide: ITransformFeatureUc, useValue: mockITransformFeatureUc },
                { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
        
            ],
        }).compile();

        service = module.get<FeaturesUC>(FeaturesUC);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call getOrch', async () => {
        jest.spyOn(service, 'getOrch')
        await service.getOrch()
        await mockIGetDataFeaturesUc.getSftpFiles();
        await mockIGetErrorTracingUc.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS, 
            EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
        await mockITransformFeatureUc.transformOriginalData(FamilyParams.equipment);
        await mockITransformFeatureUc.transformOriginalData(FamilyParams.technology);


        expect(mockIGetDataFeaturesUc.getSftpFiles).toHaveBeenCalled();
        expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
        expect(mockITransformFeatureUc.transformOriginalData).toHaveBeenCalled();
        expect(service.getOrch).toHaveBeenCalledTimes(1)
    });

    it('should call getOrch', async () => {
        jest.spyOn(service, 'getOrch')
        mockIGetDataFeaturesUc.getSftpFiles.mockRejectedValue(new Error());
        await service.getOrch();
        expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
    });

});