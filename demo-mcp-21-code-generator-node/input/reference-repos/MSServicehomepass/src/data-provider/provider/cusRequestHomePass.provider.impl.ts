/**
 * Clase que se implementa para realizar las operaciones relacionadas a CusRequestHomePass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICusRequestHomePass } from '../../core/entity/cusRequestHomePass/cusRequestHomePass.entity';
import { ICusRequestHomePassProvider } from '../cusRequestHomePass.provider';
import { CusRequestHomePassModel } from '../model/CusRequestHomepass/cusRequestHomePass.model';
import { IServiceErrorUc } from '../../core/use-case/resource/service-error.resource.uc';
import { Etask, ETaskDesc } from '../../common/utils/enums/task.enum';
import Logging from '../../common/lib/logging';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import GeneralUtil from 'src/common/utils/generalUtil';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';

@Injectable()
export class CusRequestHomePassProvider implements ICusRequestHomePassProvider {
  private readonly logger = new Logging(CusRequestHomePassProvider.name);

  constructor(
    @InjectModel(CusRequestHomePassModel.name)
    private readonly cusRequestHomePassModel: Model<CusRequestHomePassModel>,
    public readonly _serviceError: IServiceErrorUc,
    private readonly _serviceTracingUc: IServiceTracingUc,
  ) {}

  /**
   * Metodo para obtener un registo en CusRequestHomePass
   * @param {any} filter Filtro a aplicar en la busqueda
   * @returns una promesa
   */
  async getCusRequestHomePass(filter: any): Promise<any> {
    this.logger.write('Request ejecución BD', Etask.GET_CUSREQUESTHOMEPASS, ELevelsErrors.INFO, filter);
    this._serviceTracingUc.createServiceTracing(GeneralUtil.traceabilityForMongoDB(filter, Etask.GET_CUSREQUESTHOMEPASS));
    let spanIn: any;
    try {
      const startTime = process.hrtime();
      spanIn = APM.startSpan(CusRequestHomePassModel.name, MappingApiRest.DB,'getCusRequestHomePass',Etask.APM);
        
      const response = await this.cusRequestHomePassModel.find(filter).exec();
      if(spanIn) spanIn.end();
      const endTime = process.hrtime(startTime);
      const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
      this.logger.write('Resultado ejecución BD', Etask.GET_CUSREQUESTHOMEPASS, ELevelsErrors.INFO, filter, response, executionTime);
      this._serviceTracingUc.createServiceTracing(GeneralUtil.traceabilityForMongoDB(filter, Etask.GET_CUSREQUESTHOMEPASS, response, executionTime));
      return response;
    } catch (error) {
      if(spanIn) spanIn.end();
      GeneralUtil.assignTaskError(error, Etask.GET_CUSREQUESTHOMEPASS, ETaskDesc.GET_CUSREQUESTHOMEPASS);
      throw error;
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Firma del metodo para actualizar un registro en CusRequestHomePass
   * @param {any} filter Filtro a aplicar en la busqueda
   * @param {any} data Data a registrar
   */
  async updateCusRequestHomePass(filter: any, data: any): Promise<any> {
    this.logger.write('Request ejecución BD', Etask.UPDATE_WITH_IDCASETCRM, ELevelsErrors.INFO, { filter, data });
    this._serviceTracingUc.createServiceTracing(GeneralUtil.traceabilityForMongoDB({ filter, data }, Etask.UPDATE_WITH_IDCASETCRM));
    let spanIn: any;
    try {
      const startTime = process.hrtime();

      spanIn = APM.startSpan(CusRequestHomePassModel.name, MappingApiRest.DB,'updateCusRequestHomePass',Etask.APM);
      const response = await this.cusRequestHomePassModel
        .findOneAndUpdate(filter, {
          $set: data,
        })
        .exec();
      if(spanIn) spanIn.end();
      const endTime = process.hrtime(startTime);
      const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
      this.logger.write('Resultado ejecución BD', Etask.UPDATE_WITH_IDCASETCRM, ELevelsErrors.INFO, { filter, data }, response, executionTime);
      this._serviceTracingUc.createServiceTracing(GeneralUtil.traceabilityForMongoDB({ filter, data }, Etask.UPDATE_WITH_IDCASETCRM, response, executionTime));
      return response;
    } catch (error) {
      if(spanIn) spanIn.end();
      GeneralUtil.assignTaskError(error, Etask.UPDATE_WITH_IDCASETCRM, ETaskDesc.UPDATE_WITH_IDCASETCRM);
      throw error;
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Metodo para crear un registro en CusRequestHomePass
   * @param {any} CusRequestHomePass Data a registrar
   * @param {any} user Data a registrar
   * @param {String} codigoDane Data a registrar
   * @param {any} idCaseTcrm Data a registrar
   * @param {any} booleansData Data a registrar
   * @param {any} bodyRequest Data a registrar
   * @param {any} idAddress Data a registrar
   * @returns una promesa
   */
  async createCusRequestHomePassGeneral(
    CusRequestHomePass: any,
    user: string,
    codigoDane: any,
    booleansData: any,
    bodyRequest: any,
    idObj: any,
    message: any,
  ): Promise<ICusRequestHomePass> {
    let spanIn: any;
    try {
      const idReq: string = idObj.idRequest;
      const idReqF= idReq.split('-')
      const startTime = process.hrtime();
      CusRequestHomePass.user = user;
      CusRequestHomePass.message = message;
      CusRequestHomePass.sourceAplication = 'ECOM';
      CusRequestHomePass.destinationAplication = 'MGL';
      CusRequestHomePass.daneCode = codigoDane;
      CusRequestHomePass.idCaseTcrm = idObj.idCaseTcrm;
      CusRequestHomePass.cmtRequestCrearSolicitud = [];
      CusRequestHomePass.idAddress = idObj.idAddress;
      CusRequestHomePass.idRequest = idReqF[1];
      CusRequestHomePass.address = bodyRequest;
      CusRequestHomePass.stateHHPP = booleansData.stateHHPP; // TODVALIDAR
      CusRequestHomePass.stateTransaction = 'INICIADO'; //ENUM
      CusRequestHomePass.createdAt = new Date();
      CusRequestHomePass.updateAt = new Date();
      CusRequestHomePass.isMigratedUser = booleansData.isMigratedUser;
      const _cusRequestHomePassModel = new this.cusRequestHomePassModel(CusRequestHomePass);
      this.logger.write('Request ejecución BD', Etask.CREATE_CUSREQUEST_HOMEPASS_GENERAL, ELevelsErrors.INFO, _cusRequestHomePassModel);
      this._serviceTracingUc.createServiceTracing(GeneralUtil.traceabilityForMongoDB(_cusRequestHomePassModel, Etask.CREATE_CUSREQUEST_HOMEPASS_GENERAL));
      spanIn = APM.startSpan(CusRequestHomePassModel.name, MappingApiRest.DB,'createCusRequestHomePassGeneral',Etask.APM);
      if(spanIn) spanIn.end();
      const response = await this.cusRequestHomePassModel.create(_cusRequestHomePassModel);
      const endtime = process.hrtime(startTime);
      const executionTime = Math.round(endtime[0] * 1000 + endtime[1] / 1000000);
      this.logger.write(
        'Request ejecución BD',
        Etask.CREATE_CUSREQUEST_HOMEPASS_GENERAL,
        ELevelsErrors.INFO,
        _cusRequestHomePassModel,
        response,
        executionTime,
      );
      this._serviceTracingUc.createServiceTracing(
        GeneralUtil.traceabilityForMongoDB(_cusRequestHomePassModel, Etask.CREATE_CUSREQUEST_HOMEPASS_GENERAL, response, executionTime),
      );
      return response;
    } catch (error) {
      if(spanIn) spanIn.end();
      GeneralUtil.assignTaskError(error, Etask.CREATE_CUSREQUEST_HOMEPASS_GENERAL, ETaskDesc.CREATE_CUSREQUEST_HOMEPASS_GENERAL);
      throw error;
    }finally{
      if(spanIn) spanIn.end();
    }
  }
}
