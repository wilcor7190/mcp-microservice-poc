import { FeatureProvider } from './transform-feature.provider.impl';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import {  Model } from 'mongoose';
import { GeneralModel } from "src/data-provider/model/general/general.model";
import { FamilyParams } from 'src/common/utils/enums/params.enum';

jest.setTimeout(35000);

describe('DisponibilityProviderImpl', () => {
  let service: FeatureProvider;
  let mockGeneralModel: Model<GeneralModel>;
  let IGetErrorTracingUcMock: jest.Mocked<IGetErrorTracingUc>;

  beforeEach(async () => {

    mockGeneralModel = {} as Model<GeneralModel>;

    IGetErrorTracingUcMock = {
      createTraceability: jest.fn(),
      getError: jest.fn(),
    } as jest.Mocked<IGetErrorTracingUc>;

    service = new FeatureProvider(mockGeneralModel, IGetErrorTracingUcMock);

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  it('saveData', async () => {
    const content = {} as any;
    const insertManyResult = {} as any;

    jest.spyOn(service, 'saveData')
    mockGeneralModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);
    await service.saveData(content);

    expect(mockGeneralModel.insertMany).toHaveBeenCalledWith(content);
    expect(service.saveData).toHaveBeenCalledTimes(1);

  });

  it('deleteDataColPrtProductOffering', async () => {
    const content = {} as any;
    const insertManyResult = {} as any;
    let finalMaterial = {
        params: {
          family: FamilyParams.equipment,
          type: 'characteristics',
          Page: 1
        },
        data: {
          getProductOfferingResponse: []
        }
    }

    jest.spyOn(service, 'deleteDataColPrtProductOffering')
    mockGeneralModel.deleteMany = jest.fn().mockResolvedValue(insertManyResult);
    await service.deleteDataColPrtProductOffering(finalMaterial.params,FamilyParams.equipment);

    expect(mockGeneralModel.deleteMany).toHaveBeenCalled();
    expect(service.deleteDataColPrtProductOffering).toHaveBeenCalledTimes(1);

  });

  it('deleteDataColPrtProductOffering technology', async () => {
    const content = {} as any;
    const insertManyResult = {} as any;
    let finalMaterial = {
        params: {
          family: FamilyParams.equipment,
          type: 'characteristics',
          Page: 1
        },
        data: {
          getProductOfferingResponse: []
        }
    }

    jest.spyOn(service, 'deleteDataColPrtProductOffering')
    mockGeneralModel.deleteMany = jest.fn().mockResolvedValue(insertManyResult);
    await service.deleteDataColPrtProductOffering(finalMaterial.params,FamilyParams.technology);

    expect(mockGeneralModel.deleteMany).toHaveBeenCalled();
    expect(service.deleteDataColPrtProductOffering).toHaveBeenCalledTimes(1);

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