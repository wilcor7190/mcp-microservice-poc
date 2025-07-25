/**
 * Clase con la definición de operaciones a realizar en las colecciones de catalogo
 * @author Santiago Vargas
 */

import * as APM from '@claro/general-utils-library';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import databaseConfig from '../../common/configuration/database.config';
import Logging from '../../common/lib/logging';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { ETaskDesc, Etask } from '../../common/utils/enums/taks.enum';
import { IParents } from '../../core/entity/categories/category.entity';
import { ITaskError } from '../../core/entity/service-error/task-error.entity';
import { IServiceErrorUc } from '../../core/use-case/resource/service-error.resource.uc';
import { ParentsChildsModel } from '../model/parentsChilds.model';
import { IParentsProvider } from '../parents.provider';
import { ParentsTemporaryModel } from '../model/parents.model';


@Injectable()
export class ParentsProviderImpl implements IParentsProvider {

    constructor(
        @InjectModel(ParentsChildsModel.name, databaseConfig.dbFeatures) private readonly parentsChildsModel: Model<ParentsChildsModel>,
        @InjectModel(ParentsTemporaryModel.name, databaseConfig.dbFeatures) private readonly parentsTemporaryModel: Model<ParentsTemporaryModel>,
        public readonly _serviceError: IServiceErrorUc,
    ){ }
    private readonly logger = new Logging(ParentsProviderImpl.name);

    /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */
  async saveListParents(data: IParents[]){
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(ParentsChildsModel.name, MappingApiRest.DB,'saveListParents',Etask.APM);
      await this.parentsChildsModel.insertMany(data);
      this.createLog('', START_TIME, Etask.SAVE_LIST_PARENTS);
    } catch (error) {
      this.logger.write(`saveListParents() | ${ETaskDesc.ERROR_SAVE_LIST_PARENTS}`, Etask.SAVE_LIST_PARENTS);
      
      let task: ITaskError = {
        name: Etask.CREATE,
        description: ETaskDesc.ERROR_SAVE_LIST_PARENTS
      }
      await this._serviceError.createServiceError(error, task);  
    }finally{
      if(spanIn) spanIn.end();
    } 

  }

  /**
   * Operación para guardar los padres
   * @param data Arreglo con la lista de padres
   * @returns Confirmación de creación de registros
   */
  async saveListParentsCollection(data: any){
    return this.parentsTemporaryModel.insertMany(data);
  }

  /**
   * Operación para buscar los padres
   * @returns Confirmación de la busqueda de registros
   */
  async findParentsCollection(){
    return this.parentsTemporaryModel.find().lean();
  }

  /**
   * Operacion para limpiar o borrar las colecciones
   * @returns {Boolean} Confirmación de la eliminación
   */  
  async deleteCollection(): Promise<any> {
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(ParentsChildsModel.name, MappingApiRest.DB,'deleteCollection',Etask.APM);
      const DATA_PARENTS = this.parentsChildsModel.deleteMany({}); 
      this.createLog('', START_TIME, Etask.DELETE_FEATURES);
      return DATA_PARENTS;
    } finally{
      if(spanIn) spanIn.end();
    }  
  }

   /**
   * Operación para crear log
   * @param {Object} request 
   * @param startTime 
   * @param {Etask} task Tarea realizada
   */
   async createLog(request: any, startTime: any, task: Etask){
    // Calcular el tiempo transcurrido
    const endTime = process.hrtime(startTime);
    const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
    this.logger.write(`Consultando información - tiempo de ejecución createLog()`, task, request, '', executionTime);
  }


}