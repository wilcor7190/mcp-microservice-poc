import { ProductAttributesModel } from 'src/data-provider/model/catalog/product-attributes/product-attributes.model';
import { ExceptionModel } from 'src/data-provider/model/catalog/exception.model';
import { FamilyParams } from 'src/common/utils/enums/params.enum';
import { CatalogProvider } from './catalog.provider.impl';
import { Model } from 'mongoose';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { TermsModel } from 'src/data-provider/model/catalog/terms.model';

jest.setTimeout(35000);

describe('CatalogProvider', () => {
  let service: CatalogProvider;
  let mockProductAttributesModel: Model<ProductAttributesModel>;
  let mockExceptionModel: Model<ExceptionModel>;
  let mockTermsModel: Model<TermsModel>;


  beforeEach(async () => {
    mockProductAttributesModel = {} as Model<ProductAttributesModel>;
    mockExceptionModel = {} as Model<ExceptionModel>;
    mockTermsModel = {} as Model<TermsModel>;
    service = new CatalogProvider(mockProductAttributesModel, mockExceptionModel, mockTermsModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('mockExceptionModel', () => {
    it('saveExceptionSkus', async () => {
      const content = {} as any;
      const insertManyResult = {} as any;
      mockExceptionModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);

      const result = await service.saveExceptionSkus(content);
      expect(result).toBe(insertManyResult);
      expect(mockExceptionModel.insertMany).toHaveBeenCalledWith(content);
    });

    it('deleteExceptionSkus', async () => {
      const deleteManyResult = {} as any;
      mockExceptionModel.deleteMany = jest.fn().mockResolvedValue(deleteManyResult);

      const result = await service.deleteExceptionSkus();
      expect(result).toBe(deleteManyResult);
      expect(mockExceptionModel.deleteMany).toHaveBeenCalled()
    });

  })

  describe('mockProductAttributesModel', () => {

    it('getDataSkuException equipment', async () => {
      const aggregateResult = [
        { "$match": { "id": { "$regex": /^PO_Equ/ } } },
        { "$addFields": { "filter": { "$substr": ["$id", 6, -1] } } },
        { "$lookup": { "as": "relacion", "foreignField": "SKU", "from": "COLPRTEXCEPTIONS", "localField": "filter" } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$project": { "filter": 1, "id": 1, "versions.characteristics.id": 1, "versions.characteristics.versions.id": 1, "versions.characteristics.versions.value": 1, "versions.description": 1, "versions.id": 1, "versions.name": 1, "versions.specificationType": 1 } }]
      mockProductAttributesModel.aggregate = jest.fn().mockResolvedValue(aggregateResult);

      const result = await service.getDataSkuException(FamilyParams.equipment);
      expect(result).toBe(aggregateResult);
      expect(mockProductAttributesModel.aggregate).toHaveBeenCalledWith(aggregateResult);
    });

    it('getDataSkuException technology', async () => {
      const aggregateResult = [
        { "$match": { "id": { "$regex": /^PO_Tec/ } } },
        { "$addFields": { "filter": { "$substr": ["$id", 6, -1] } } },
        { "$lookup": { "as": "relacion", "foreignField": "SKU", "from": "COLPRTEXCEPTIONS", "localField": "filter" } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$project": { "filter": 1, "id": 1, "versions.characteristics.id": 1, "versions.characteristics.versions.id": 1, "versions.characteristics.versions.value": 1, "versions.description": 1, "versions.id": 1, "versions.name": 1, "versions.specificationType": 1 } }]
      mockProductAttributesModel.aggregate = jest.fn().mockResolvedValue(aggregateResult);

      const result = await service.getDataSkuException(FamilyParams.technology);
      expect(result).toBe(aggregateResult);
      expect(mockProductAttributesModel.aggregate).toHaveBeenCalledWith(aggregateResult);
    });

    it('saveAttributes', async () => {
      const content = {} as any;
      const insertManyResult = {} as any;
      mockProductAttributesModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);

      const result = await service.saveAttributes(content);
      expect(result).toBe(insertManyResult);
      expect(mockProductAttributesModel.insertMany).toHaveBeenCalledWith(content);
    });

    it('deleteAttributes', async () => {
      const deleteManyResult = {} as any;
      mockProductAttributesModel.deleteMany = jest.fn().mockResolvedValue(deleteManyResult);

      const result = await service.deleteAttributes();
      expect(result).toBe(deleteManyResult);
      expect(mockProductAttributesModel.deleteMany).toHaveBeenCalled()
    });

    it('getDataAttributes technology', async () => {
      const aggregateResult = [
        { "$match": { "id": { "$regex": /^PO_Tec/ } } },
        { "$addFields": { "filter": { "$substr": ["$id", 6, -1] } } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$project": { "filter": 1, "id": 1, "versions.characteristics.id": 1, "versions.characteristics.versions.id": 1, "versions.characteristics.versions.value": 1, "versions.description": 1, "versions.id": 1, "versions.name": 1, "versions.specificationType": 1 } }]
      mockProductAttributesModel.aggregate = jest.fn().mockResolvedValue(aggregateResult);

      const result = await service.getDataAttributes(FamilyParams.technology);
      expect(result).toBe(aggregateResult);
      expect(mockProductAttributesModel.aggregate).toHaveBeenCalledWith(aggregateResult);
    });

    it('getDataAttributes equipment', async () => {
      const aggregateResult = [
        { "$match": { "id": { "$regex": /^PO_Equ/ } } },
        { "$addFields": { "filter": { "$substr": ["$id", 6, -1] } } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$match": { "relacion": { "$ne": [] } } },
        { "$project": { "filter": 1, "id": 1, "versions.characteristics.id": 1, "versions.characteristics.versions.id": 1, "versions.characteristics.versions.value": 1, "versions.description": 1, "versions.id": 1, "versions.name": 1, "versions.specificationType": 1 } }]
      mockProductAttributesModel.aggregate = jest.fn().mockResolvedValue(aggregateResult);

      const result = await service.getDataAttributes(FamilyParams.equipment);
      expect(result).toBe(aggregateResult);
      expect(mockProductAttributesModel.aggregate).toHaveBeenCalledWith(aggregateResult);
    });

  })

  describe('mockTermsConditions', () => {
    it('saveTermsConditions', async () => {
      const content = {} as any;
      const insertManyResult = {} as any;
      mockTermsModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);

      const result = await service.saveTermsConditions(content);
      expect(result).toBe(insertManyResult);
      expect(mockTermsModel.insertMany).toHaveBeenCalledWith(content);
    });

    it('deleteTermsConditions', async () => {
      const deleteManyResult = {} as any;
      mockTermsModel.deleteMany = jest.fn().mockResolvedValue(deleteManyResult);

      const result = await service.deleteTermsConditions();
      expect(result).toBe(deleteManyResult);
      expect(mockTermsModel.deleteMany).toHaveBeenCalled()
    });

    it('getAllTermsConditions', async () => {

      const content = {} as any;
      const ManyResult = {} as any;
      const TermModel = jest.fn().mockImplementation(() => ({
        find: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue(ManyResult)
        }),
      }))();
      const TermProvider = new CatalogProvider(mockProductAttributesModel, mockExceptionModel, TermModel);  
      const result = await TermProvider.getAllTermsConditions();
      expect(result).toBe(ManyResult);


    });
  })


});
