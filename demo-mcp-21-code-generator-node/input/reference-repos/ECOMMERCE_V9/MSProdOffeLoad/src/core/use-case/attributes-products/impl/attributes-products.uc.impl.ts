/**
 * Clase para construcción logica de negocio metodo creación dataload attributes-products
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { IAttributesProduct } from '../../../../core/entity/catalog/attributes-product.entity';
import { ICatalog } from '../../../../core/entity/catalog/catalog.entity';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IAttributesProductsUC } from '../attributes-products.uc';

@Injectable()
export class AttributesProductsUC implements IAttributesProductsUC {
  constructor( 
    private sftpProvider: ISftpProvider,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(AttributesProductsUC.name);

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */
  async dataLoadConfiguration(data: ICatalog[], pathAttributesProducts: string, pathAttributesProductsB2b: string){
    try {
      this.logger.write('dataLoadConfiguration() - AttributesProductsUC', Etask.CREATE_ATTRIBUTES_PRODUCT);

      let jsonData = [];
      jsonData = await this.generateRows(data);

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'AttributeIdentifier', title: 'AttributeIdentifier' },
        { id: 'ValueIdentifier', title: 'ValueIdentifier' },
        { id: 'Value', title: 'Value' },
        { id: 'Usage', title: 'Usage' },
        { id: 'Sequence', title: 'Sequence' },
        { id: 'AttributeStoreIdentifier', title: 'AttributeStoreIdentifier' },
        { id: 'Field1', title: 'Field1' },
        { id: 'Field2', title: 'Field2' },
        { id: 'Field3', title: 'Field3' },
        { id: 'AttributeValueField1', title: 'AttributeValueField1' },
        { id: 'AttributeValueField2', title: 'AttributeValueField2' },
        { id: 'AttributeValueField3', title: 'AttributeValueField3' },
        { id: 'AttributeValueDescriptionField1', title: 'AttributeValueDescriptionField1' },
        { id: 'AttributeValueDescriptionField2', title: 'AttributeValueDescriptionField2' },
        { id: 'AttributeValueDescriptionField3', title: 'AttributeValueDescriptionField3' },
        { id: 'AttributeValueDescriptionImage1', title: 'AttributeValueDescriptionImage1' },
        { id: 'AttributeValueDescriptionImage2', title: 'AttributeValueDescriptionImage2' },
        { id: 'UnitOfMeasure', title: 'UnitOfMeasure' },
        { id: 'Delete', title: 'Delete' }
      ]

      const CSV_ROOT_FILE = find.getCsv(generalConfig.attributesProducts);
      await CreateCsv.createCsv(jsonData, CSV_ROOT_FILE, HEADERS, 'CatalogEntryAttributeDictionaryAttributeRelationship', 'attribute_product_0');
      await CreateCsv.unificateFiles('attribute_product_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, pathAttributesProducts);
    } catch (error) {
      this.logger.write(`dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_ATTRIBUTES_PRODUCT);

    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns {IAttributesProduct[]} Arreglo con las filas para el archivo csv
   */  
  private async generateRows(data: ICatalog[]): Promise<IAttributesProduct[]>{
    try {
      let rows: IAttributesProduct[] = [];

      for (const product of data) {
        if (product.partNumber.slice(-1) == 'P'){
          product.features.forEach(feature => {
            let row: IAttributesProduct = {
              PartNumber: product.partNumber,
              AttributeIdentifier: feature.id,
              Value: feature.value,
              Sequence: "1",
              AttributeStoreIdentifier: "",
              Field1: "",
              Field2: "",
              Field3: "",
              AttributeValueField1: "",
              AttributeValueField2: "",
              AttributeValueField3: "",
              AttributeValueDescriptionField1: "",
              AttributeValueDescriptionField2: "",
              AttributeValueDescriptionField3: "",
              AttributeValueDescriptionImage1: "",
              AttributeValueDescriptionImage2: "",
              UnitOfMeasure: "",
              Delete: "0"
            }

            if (feature.id == 'Color') {
              row.ValueIdentifier = feature.value;
              row.Usage = 'Defining';
            }else{
              row.ValueIdentifier = product.partNumber;
              row.Usage = 'Descriptive';
            }

            rows.push(row)
          });
        }else{
          const FEATURE_COLOR = product.features[product.features.findIndex(feature => feature.id == "Color")];

          if (FEATURE_COLOR) {
            rows.push({
              PartNumber: product.partNumber,
              AttributeIdentifier: FEATURE_COLOR.id,
              ValueIdentifier: FEATURE_COLOR.value,
              Value: FEATURE_COLOR.value,
              Usage: 'Defining',
              Sequence: "1",
              AttributeStoreIdentifier: "",
              Field1: "",
              Field2: "",
              Field3: "",
              AttributeValueField1: "",
              AttributeValueField2: "",
              AttributeValueField3: "",
              AttributeValueDescriptionField1: "",
              AttributeValueDescriptionField2: "",
              AttributeValueDescriptionField3: "",
              AttributeValueDescriptionImage1: "",
              AttributeValueDescriptionImage2: "",
              UnitOfMeasure: "",
              Delete: "0"
            })
          }
        }
      }

      return rows.filter(row => row.AttributeIdentifier != 'specificationSubtype');
    } catch (error) {
      this.logger.write(`generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_ATTRIBUTES_PRODUCT);
      
    }
  }

}