/**
 * Clase con la definición de operaciones a realizar en las colecciones de catalogo
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logging from '../../common/lib/logging';
import Traceability from '../../common/lib/traceability';
import GeneralUtil from '../../common/utils/generalUtil';
import { ETaskDesc, Etask } from '../../common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from '../../common/utils/enums/tracing.enum';
import { ICatalog, IParents } from '../../core/entity/catalog/catalog.entity';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { IDataloadProvider } from '../dataload.provider';
import { ParentsChildsModel } from '../model/dataload/colprtclasifparents.model';
import { EquipmentModel } from '../model/dataload/equipment.model';
import { HomesModel } from '../model/dataload/homes.model';
import { PospagoModel } from '../model/dataload/pospago.model';
import { PrepagoModel } from '../model/dataload/prepago.model';
import { TechnologyModel } from '../model/dataload/technology.model';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import databaseConfig from '../../common/configuration/database.config';
import { ELevelsErros } from '../../common/utils/enums/logging.enum';

@Injectable()
export class DataloadProviderImpl implements IDataloadProvider {
  constructor(
    @InjectModel(EquipmentModel.name, databaseConfig.databaseFeatures)
    private readonly equipmentModel: Model<EquipmentModel>,
    @InjectModel(ParentsChildsModel.name, databaseConfig.databaseFeatures)
    private readonly parentsChildsModel: Model<ParentsChildsModel>,
    @InjectModel(TechnologyModel.name, databaseConfig.databaseFeatures)
    private readonly technologyModel: Model<TechnologyModel>,
    @InjectModel(PospagoModel.name, databaseConfig.databaseFeatures)
    private readonly pospagoModel: Model<PospagoModel>,
    @InjectModel(PrepagoModel.name, databaseConfig.databaseFeatures)
    private readonly prepagoModel: Model<PrepagoModel>,
    @InjectModel(HomesModel.name, databaseConfig.databaseFeatures)
    private readonly homesModel: Model<HomesModel>,
    
    public readonly _serviceTracing: IServiceTracingUc,
  ) {}

  private readonly logger = new Logging(DataloadProviderImpl.name);

  /**
   * Operación para consultar los productos de terminales (Features)
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  async findEquipment(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'findEquipment',Etask.APM);
      return this.equipmentModel.find().lean();      
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar los productos de terminales (Features) filtrados por clasificación
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  async findEquipmentFilter(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'findEquipmentFilter',Etask.APM);
      return this.equipmentModel.find({ 'features.id': 'CLASIFICACION' }).lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */
  async findTechnology(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'findTechnology',Etask.APM);
      return this.technologyModel.find().lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */
  async findPospago(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(PospagoModel.name, MappingApiRest.DB,'findPospago',Etask.APM);
      return this.pospagoModel.find().lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar los productos de prepago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de prepago
   */
  async findPrepago(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(PrepagoModel.name, MappingApiRest.DB,'findPrepago',Etask.APM);
      return this.prepagoModel.find().lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar los productos de hogares (Features)
   * @returns {ICatalog[]} Arreglo con los productos de hogares
   */
  async findHomes(): Promise<ICatalog[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(HomesModel.name, MappingApiRest.DB,'findHomes',Etask.APM);
      return this.homesModel.find().lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar padres e hijos
   * @param {String} family Familia para filtrar los padres e hijos
   * @returns {Object} Arreglo con la lista de padres e hijos
   */
  async getListParents(family: string): Promise<IParents[]> {
    let spanIn: any;
    try{
      spanIn = APM.startSpan(ParentsChildsModel.name, MappingApiRest.DB,'getListParents',Etask.APM);
      return this.parentsChildsModel.find({ family }).lean();
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */
  async saveListParents(data: any): Promise<any> {
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(ParentsChildsModel.name, MappingApiRest.DB,'saveListParents',Etask.APM);
      await Promise.resolve(this.parentsChildsModel.deleteMany({}));
      const DATA_PARENTS = this.parentsChildsModel.insertMany(data);
      this.logger.write('', START_TIME, ELevelsErros.INFO, Etask.SAVE_LIST_PARENTS);
      return DATA_PARENTS;
    } catch (error) {
      this.logger.write(
        `saveListParents() | ${ETaskDesc.ERROR_SAVE_LIST_PARENTS}`,
        Etask.SAVE_LIST_PARENTS,
      );
      this.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_SAVE_LIST_PARENTS);
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar y mapear los productos generados por el product-data (Padres-Hijos)
   * @param {ICatalog[]} data Productos por categoría
   * @param {String} family Categoría solicitada
   * @returns {ICatalog[]} Padres e hijos mapeados
   */
  public async orderListParent(data: ICatalog[], family: string): Promise<ICatalog[]> {
    try {
      const LIST_PARENTS = await this.getListParents(family);
      let orderData: ICatalog[] = [];


      for (const { parentPartNumber } of LIST_PARENTS) { 
        let parent = data.find(
          (product) => product.partNumber == Object.keys(parentPartNumber)[0],
        );
        let parentNumber = Object.keys(parentPartNumber)[0]
        if (parent != undefined) {
          orderData.push({
            description: parent.description,
            features: parent.features,
            name: parent.name,
            partNumber: parent.partNumber + 'P',
            id: parent.id,
            fullImage: parent.fullImage,
            thumbnail: parent.thumbnail,
            URLKeyword: parent.URLKeyword
          });
        }


        for(const child of Object.values(parentPartNumber[Object.keys(parentPartNumber)[0]])){
          let dataChild = data.find(product => product.partNumber == child);
          if(dataChild != undefined){
            orderData.push({
              description: dataChild.description,
              features: dataChild.features,
              name: dataChild.name,
              parentPartNumber: parentNumber + 'P',
              partNumber: dataChild.partNumber,
              id: dataChild.id,
              fullImage: dataChild.fullImage,
              thumbnail: dataChild.thumbnail,
              URLKeyword: dataChild.URLKeyword
            });
          }
        }
      }

      return orderData; 
    } catch (error) {
      this.logger.write(
        `orderListParent() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`,
        Etask.FIND_LIST_PARENTS,
      );
      this.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_GENERATE_DATALOAD);
      }
  }

  /**
  * Funcion para registrar la trazabilidad
  * @param {EStatusTracingGeneral} status Estado de la trazabilidad
  * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
  * @param {ETaskTracingGeneral}task Nombre de la tarea
  */
    private async createTraceability(
        status: EStatusTracingGeneral,
        description: EDescriptionTracingGeneral | string,
        task: ETaskTracingGeneral
    ): Promise<void> {
        let traceability = new Traceability({});
        traceability.setTransactionId(GeneralUtil.getCorrelationalId);
        traceability.setStatus(status);
        traceability.setDescription(description);
        traceability.setTask(task);
        await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    }
}
