/**
 * Clase de orquestación en la creación del dataload
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import { ECategoriesDataload } from '../../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../../common/utils/enums/taks.enum';
import GeneralUtil from '../../../common/utils/generalUtil';
import { IDataloadDTO } from '../../../controller/dto/dataload/dataload.dto';
import { ECategory, ICatalog } from '../../../core/entity/catalog/catalog.entity';
import { IOrchDataloadUC } from '../orch-dataload.uc';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { ISelectDataloadUC } from '../select-dataload.uc';
import { IDataloadUC } from '../dataload.uc';
import { EStatusTracingGeneral } from '../../../common/utils/enums/tracing.enum';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';

@Injectable()
export class OrchDataloadUC implements IOrchDataloadUC {
  constructor(
    private dataloadProvider: IDataloadUC,
    private readonly _selectDataload: ISelectDataloadUC,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(OrchDataloadUC.name);

  /**
   * Operación encargada de orquestar la creación del dataload
   * @param {IDataloadDTO} req Categoria y dataload a generar
   */
  async orchDataload(req: IDataloadDTO){
    try {
      this.createTraceability(`START UC FOR --> ${req.dataload}`, Etask.START_CREATE_DATALOAD, req.dataload)
      this.createTraceability(`GET DATA FOR --> ${req.dataload}`, Etask.GET_DATA, req.dataload)
      const DATA = await this.getData(req.dataload);

      if (!GeneralUtil.isEmpty(DATA)){
        const SELECT_DATA: ECategory = await this.selectData(DATA, req.dataload);        
        await this._selectDataload.selectDataLoad(SELECT_DATA, req);
      }else{
        this.logger.write(`orchDataload() | ${ETaskDesc.INVALID_DATA}`, Etask.DATALOAD);
        this.createTraceability(ETaskDesc.INVALID_DATA, '', req.dataload)
      }
    } catch (error) {
      this.logger.write(`orchDataload() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.DATALOAD_MANUAL);
    } finally {      
      this.createTraceability(`FINISH UC FOR --> ${req.dataload}`, Etask.FINISH_CREATE_DATALOAD, req.dataload)
    }
  }

  /**
   * Operación para consultar la información de los productos por categoría
   * @param {String} dataload Dataload solicitado
   * @returns {ICatalog[]} Arreglo con los productos por categoría
   */
  private async getData(dataload: string): Promise<ECategory>{
    try {
      let dataFind: ECategory = {
        Terminales: [],
        Tecnologia: [],
        Pospago: [],
        Prepago: [],
        Hogares: [],
      }
            
      for (const category of Object.values(ECategoriesDataload)) {
        switch (category) {
          case "Terminales":
            if (dataload == "Product-Data"){
              dataFind.Terminales.push(... await this.dataloadProvider.findEquipmentFilterDataload());
            }else{
              dataFind.Terminales.push(... await this.dataloadProvider.findEquipmentDataload());
            }
            break;

          case "Tecnologia":
            dataFind.Tecnologia.push(... await this.dataloadProvider.findTechnologyDataload());
            break;

          case "Prepago":
            dataFind.Pospago.push (... await this.dataloadProvider.findPrepagoDataload());
            break;

          case "Pospago":
            dataFind.Prepago.push(... await this.dataloadProvider.findPospagoDataload());
            break;

          case "Hogares":
            dataFind.Hogares.push(... await this.dataloadProvider.findHomesDataload());
            break;

          }
      }
      
      return dataFind;
    } catch (error) {
      this.logger.write(`getData() | ${ETaskDesc.ERROR_FIND_DATA}`, Etask.FIND_DATA);
    }
  }

  private async selectData(data: ECategory, dataload: string): Promise<ICatalog[] | any> {
    try {
      const resultData = [];
      const dataFind: ECategory = {
        Terminales: [],
        Tecnologia: [],
        Pospago: [],
        Prepago: [],
        Hogares: [],
      };

      for (const category of Object.values(ECategoriesDataload)) {
        const orderedData = await this.dataloadProvider.orderListParentDataload(data[category], category);
        if (dataload === "Attributes-Products") {
          resultData.push(...orderedData);
        } else if (dataload === "Product-Data") {
          dataFind[category].push(...orderedData);
        }
      }

      if (dataload === "Attributes-Products") {
        return resultData;
      } else if (dataload === "Product-Data") {
        return dataFind;
      } else {
        return data;
      }
    } catch (error) {
      this.logger.write(`selectData() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.DATALOAD_MANUAL);
    }
  }

    /**
   * Lógica para crear service traciability
   * @param task tarea
   * @param description Descripcion
   * @param request Request
   * @param response Response
   */
    private async createTraceability(
      task: Etask | string,
      description?: string | ETaskDesc,
      request?: string,
    ): Promise<void> {
      this.logger.write(task, description?? description, ELevelsErros.INFO, request?? request);

      const traceability = new Traceability({});
      traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
      traceability.setDescription(description);
      traceability.setTask(task);
      traceability.setRequest(request);
      await this._serviceTracing.createServiceTracing(
        traceability.getTraceability(),
      );
    }

}