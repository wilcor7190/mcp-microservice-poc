import { Test, TestingModule } from '@nestjs/testing';
import { TransformFeatureImplUC } from '../impl/transform-feature.uc.impl';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IFeatureProvider } from 'src/data-provider/provider/feature/transform-feature.provider';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IParamProvider } from 'src/data-provider/param.provider';
import { ICatalogUc } from '../../catalog/catalog.uc';
import { FamilyParams, TypeParams } from 'src/common/utils/enums/params.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { allTermsConditions, dataSkuExceptionTechnology, datoataOriginalTransformMethodTermianles, featureMapping } from 'src/mockup/stubs';

describe('ITransformFeatureUc', () => {

    let service: TransformFeatureImplUC;

    let mockIFeatureProvider: jest.Mocked<IFeatureProvider>;
    let mockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;
    let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;
    let mockParamProvider: jest.Mocked<IParamProvider>;
    let mockICatalogUc: jest.Mocked<ICatalogUc>;

    beforeEach(async () => {
        mockIFeatureProvider = {
            saveData: jest.fn(),
            getData: jest.fn(),
            deleteDataColPrtProductOffering: jest.fn()
        } as jest.Mocked<IFeatureProvider>;

        mockIServiceTracingUc = {
            createServiceTracing: jest.fn(),
        } as jest.Mocked<IServiceTracingUc>;

        mockIGetErrorTracingUc = {
            createTraceability: jest.fn(),
            getError: jest.fn(),
        } as jest.Mocked<IGetErrorTracingUc>;

        mockParamProvider = {
            getParamByIdParam: jest.fn().mockResolvedValue({ values: [] }),
            setLoadTime: jest.fn().mockResolvedValue({}),
            updateParam: jest.fn().mockResolvedValue({}),
            getTotal: jest.fn().mockResolvedValue({}),
            getParams: jest.fn().mockResolvedValue({}),
            getParamByIdParamPrices: jest.fn().mockResolvedValue({}),
            setLoadTimeExcp: jest.fn().mockResolvedValue({}),
            getFeaturesEnabled: jest.fn().mockResolvedValue({})
        } as jest.Mocked<IParamProvider>;

        mockICatalogUc = {
            deleteAttributes: jest.fn(),
            deleteExceptionSkus: jest.fn(),
            deleteDisponibilityFile: jest.fn(),
            getDataAttributes: jest.fn(),
            getDataSkuException: jest.fn(),
            saveAttributes: jest.fn(),
            saveDisponibilityFile: jest.fn(),
            saveExceptionSkus: jest.fn(),
            deleteTermsConditions: jest.fn(),
            saveTermsConditions: jest.fn(),
            getAllTermsConditions: jest.fn(),
        } as jest.Mocked<ICatalogUc>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransformFeatureImplUC,
                { provide: IFeatureProvider, useValue: mockIFeatureProvider },
                { provide: IServiceTracingUc, useValue: mockIServiceTracingUc },
                { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },
                { provide: IParamProvider, useValue: mockParamProvider },
                { provide: ICatalogUc, useValue: mockICatalogUc }

            ],
        }).compile();

        service = module.get<TransformFeatureImplUC>(TransformFeatureImplUC);
    });

    it('should create data for equipment', async () => {
        mockICatalogUc.getDataAttributes.mockResolvedValue(datoataOriginalTransformMethodTermianles);
        mockICatalogUc.getDataSkuException.mockResolvedValue([]);
        mockIFeatureProvider.deleteDataColPrtProductOffering.mockResolvedValue([]);
        mockParamProvider.getFeaturesEnabled.mockResolvedValue(featureMapping);
        mockIFeatureProvider.saveData.mockResolvedValue([]);
        mockICatalogUc.getAllTermsConditions.mockResolvedValue(allTermsConditions);

        await service.transformOriginalData(FamilyParams.equipment);
  
        expect(mockICatalogUc.getDataAttributes).toHaveBeenCalled();
        expect(mockICatalogUc.getDataSkuException).toHaveBeenCalled();
    });
    it('should create data for technology', async () => {
        mockICatalogUc.getDataAttributes.mockResolvedValue(datoataOriginalTransformMethodTermianles);
        mockICatalogUc.getDataSkuException.mockResolvedValue(dataSkuExceptionTechnology);
        mockIFeatureProvider.deleteDataColPrtProductOffering.mockResolvedValue([]);
        mockParamProvider.getFeaturesEnabled.mockResolvedValue(featureMapping);
        mockIFeatureProvider.saveData.mockResolvedValue([]);
        mockICatalogUc.getAllTermsConditions.mockResolvedValue(allTermsConditions);

        await service.transformOriginalData(FamilyParams.technology);
  
        expect(mockICatalogUc.getDataAttributes).toHaveBeenCalled();
        expect(mockICatalogUc.getDataSkuException).toHaveBeenCalled();
    });
    it('should throw error in get data Attributes', async () => {
        mockICatalogUc.getDataAttributes.mockRejectedValue(new Error())
    
        try {
            await service.transformOriginalData(FamilyParams.equipment);
        } catch(error) {
            expect(mockICatalogUc.getDataAttributes).toHaveBeenCalled();
            expect(mockICatalogUc.getDataSkuException).toHaveBeenCalled();
        }
    });
    it('should throw feature mapping null', async () => {
        mockICatalogUc.getDataAttributes.mockResolvedValue(datoataOriginalTransformMethodTermianles);
        mockICatalogUc.getDataSkuException.mockResolvedValue(dataSkuExceptionTechnology);
        mockIFeatureProvider.deleteDataColPrtProductOffering.mockResolvedValue([]);
        mockParamProvider.getFeaturesEnabled.mockResolvedValue(null);
        mockIFeatureProvider.saveData.mockResolvedValue([]);
        mockICatalogUc.getAllTermsConditions.mockResolvedValue(allTermsConditions);

        await service.transformOriginalData(FamilyParams.technology);
  
        expect(mockICatalogUc.getDataAttributes).toHaveBeenCalled();
        expect(mockICatalogUc.getDataSkuException).toHaveBeenCalled();
    });
});
