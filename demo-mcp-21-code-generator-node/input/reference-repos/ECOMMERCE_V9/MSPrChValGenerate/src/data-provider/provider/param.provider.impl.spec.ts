import { ParamModel ,IParam } from '@claro/generic-models-library';
import { ParamProvider } from './param.provider.impl';
import { Model } from 'mongoose';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';

describe('ParamProvider', () => {

    let service: ParamProvider;
    let mockParamModel: Model<ParamModel>;
    let IServiceTracingUcMock: jest.Mocked<IServiceTracingUc>;
    let IServiceErrorUcMock: jest.Mocked<IServiceErrorUc>;

    beforeEach(async () => {
        IServiceTracingUcMock = {
            createServiceTracing: jest.fn(),
        } as jest.Mocked<IServiceTracingUc>;

        IServiceErrorUcMock = {
            createServiceError: jest.fn(),
        } as jest.Mocked<IServiceErrorUc>;

        mockParamModel = {} as Model<ParamModel>;
        service = new ParamProvider(mockParamModel, IServiceTracingUcMock, IServiceErrorUcMock);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getParamByIdParam', async () => {
        const content = {} as any;
        jest.spyOn(service, 'getParamByIdParam')

        IServiceTracingUcMock.createServiceTracing.mockResolvedValue(content)
        const result = await service.getParamByIdParam(content);

        expect(result).toBe(undefined);
        expect(IServiceTracingUcMock.createServiceTracing).toHaveBeenCalled();
        expect(service.getParamByIdParam).toHaveBeenCalled();
    });

    it('getTotal', async () => {
        const content = {} as any;
        const countDocumentsResult = {} as any;
        mockParamModel.countDocuments = jest.fn().mockResolvedValue(countDocumentsResult);

        const result = await service.getTotal(content);
        expect(result).toBe(countDocumentsResult);
        expect(mockParamModel.countDocuments).toHaveBeenCalledWith(content);
    });

    it('getParams', async () => {
        const page = 1;
        const limit = 10;
        const filter = {  };
        const projection = {  };
        const expectedParams: IParam[] = [
            {
                id_param: 'id_paramvalue',
                description: 'descriptionvalue',
                status: true,
                createdUser: 'createdUservalue',
                updatedUser: 'updatedUservalue',
                createdAt: 'createdAtvalue',
                updatedAt: 'updatedAtvalue',
                values: 'valuesvalue'
            },
        ];


        const paramModel = jest.fn().mockImplementation(() => ({
            find: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(expectedParams),
            }),
        }))();
        const paramProvider = new ParamProvider(paramModel, IServiceTracingUcMock, IServiceErrorUcMock);
        const params = await paramProvider.getParams(page, limit, filter, projection);

        expect(params).toEqual(expectedParams);
        expect(paramModel.find).toHaveBeenCalledWith(filter, projection);
    });

    it('findParams', async () => {
        const content = {} as any;
        const findOneResult = 10;
        const paramModel = jest.fn().mockImplementation(() => ({
            findOne: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue(10)
            }),
        }))();
        const paramProvider = new ParamProvider(paramModel, IServiceTracingUcMock, IServiceErrorUcMock);
        const result = await paramProvider.findParams(content);
        expect(result).toBe(findOneResult);
    });

    it('updateParam', async () => {
        const content = {} as any;
        const updateParamResult = {}
        mockParamModel.findOneAndUpdate = jest.fn().mockResolvedValue(updateParamResult);

        const result = await service.updateParam(content);
        expect(result).toBe(updateParamResult);
        expect(mockParamModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('setLoadTime', async () => {
        const content = {} as any;
        const updateManyResult = [{ "id_param": "Caracteristicas", "values.Family": "family" }, { "$set": { "values.$[].loadTime": "0" } }]
        mockParamModel.updateMany = jest.fn().mockResolvedValue(updateManyResult);

        const result = await service.setLoadTime(content);
        expect(result).toBe(updateManyResult);
        expect(mockParamModel.updateMany).toHaveBeenCalled();
    });

    it('getFeaturesEnabled', async () => {
        jest.spyOn(service, 'getFeaturesEnabled')
        const content = 'Terminales';
        const updateManyResult = [{ "id_param": "Caracteristicas", "values.Family": "family" }, { "$set": { "values.$[].loadTime": "0" } }]
        mockParamModel.findOne = jest.fn().mockResolvedValue(updateManyResult);

        await service.getFeaturesEnabled(content);
        expect(service.getFeaturesEnabled).toHaveBeenCalled();
        expect(mockParamModel.findOne).toHaveBeenCalled();
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