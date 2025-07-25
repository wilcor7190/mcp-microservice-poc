/**
 * Clase para construcción logica de negocio metodo creación dataload product-inventory
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ECategoriesDataload } from '../../../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import {
  ECategory,
  ICatalog,
} from '../../../../core/entity/catalog/catalog.entity';
import { IProductInventory } from '../../../../core/entity/catalog/product-inventory.entity';
import { IDataloadProviderPrices } from '../../../../data-provider/dataload-prices.provider';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IProductInventoryUC } from '../product-inventory.uc';

@Injectable()
export class ProductInventoryUC implements IProductInventoryUC {
  constructor(
    private sftpProvider: ISftpProvider,
    private dataloadProviderPrices: IDataloadProviderPrices,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  private readonly logger = new Logging(ProductInventoryUC.name);

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */
  async dataLoadConfiguration(data: ECategory, pathProductInventory: string, pathProductInventoryB2b: string) {
    try {
      this.logger.write(
        'dataLoadConfiguration() - ProductInventoryUc',
        Etask.CREATE_PRODUCT_INVENTORY,
      );

      let jsonData = [];

      for (const category of Object.values(ECategoriesDataload)) {
        this.logger.write(
          `dataLoadConfiguration() | ${category}`,
          Etask.CREATE_PRODUCT_INVENTORY,
        );

        let dataJson = await this.generateRows(data[category], category);
        jsonData = jsonData.concat(dataJson);
      }

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'FulfillmentCenterName', title: 'FulfillmentCenterName' },
        { id: 'Quantity', title: 'Quantity' },
        { id: 'QuantityMeasure', title: 'QuantityMeasure' },
        { id: 'Delete', title: 'Delete' },
      ];

      const CSV_ROOT_FILE = find.getCsv(generalConfig.productInventory);
      await CreateCsv.createCsv(
        jsonData,
        CSV_ROOT_FILE,
        HEADERS,
        'CatalogEntryInventory',
        'product_inventory_0',
      );
      await CreateCsv.unificateFiles('product_inventory_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, pathProductInventory);
    } catch (error) {
      this.logger.write(
        `dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`,
        Etask.CREATE_PRODUCT_INVENTORY,
      );
    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns {IAttributesProduct[]} Arreglo con las filas para el archivo csv
   */
  private async generateRows(
    data: ICatalog[],
    category: string,
  ): Promise<IProductInventory[]> {
    try {
      let rows: IProductInventory[] = [];

      let hash = {};
      const PRODUCTS = data.filter((product) => {
        let exists = !hash[product.partNumber];
        hash[product.partNumber] = true;
        return exists;
      });

      const INVENTORY = await this.dataloadProviderPrices.findDisponibility();

      for (const product of PRODUCTS) {
        let disponibility = INVENTORY.filter(
          (cant) => cant.parentPartNumber == product.partNumber,
        );

        if (disponibility.length > 0) {
          rows.push({
            PartNumber: product.partNumber,
            FulfillmentCenterName: generalConfig.fulfillmentCenterName,
            Quantity:
              category == ECategoriesDataload.EQUIPMENT ||
              category == ECategoriesDataload.TECHNOLOGY
                ? disponibility[0].stockDisponibility
                : '999',
            QuantityMeasure: generalConfig.quantityMeasure,
            Delete: '0',
          });
        }
      }

      return rows;
    } catch (error) {
      this.logger.write(
        `generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`,
        Etask.CREATE_PRODUCT_INVENTORY,
      );
    }
  }

}
