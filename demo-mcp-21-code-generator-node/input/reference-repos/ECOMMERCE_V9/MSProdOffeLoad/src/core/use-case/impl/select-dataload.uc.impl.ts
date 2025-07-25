/**
 * Clase de orquestación en la creación del dataload
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../common/configuration/general.config';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import { ETaskDesc, Etask } from '../../../common/utils/enums/taks.enum';
import GeneralUtil from '../../../common/utils/generalUtil';
import { IDataloadDTO } from '../../../controller/dto/dataload/dataload.dto';
import { ECategory, ICatalog } from '../../../core/entity/catalog/catalog.entity';
import { IAttachmentsDataUC } from '../attachments-data/attachments-data.uc';
import { IAttributesDictionaryUC } from '../attributes-dictionary/attributes-dictionary.uc';
import { IAttributesProductsUC } from '../attributes-products/attributes-products.uc';
import { IPriceListUC } from '../price-list/price-list.uc';
import { IProductDataUC } from '../product-data/product-data.uc';
import { IProductInventoryUC } from '../product-inventory/product-inventory.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { ISelectDataloadUC } from '../select-dataload.uc';

@Injectable()
export class SelectDataloadUC implements ISelectDataloadUC {
  constructor(
    private readonly _productDataUC: IProductDataUC,
    private readonly _attributesProductUC: IAttributesProductsUC,
    private readonly _attributesDictionaryUC: IAttributesDictionaryUC,
    private readonly _attachementDataUC: IAttachmentsDataUC,
    private readonly _productInventoryUC: IProductInventoryUC,
    private readonly _priceListUC: IPriceListUC,
    public readonly _serviceTracing: IServiceTracingUc
  ) { }

  private readonly logger = new Logging(SelectDataloadUC.name);

  /**
   * Operación encargada de orquestar la creación del dataload
   * @param {ICatalog[]} data Productos por categoría
   * @param {IDataloadDTO} req Categoria y dataload
   */
  async selectDataLoad(data: ECategory | ICatalog[], req: IDataloadDTO): Promise<void>{
    try {
      if (!GeneralUtil.isEmpty(data)){
        const PATH = generalConfig.sftpRemotePath;
        const PATHB2B = generalConfig.sftpRemotePathB2b;
          
        switch (req.dataload) {
          case "Product-Data":
            let pathProductData = `${PATH}${generalConfig.sftpProductData}`;
            let pathProductDataB2b = `${PATHB2B}${generalConfig.sftpProductData}`;
            let pathSalesCatalog = `${PATH}${generalConfig.sftpSalesCatalog}`;
            let pathSalesCatalogB2b = `${PATHB2B}${generalConfig.sftpSalesCatalog}`;

            await this._productDataUC.dataLoadConfiguration(data, pathProductData, pathSalesCatalog, pathProductDataB2b, pathSalesCatalogB2b);
            break;
  
          case "Attributes-Products":
            let pathAttributesProducts = `${PATH}${generalConfig.sftAttributeProduct}${generalConfig.attributesProducts}.csv`;
            let pathAttributesProductsB2b = `${PATHB2B}${generalConfig.sftAttributeProduct}${generalConfig.attributesProducts}.csv`;
  
            await this._attributesProductUC.dataLoadConfiguration(data, pathAttributesProducts, pathAttributesProductsB2b);
            break;
  
          case "Attributes-Dictionary":
            let pathAttributesDictionary = `${PATH}${generalConfig.sftAttributeDictionary}${generalConfig.attributesDictionary}.csv`;
            let pathAttributesDictionaryB2b = `${PATHB2B}${generalConfig.sftAttributeDictionary}${generalConfig.attributesDictionary}.csv`;
  
            await this._attributesDictionaryUC.dataLoadConfiguration(data as ECategory, pathAttributesDictionary, pathAttributesDictionaryB2b);
            break;
  
          case "Attachments-Data":
            let pathAttachmentsData = `${PATH}${generalConfig.sftAttachment}${generalConfig.attachmentsData}.csv`;
            let pathAttachmentsDataB2b = `${PATHB2B}${generalConfig.sftAttachment}${generalConfig.attachmentsData}.csv`;
  
            await this._attachementDataUC.dataLoadConfiguration(data as ECategory, pathAttachmentsData, pathAttachmentsDataB2b);
            break;
  
          case "Product-Inventory":
            let pathProductInventory = `${PATH}${generalConfig.sftProductInventory}${generalConfig.productInventory}.csv`;
            let pathProductInventoryB2b = `${PATHB2B}${generalConfig.sftProductInventory}${generalConfig.productInventory}.csv`;
  
            await this._productInventoryUC.dataLoadConfiguration(data as ECategory, pathProductInventory, pathProductInventoryB2b);
            break;
          
          case "Price-List":
            let pathPriceList = `${PATH}${generalConfig.sftPriceListData}${generalConfig.pricesCatalog}.csv`;
            let pathPriceListB2b = `${PATHB2B}${generalConfig.sftPriceListData}${generalConfig.pricesCatalog}.csv`;

            await this._priceListUC.dataLoadConfiguration(pathPriceList, pathPriceListB2b);
            break;
          
          default:
            this.logger.write(`orchDataload() | ${ETaskDesc.INVALID_DATALOAD}`, `${Etask.DATALOAD_MANUAL} ${req}`)
            let traceability = new Traceability({
              task: Etask.DATALOAD_MANUAL,
              description: ETaskDesc.INVALID_DATALOAD
            });
            traceability.setRequest(req);
            await this._serviceTracing.createServiceTracing(traceability.getTraceability());
        }
      }else{
        this.logger.write(`orchDataload() | ${ETaskDesc.INVALID_DATA}`, Etask.DATALOAD_MANUAL);
        let traceability = new Traceability({
          task: Etask.DATALOAD_MANUAL,
          description: ETaskDesc.INVALID_DATA
        });
        traceability.setRequest(req);
        await this._serviceTracing.createServiceTracing(traceability.getTraceability());
      }

    } catch (error) {
      this.logger.write(`orchDataload() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.DATALOAD_MANUAL);
    }
  }
}