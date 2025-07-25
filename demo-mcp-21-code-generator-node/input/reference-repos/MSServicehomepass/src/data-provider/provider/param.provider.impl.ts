/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_params
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IParamProvider } from '../param.provider';
import * as moment from 'moment';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/task.enum';
import { ParamModel, IParam, ETask, GlobalStorageUtil } from '@claro/generic-models-library';
import Logging from 'src/common/lib/logging';
import { IServiceTracingProvider } from '../service-tracing.provider';
import databaseConfig from 'src/common/configuration/database.config';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import Traceability from 'src/common/lib/traceability';
import { EStatusTracingGeneral } from 'src/common/utils/enums/tracing.enum';

@Injectable()
export class ParamProvider implements IParamProvider {
  private readonly logger = new Logging(ParamProvider.name);
  constructor(@InjectModel(ParamModel.name) private readonly paramModel: Model<ParamModel>,private readonly _serviceTracing: IServiceTracingProvider) {}

  onModuleInit() {
    this.loadParams();
    if (databaseConfig.mongoReplicaSet) this.watchChanges();
  }

  /**
   * Observador de cambios en la coleccion
   */
  watchChanges() {
    try {
      const observable = this.paramModel.watch();
      observable.on('change', (info: any) => {
        this.logger.write(
          `Inicio detección de cambios en la colección de parámetros`,
          Etask.LOAD_PARAM,
          ELevelsErrors.INFO,
          null,
          info
        );
        const traceability = new Traceability({});
        traceability.setTransactionId('9999');
        traceability.setTask('OBSERVABLE (detección de cambios en la colección de parámetros)' + Etask.LOAD_PARAM);
        traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
        traceability.setRequest('change');
        traceability.setResponse(info);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
        this.loadParams();
      });
    } catch (error) {
      this.logger.write(
        `Error detectando cambios en la colección de parámetros`,
        Etask.LOAD_PARAM,
        ELevelsErrors.ERROR,
        null,
        error
      );
    }
  }

  /**
   * Función para cargar los parametros en las variables estaticas
   */
  async loadParams(): Promise<any> {
    let params: IParam[] = [];
    try {
      params = await this.paramModel.find().exec();
    } catch (error) {
      this.logger.write(`Error cargando parámetros`, ETask.LOAD_PARAM, ELevelsErrors.ERROR, null, error);
    } finally {
      GlobalStorageUtil.params = params;
    }
  }

  /**
   * Operación para consultar cantidad de registros
   * @param {Object} filter arreglo de campos a consultar
   * @returns {Number} total registros
   */
  async getTotal(filter: any): Promise<number> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'getTotal',Etask.APM);
        
        return this.paramModel.countDocuments(filter);
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar parametros según filtro
   * @param {Number} page Número de página a consultar
   * @param {Number} limit Cantidad de registros por página
   * @param {Object} filter arreglo de campos a consultar
   * @param {Object} projection arreglo de campos a devolver
   * @returns {Object} Información parametros
   */
  async getParams(page: number, limit: number, filter: any, projection: any = {}): Promise<IParam[]> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'getParams',Etask.APM);
        
        return this.paramModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar parametros por identificador
   * @param {String} id_param identificador de parametro
   * @returns {Object} Información parametros
   */
  async getParamByIdParam(id_param: string): Promise<IParam> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'getParamByIdParam',Etask.APM);
        return this.paramModel.findOne({ id_param });
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación de inserción de un parametro
   * @param {IParam} param arreglo con información del parametro
   * @returns {Boolean} estado resultado operacion
   */
  async createParams(param: IParam[]): Promise<boolean> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'createParams',Etask.APM);
      
      param.forEach((element) => {
        element.createdUser = 'admin'; // Pendiente de captura del usuario por sistema.
        element.updatedUser = 'admin'; // Pendiente de captura del usuario por sistema.
        element.createdAt = moment().format();
        element.updatedAt = moment().format();
      });

      await this.paramModel.insertMany(param);
      return true;
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación de actualización de un parametro
   * @param {IParam} param arreglo con información del parametro
   * @returns {Object} parametro actualizado
   */
  async updateParam(param: IParam): Promise<IParam> {
    return this.paramModel.findOneAndUpdate(
      {
        id_param: param.id_param,
      },
      {
        $set: {
          id_param: param.id_param,
          description: param.description,
          status: param.status,
          updatedUser: 'admin', // Pendiente de captura del usuario por sistema.
          updatedAt: moment().format(),
          values: param.values,
        },
      },
      {
        new: true,
      },
    );
  }
}
