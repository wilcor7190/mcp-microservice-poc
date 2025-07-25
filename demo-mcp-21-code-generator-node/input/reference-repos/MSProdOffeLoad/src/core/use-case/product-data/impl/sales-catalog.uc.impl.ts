/**
 * Clase para construcción logica de negocio metodo creación dataload sales-catalog
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { ICatalog } from '../../../../core/entity/catalog/catalog.entity';
import { ISalesCatalog } from '../../../../core/entity/catalog/sales-catalog.entity';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { ISalesCatalogUC } from '../sales-catalog.uc';

@Injectable()
export class SalesCatalogUC implements ISalesCatalogUC {
  constructor( 
    private sftpProvider: ISftpProvider,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(SalesCatalogUC.name);

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} path Endpoint donde se almacenara el dataload
   */      
  async dataLoadConfiguration(data: ICatalog[], path: string){
    try {
      this.logger.write('dataLoadConfiguration()', Etask.CREATE_SALES_CATALOG);

      let jsonData = [];
      
      jsonData = await this.generateRows(data);       

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'Sequence', title: 'Sequence' },
        { id: 'ParentGroupIdentifier', title: 'ParentGroupIdentifier' },
        { id: 'Delete', title: 'Delete' }
      ]

      const CSV_ROOT_FILE = find.getCsv(generalConfig.salesCatalog);
      await CreateCsv.createCsv(jsonData, CSV_ROOT_FILE, HEADERS, 'CatalogEntryParentCatalogGroupRelationship', 'SalesCatalogGroupCatalogEntries_0');
      await CreateCsv.unificateFiles('SalesCatalogGroupCatalogEntries_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, path);
      
    } catch (error) {
      this.logger.write(`dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_SALES_CATALOG);      
    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns {ISalesCatalog[]} Arreglo con las filas para el archivo csv
   */
  private async generateRows(data: ICatalog[]): Promise<ISalesCatalog[]>{
    try {
      let rows: ISalesCatalog[] = [];
      const LIST_PRODUCTS = data.filter(product => product.features[product.features.findIndex(feature => feature.id == "specificationSubtype")].value === 'Telefono');

      for (const product of LIST_PRODUCTS) {
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "CELULARESTL", Delete: "0"});
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "Renuevatuequipo", Delete: "0"});
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "CelularSimCard", Delete: "0"});
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "CelularSimCard1", Delete: "0"});
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "RenuevatuequipoPos", Delete: "0"});
      }

      return rows;
    } catch (error) {
      this.logger.write(`generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_SALES_CATALOG);
    }
  }

  /**
   * Operación que envía la información para crear el dataload de B2B
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} path Endpoint donde se almacenara el dataload
   */      
  async dataLoadConfigurationB2b(data: ICatalog[], path: string){
    try {
      this.logger.write('dataLoadConfigurationB2B()', Etask.CREATE_SALES_CATALOG);

      let jsonDataB2b = [];
      
      jsonDataB2b = await this.generateRowsB2b(data);       

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'Sequence', title: 'Sequence' },
        { id: 'ParentGroupIdentifier', title: 'ParentGroupIdentifier' },
        { id: 'Delete', title: 'Delete' }
      ]

      const CSV_ROOT_FILE = find.getCsv(generalConfig.salesCatalog);
      await CreateCsv.createCsv(jsonDataB2b, CSV_ROOT_FILE, HEADERS, 'CatalogEntryParentCatalogGroupRelationship', 'SalesCatalogGroupCatalogEntries_0');
      await CreateCsv.unificateFiles('SalesCatalogGroupCatalogEntries_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, path);
      
    } catch (error) {
      this.logger.write(`dataLoadConfigurationB2B() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_SALES_CATALOG);      
    }
  }

  /**
   * Operación para crear las filas del csv de B2B
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns {ISalesCatalog[]} Arreglo con las filas para el archivo csv
   */
  private async generateRowsB2b(data: ICatalog[]): Promise<ISalesCatalog[]>{
    try {
      let rows: ISalesCatalog[] = [];
      const LIST_PRODUCTS = data.filter(product => product.features[product.features.findIndex(feature => feature.id == "specificationSubtype")].value === 'Telefono');

      for (const product of LIST_PRODUCTS) {
        rows.push({ PartNumber: product.partNumber, Sequence: "1", ParentGroupIdentifier: "B2BCELULARESTL", Delete: "0"});
      }

      return rows;
    } catch (error) {
      this.logger.write(`generateRowsB2B() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_SALES_CATALOG);
    }
  }
}