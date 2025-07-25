/**
 * Clase para construcción logica de negocio metodo creación dataload product-data
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ECategoriesDataload } from '../../../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { ICatalog, IFeatures } from '../../../../core/entity/catalog/catalog.entity';
import { IProductData } from '../../../../core/entity/catalog/product-data.entity';
import { IDataloadProvider } from '../../../../data-provider/dataload.provider';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IProductDataUC } from '../product-data.uc';
import { ISalesCatalogUC } from '../sales-catalog.uc';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';

@Injectable()
export class ProductDataUC implements IProductDataUC {
  constructor(
    private sftpProvider: ISftpProvider,
    private dataloadProvider: IDataloadProvider,
    public readonly _serviceError: IServiceErrorUc,
    private readonly _salesCatalogUC: ISalesCatalogUC,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _paramsProvider: IParamProvider,
  ) { }

  private readonly logger = new Logging(ProductDataUC.name);

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   * @param {String} pathSalesCatalog Endpoint donde se almacenara el dataload
   * @param {String} pathSalesCatalogB2b Endpoint donde se almacenera el dataload de B2B
   */    
  async dataLoadConfiguration(data: any, pathProductData: string, pathSalesCatalog: string, pathProductDataB2b: string, pathSalesCatalogB2b: string){
    try {
      let jsonData = [];

      for (const category of Object.values(ECategoriesDataload)) {
        if (category == ECategoriesDataload.EQUIPMENT){
          this.logger.write(`FIND PRODUCTS | ${category}`, Etask.FIND_EQUIPMENT, ELevelsErros.INFO, 'Product-Data');
          const DATA_SALES_CATALOG = await this.dataloadProvider.findEquipment();
          const DATA_PARENTS = await this.dataloadProvider.orderListParent(DATA_SALES_CATALOG, category);

          await this._salesCatalogUC.dataLoadConfiguration(DATA_PARENTS, `${pathSalesCatalog}${generalConfig.salesCatalog}.csv`);
        }
        
        const PARENTS = this.generateParents(data[category], category);
        jsonData = jsonData.concat(PARENTS);     
      }

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'ParentPartNumber', title: 'ParentPartNumber' },
        { id: 'ParentGroupIdentifier', title: 'ParentGroupIdentifier' },
        { id: 'ParentStoreIdentifier', title: 'ParentStoreIdentifier' },
        { id: 'Type', title: 'Type' },
        { id: 'Name', title: 'Name' },
        { id: 'ShortDescription', title: 'ShortDescription' },
        { id: 'LongDescription', title: 'LongDescription' },
        { id: 'Thumbnail', title: 'Thumbnail' },
        { id: 'FullImage', title: 'FullImage' },
        { id: 'Available', title: 'Available' },
        { id: 'Published', title: 'Published' },
        { id: 'AvailabilityDate_LocalSpecific', title: 'AvailabilityDate_LocalSpecific' },
        { id: 'ManufacturerPartNumber', title: 'ManufacturerPartNumber' },
        { id: 'Manufacturer', title: 'Manufacturer' },
        { id: 'OnSpecial', title: 'OnSpecial' },
        { id: 'Buyable', title: 'Buyable' },
        { id: 'StartDate', title: 'StartDate' },
        { id: 'EndDate', title: 'EndDate' },
        { id: 'Field1', title: 'Field1' },
        { id: 'Field2', title: 'Field2' },
        { id: 'Field3', title: 'Field3' },
        { id: 'Field4', title: 'Field4' },
        { id: 'Field5', title: 'Field5' },
        { id: 'URLKeyword', title: 'URLKeyword' },
        { id: 'Delete', title: 'Delete' }
      ];

      const CSV_ROOT_FILE = find.getCsv(generalConfig.productData); 
      await CreateCsv.createCsv(jsonData, CSV_ROOT_FILE, HEADERS, 'CatalogEntry', 'product_data_0');
      await CreateCsv.unificateFiles('product_data_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, `${pathProductData}${generalConfig.productData}.csv`);
    } catch (error) {
      this.logger.write(`dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_PRODUCT_DATA);
      
    }
  }

  /**
   * Operación para crear los padres
   * @param {ICatalog[]} listProducts Lista de productos por clasificación
   * @param {String} category Categoría solicitada
   * @returns {IProductData[]} Filas para la creación del csv
   */
  private generateParents(listProducts: ICatalog[], category: string): IProductData[] | []{
    try {
      let parents: IProductData[] = [];
      this.logger.write(`START MAP PRODUCT-DATA | ${category}`, Etask.CREATE_PRODUCT_DATA, ELevelsErros.INFO, 'Product-Data');

      if(!listProducts || listProducts.length === 0) return parents

      listProducts.forEach(product => {

        let row: IProductData = {
          PartNumber: product.partNumber,
          ParentPartNumber: product.parentPartNumber,
          ParentStoreIdentifier: "",
          Type: product.partNumber.endsWith('P') ? 'Product': 'Item',
          Thumbnail: product.thumbnail,
          FullImage: product.fullImage,
          Available: "1",
          Published: "1",
          AvailabilityDate_LocalSpecific: "",
          ManufacturerPartNumber: "",
          OnSpecial: "",
          Buyable: "1",
          StartDate: "",
          EndDate: "",
          Field1: "",
          Field2: "",
          Field3: "",
          Field4: "",
          Field5: "",
          URLKeyword: "",
          Delete: "0"
        }      
        let name = this.getNombreComercial(product, category);
        row.Name = name.replace(/_/g, " ");
        row.URLKeyword = product.partNumber.endsWith('P') ? product.URLKeyword : "";
        row.ShortDescription = name.replace(/_/g, " ");
        row.LongDescription = '';
        row.Manufacturer = "";

        switch (category) {
          case ECategoriesDataload.EQUIPMENT:
            row.Manufacturer = this.getFabricante(product.features, category);
            row.ParentGroupIdentifier = "CELULARES";
            parents.push(row);
            break;

          case ECategoriesDataload.TECHNOLOGY:
            row.Manufacturer = this.getFabricante(product.features, category);

            let specificationSubtype = product.features.filter((feature: IFeatures) => feature.id == "TIPO_PRODUCTO");
            let parentGroupIdentifier = specificationSubtype[0].value;
            
            if(parentGroupIdentifier != null || parentGroupIdentifier != undefined){
              row.ParentGroupIdentifier = parentGroupIdentifier.replace(/ /g, "");
              parents.push(row);
            }
            break;
            
          case ECategoriesDataload.POSPAGO:
          case ECategoriesDataload.PREPAGO:
            row.ParentGroupIdentifier = "SERVICIOSMOVILES";
            parents.push(row);
            break;
        
          case ECategoriesDataload.HOMES:
            row.ParentGroupIdentifier = "SERVICIOSHOGAR";
            parents.push(row);
            break;
        }
      });

      return parents;
    } catch (error) {
      this.logger.write(`generateParents() | ${ETaskDesc.ERROR_GENERATE_PARENTS}`, Etask.CREATE_PRODUCT_DATA);
      
    }
  }

  /**
   * Operación para obtener el valor de la caracteristica NOMBRE_COMERCIAL
   * @param {ICatalog} product Caracteristicas del producto
   * @param {String} category Categoría solicitada
   * @returns {String} Nombre comercial para el mapeo
   */
  private getNombreComercial(product: ICatalog, category: string): string{
    try {
      let name = "";
      switch (category) {
        case ECategoriesDataload.EQUIPMENT:
        case ECategoriesDataload.TECHNOLOGY:
          name = product.name
          return name;
          
        case ECategoriesDataload.PREPAGO:
        case ECategoriesDataload.POSPAGO:
          const NOMBRE_CORTO_PREPAGO = product.features.filter(feature => feature.id == "NombreCorto");
          return (NOMBRE_CORTO_PREPAGO[0] && NOMBRE_CORTO_PREPAGO[0].value.length <= 256)
          ? NOMBRE_CORTO_PREPAGO[0].value
          : "";      
      
        default:
          const NOMBRE_CORTO_HOMES = product.features.filter(feature => feature.id == "NombreCorto");
          return NOMBRE_CORTO_HOMES[0] ? NOMBRE_CORTO_HOMES[0].value : product.name;
      }


    } catch (error) {
      this.logger.write(`getNombreComercial() | ${ETaskDesc.ERROR_GENERATE_PARENTS}`, Etask.CREATE_PRODUCT_DATA);
    }
  }

  /**
   * Operación para obtener el valor de la caracteristica Fabricante
   * @param {IFeatures[]} features Caracteristicas del producto
   * @param {String} category Categoría solicitada
   * @returns {String} Fabricante para el mapeo
   */
  private getFabricante(features: IFeatures[], category: string): string{
    try {
      switch (category) {
        case ECategoriesDataload.EQUIPMENT:
        case ECategoriesDataload.TECHNOLOGY:
          const MARCA = features.filter(feature => feature.id == "MARCA");
          return MARCA[0] ? MARCA[0].value : "";

        default:
          return "";
      }
    } catch (error) {
      this.logger.write(`getFabricante() | ${ETaskDesc.ERROR_GENERATE_PARENTS}`, Etask.CREATE_PRODUCT_DATA);
    }
  }

  
}