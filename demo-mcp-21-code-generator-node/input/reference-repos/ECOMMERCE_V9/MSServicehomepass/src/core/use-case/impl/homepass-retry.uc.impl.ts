/**
 * Clase que se implementa para ejecucion del Job directamente a BD
 * @author Juan David Marin
 */
import { Echannel, EstateTransaction, StateHHPP } from '../../../common/utils/enums/params.enum';
import { EStatusTracingGeneral, ETaskTracingGeneral } from '../../../common/utils/enums/tracing.enum';
import { Etask, ETaskDesc } from '../../../common/utils/enums/task.enum';
import { ETaskMessageGeneral } from '../../../common/utils/enums/message.enum';
import { ICusRequestHomePassProvider } from '../../../data-provider/cusRequestHomePass.provider';
import { IHomePassRetryUc } from '../homepass-retry.uc';
import { IMappingLegadosUc } from '../resource/mapping-legaos.resource.uc';
import { Injectable } from '@nestjs/common';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import { LegadosJob } from '../../../common/utils/enums/legadosJob.enum';
import * as crypto from 'node:crypto';
import generalConfig from '../../../common/configuration/general.config';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';

@Injectable()
export class HomePassRetryUcimpl implements IHomePassRetryUc {
  private readonly logger = new Logging(HomePassRetryUcimpl.name);
  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _cusRequestHomePassProvider: ICusRequestHomePassProvider,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  /**
   * Firma del metodo para ejecutar el Job directamente a BD
   * @returns una promesa
   */
  async getStateHomePass() {
    try {
      let fechaUltimosDias = new Date();
      fechaUltimosDias.setDate(fechaUltimosDias.getDate() - Number(generalConfig.UltimosDiasConsulta));

      let traceability;
      const getCusRequestHomePass = await this._cusRequestHomePassProvider.getCusRequestHomePass({
        $and: [{ stateTransaction: EstateTransaction.PENDIENTE }, { isMigratedUser: false }, { createdAt: { $gte: fechaUltimosDias, $lte: new Date() } }],
      });

      if (getCusRequestHomePass.length > 0 && !(getCusRequestHomePass instanceof Error)) {
        await this.getCusRequestHomepassError(getCusRequestHomePass);
      } else {
        /*
               NO SE ENCONTRO DATA EN BASE DE DATOS  
                */
        this.logger.write('NOT FOUND CUSREQUESTHOMEPASS ', Etask.NOT_FOUND_CUSREQUESTHOMEPASS, ELevelsErrors.INFO, getCusRequestHomePass, null);
        traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
        traceability.setTransactionId(GeneralUtil.getCorrelationalId)
        traceability.setStatus(EStatusTracingGeneral.STATUS_FAILED);
        traceability.setDescription(Etask.NOT_FOUND_CUSREQUESTHOMEPASS);
        traceability.setTask(ETaskTracingGeneral.GET_CUSREQUESTHOMEPASS);
        await this._serviceTracing.createServiceTracing(traceability.getTraceability());
        return 50;
      }

      return 50;
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.GET_STATE_HOMEPASS, ETaskDesc.GET_STATEHOMEPASS);
      throw error;
    }
  }

  /**
   * Metodo para ejecutar las solicitudes con estado iniciado
   * @param {any} element data a usar en el flujo
   * @param {any} traceability trazabilidad
   * @param {any} getCusRequestHomePass respuesta del legado
   * @returns una promesa
   */
  async estadoIniciado(element: any, traceability: any, getCusRequestHomePass: any) {
    let bodyCrearSolicitudInspira = {
      headerRequest: {
        requestDate: element.cmtRequestCrearSolicitud[0].customer.requestDate,
      },
      user: element.cmtRequestCrearSolicitud[0].customer.user,
      cmtRequestCrearSolicitudInspira: {
        observaciones: 'prueba crear solicitud diferente de DTH',
        contacto: element.cmtRequestCrearSolicitud[0].customer.customerInfo.firstname + element.cmtRequestCrearSolicitud[0].customer.customerInfo.lastname,
        telefonoContacto: element.cmtRequestCrearSolicitud[0].customer.customerInfo.mediumCharacteristic.phoneNumber,
        canalVentas: Echannel.EC9_B2C,
        drDireccion: {
          barrio: element.address[0].geographicAddressList.geographicAddress[0].neighborhood,
          barrioTxtBM: element.address[0].geographicAddressList.geographicAddress[0].neighborhood,
          bisViaGeneradora: element.address[0].geographicAddressList.geographicAddress[0].streetBisGenerator,
          bisViaPrincipal: element.address[0].geographicAddressList.geographicAddress[0].streetBis,
          cpTipoNivel1: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel1Type,
          cpTipoNivel2: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel2Type,
          cpTipoNivel3: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel3Type,
          cpTipoNivel4: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel4Type,
          cpTipoNivel5: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel5Type,
          cpTipoNivel6: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel6Type,
          cpValorNivel1: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel1Value,
          cpValorNivel2: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel2Value,
          cpValorNivel3: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel3Value,
          cpValorNivel4: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel4Value,
          cpValorNivel5: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel5Value,
          cpValorNivel6: element.address[0].geographicAddressList.geographicAddress[0].complements.nivel6Value,
          cuadViaGeneradora: element.address[0].geographicAddressList.geographicAddress[0].streetBlockGenerator,
          cuadViaPrincipal: element.address[0].geographicAddressList.geographicAddress[0].streetBlock,
          dirEstado: element.stateHHPP,
          dirPrincAlt: element.address[0].geographicAddressList.geographicAddress[0].streetAlt,
          estadoDirGeo: element.address[0].geographicAddressList.geographicAddress[0].geoState,
          estadoRegistro: 0,
          estrato: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList.map((x: any) =>
            x.orderRef.subOrderRefList.map((y: any) => y.subOrderRef.shippingRef.strata),
          )[0][0],
          fechaCreacion: '',
          fechaEdicion: '',
          id: element.idAddress,
          idDirCatastro: element.address[0].geographicAddressList.geographicAddress[0].cadastreId,
          idSolicitud: '',
          idTipoDireccion: element.address[0].geographicAddressList.geographicAddress[0].type,
          itTipoPlaca: element.address[0].geographicAddressList.geographicAddress[0].plateTypeLt,
          itValorPlaca: element.address[0].geographicAddressList.geographicAddress[0].plateValueLt,
          letra3G: element.address[0].geographicAddressList.geographicAddress[0]['word3G'],
          ltViaGeneradora: element.address[0].geographicAddressList.geographicAddress[0].streetLtGenerator,
          ltViaPrincipal: element.address[0].geographicAddressList.geographicAddress[0].streetLt,
          mzTipoNivel1: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel1Type,
          mzTipoNivel2: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel2Type,
          mzTipoNivel3: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel3Type,
          mzTipoNivel4: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel4Type,
          mzTipoNivel5: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel5Type,
          mzTipoNivel6: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel6Type,
          mzValorNivel1: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel1Value,
          mzValorNivel2: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel2Value,
          mzValorNivel3: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel3Value,
          mzValorNivel4: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel4Value,
          mzValorNivel5: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel5Value,
          mzValorNivel6: element.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel6Value,
          nlPostViaG: element.address[0].geographicAddressList.geographicAddress[0].streetNlPostViaG,
          nlPostViaP: element.address[0].geographicAddressList.geographicAddress[0].streetNlPostViaP,
          numViaGeneradora: element.address[0].geographicAddressList.geographicAddress[0].streetNrGenerator,
          numViaPrincipal: element.address[0].geographicAddressList.geographicAddress[0].streetNr,
          perfilCreacion: '',
          perfilEdicion: '',
          placaDireccion: element.address[0].geographicAddressList.geographicAddress[0].plate,
          tipoViaGeneradora: element.address[0].geographicAddressList.geographicAddress[0].streetTypeGenerator,
          tipoViaPrincipal: element.address[0].geographicAddressList.geographicAddress[0].streetType,
          usuarioCreacion: '',
          usuarioEdicion: '',
        },
        cmtCityEntityDto: {
          estratoDir: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.strata,
          estadoDir: element.stateHHPP,
        },
      },
      tipoTecnologia: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList.map((x: any) =>
        x.orderRef.subOrderRefList.map((y) => y.subOrderRef.shippingRef.technology),
      )[0][0],
      codigoDane: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList.map((x: any) =>
        x.orderRef.subOrderRefList.map((y: any) => y.subOrderRef.shippingRef.daneCodeCity),
      )[0][0],
      idCasoTcrm: element.idCaseTcrm,
    };

    this.logger.write('Request crearSolicitudInspira', Etask.CONSULTANDO_ADDRESS_CREARSOLICITUDINSPIRA, ELevelsErrors.INFO, bodyCrearSolicitudInspira);
    const consultAddress = await this._mappingLegados.consumerLegadoRest(bodyCrearSolicitudInspira, generalConfig.controllerPutCrearSolicitudInspira);

    if (consultAddress.data.messageType === 'I') {
      traceability.setStatus(EStatusTracingGeneral.STATUS_PENDIENTE);
      traceability.setDescription(ETaskMessageGeneral.SENDORDER);
      traceability.setTask(ETaskTracingGeneral.TRACING_SENDORDER);
      traceability.setIdCaseTcrm(getCusRequestHomePass.idCaseTcrm);
      traceability.setResponse(consultAddress);
      traceability.setRequest(bodyCrearSolicitudInspira);
      traceability.setServiceid(generalConfig.controllerPutCrearSolicitudInspira);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId)

      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
      //ALMACENAR RESPUESTA EN coll_service_error

      let dataUpdate = {
        updateAt: new Date(),
        stateTransaction: EstateTransaction.PENDIENTE,
        response: [consultAddress.data],
      };
      let updateDb = await this._cusRequestHomePassProvider.updateCusRequestHomePass({ idCaseTcrm: element.idCaseTcrm }, dataUpdate);
      await this.insertTraceability(updateDb, element);
    } else {
      traceability.setTransactionId(GeneralUtil.getCorrelationalId)
      traceability.setStatus(EStatusTracingGeneral.STATUS_FAILED);
      traceability.setDescription(ETaskMessageGeneral.SENDORDER);
      traceability.setTask(ETaskTracingGeneral.TRACING_SENDORDER);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      traceability.setResponse(consultAddress);
      traceability.setRequest(bodyCrearSolicitudInspira);
      traceability.setServiceid(generalConfig.controllerPutCrearSolicitudInspira);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    }
  }

  /**
   * Metodo para ejecutar las solicitudes con estado finalizado
   * @param {any} element data a usar en el flujo
   * @param {any} buscarSolicitudPorIdSolicitud respuesta legado buscarSolicitudPorIdSolicitud
   * @returns una promesa
   */
  async estadoFinalizado(element, buscarSolicitudPorIdSolicitud) {
    let traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
    traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
    traceability.setDescription(ETaskMessageGeneral.HHPP_CREADO_Y_ESTADO_FINALIZADO);
    traceability.setTask(ETaskTracingGeneral.CONSUMIR_CMATRICES);
    traceability.setTransactionId(GeneralUtil.getCorrelationalId)
    traceability.setIdCaseTcrm(element.idCaseTcrm);
    this._serviceTracing.createServiceTracing(traceability.getTraceability());
    let UpdateBuscarSolicitudPorIdSolicitud = {
      stateHHPP: buscarSolicitudPorIdSolicitud.data.resultado,
      stateTransaction: buscarSolicitudPorIdSolicitud.data.estado,
    };

    const updateDbBuscarSolicitud = await this._cusRequestHomePassProvider.updateCusRequestHomePass(
      { idCaseTcrm: element.idCaseTcrm },
      UpdateBuscarSolicitudPorIdSolicitud,
    );
    await this.insertTraceability(updateDbBuscarSolicitud, element);

    let numOrdenCapacity = '';
    let getDate = element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.date;
    let formatDate = new Date(getDate);
    let consultDate = formatDate.toISOString();

    let dateNow = new Date();
    let dateFormat = dateNow.toISOString();
    let arrayDate = [];
    let thirtyDays, subtraction, thirtyDaysAgo;
    for (let dayPlys = 0; dayPlys < 6; dayPlys++) {
      thirtyDays = 1000 * 60 * 60 * 24 * dayPlys;
      subtraction = new Date().getTime() + thirtyDays;
      thirtyDaysAgo = new Date(subtraction);
      arrayDate.push({
        value: thirtyDaysAgo.toISOString(),
      });
    }

    let bodyCapacity = {
      isMigratedUser: element.isMigratedUser,
      transactionId: String(numberRandom()),
      system: Echannel.EC9_B2C,
      user: LegadosJob.USER,
      password: LegadosJob.PASSWORD,
      requestDate: dateFormat,
      ipApplication: element.cmtRequestCrearSolicitud[0].customer.ip,
      orderId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.id,
      documentId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.id,
      documentType: element.cmtRequestCrearSolicitud[0].customer.customerInfo.idType,
      addressId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.addressId,
      apptNumber: '0',
      scId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.scId,
      dateList: {
        date: arrayDate,
      },
      locationList: {
        location: [
          {
            id: LegadosJob.DCE021,
          },
        ],
      },
    };
    const responseCapacity = await this._mappingLegados.consumerLegadoRestJOB(bodyCapacity, generalConfig.apiCapacity);
    this.logger.write('Request post MSAppointAdmin Capacity ', Etask.REQUEST_MS_APPOINT_ADMIN_CAPACITY, ELevelsErrors.INFO, bodyCapacity, responseCapacity);
    if (responseCapacity.executed === false) {
      traceability.setStatus(EStatusTracingGeneral.STATUS_FAILED);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.CAPACITY);
      traceability.setTask(ETaskTracingGeneral.TRACING_CAPACITY);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      traceability.setResponse(responseCapacity);
      traceability.setRequest(bodyCapacity);
      traceability.setServiceid(generalConfig.apiCapacity);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    } else {
      traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.CAPACITY);
      traceability.setTask(ETaskTracingGeneral.TRACING_CAPACITY);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      traceability.setResponse(responseCapacity);
      traceability.setRequest(bodyCapacity);
      traceability.setServiceid(generalConfig.apiCapacity);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
      numOrdenCapacity = responseCapacity?.data?.capacitiesList?.capacity[0].apptNumber; // ajuste del  CapacityResponse\body\capacitiesList\capacity[]\\apptNumber
    }

    /*  consumo del CreateOrder */
    let closeAnswer = '2019-10-26 13:00:00';
    let timeSlot = '2019-10-28 01:00:00';
    let fullName = element.cmtRequestCrearSolicitud[0].customer.customerInfo.firstname + element.cmtRequestCrearSolicitud[0].customer.customerInfo.lastname;
    let bodyCreateOrder = {
      isMigratedUser: element.isMigratedUser,
      transactionId: String(numberRandom()),
      system: Echannel.EC9_B2C,
      user: LegadosJob.USER,
      orderId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.id,
      password: LegadosJob.PASSWORD,
      requestDate: consultDate,
      ipApplication: element.cmtRequestCrearSolicitud[0].customer.ip,
      orderDate: consultDate,
      appointmentList: {
        appointment: [
          {
            externalId: LegadosJob.DNA102,
            scId: element.cmtRequestCrearSolicitud[0].customer.customerInfo.scId,
            apptNumber: numOrdenCapacity,
            customerInfo: {
              documentType: element.cmtRequestCrearSolicitud[0].customer.customerInfo.idType,
              document: element.cmtRequestCrearSolicitud[0].customer.customerInfo.id,
              customerNumber: element.cmtRequestCrearSolicitud[0].customer.customerInfo.id,
              fullName: fullName,
              email: element.cmtRequestCrearSolicitud[0].customer.customerInfo.mediumCharacteristic.emailAddress,
              phoneNumber: element.cmtRequestCrearSolicitud[0].customer.customerInfo.mediumCharacteristic.phoneNumber,
              phone: element.cmtRequestCrearSolicitud[0].customer.customerInfo.mediumCharacteristic.phoneNumber,
            },
            geographicAddress: {
              address: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.address,
              city: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.city,
              province: element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.province,
              provinceDaneCode:
                element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef.daneCodeProvince,
              villageCenterDaneCode:
                element.cmtRequestCrearSolicitud[0].customer.customerInfo.orderRefList[0].orderRef.subOrderRefList[0].subOrderRef.shippingRef
                  .villageCenterDaneCode,
              postCode: '001',
              latitude: '4.68724139',
              longitude: '-74.06618021',
            },
            slaWindowStart: closeAnswer,
            slaWindowEnd: closeAnswer,
            timeSlot: timeSlot,
          },
        ],
      },
    };
    const responseCreateOrder = await this._mappingLegados.consumerLegadoRestJOB(bodyCreateOrder, generalConfig.apiCreateOrder);
    this.logger.write(
      'Request PUT MSAppointAdmin CreateOrder',
      Etask.REQUEST_MS_APPOINT_ADMIN_CREATE_ORDER,
      ELevelsErrors.INFO,
      bodyCapacity,
      responseCreateOrder,
    );
    if (responseCreateOrder.executed === false) {
      traceability.setStatus(EStatusTracingGeneral.STATUS_FAILED);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.CREATEORDER);
      traceability.setTask(ETaskTracingGeneral.TRACING_CREATE_ORDER);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      traceability.setResponse(responseCreateOrder);
      traceability.setRequest(bodyCreateOrder);
      traceability.setServiceid(generalConfig.apiCreateOrder);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    } else {
      traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.CREATEORDER);
      traceability.setTask(ETaskTracingGeneral.TRACING_CREATE_ORDER);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      traceability.setResponse(responseCreateOrder);
      traceability.setRequest(bodyCreateOrder);
      traceability.setServiceid(generalConfig.apiCreateOrder);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    }
  }

  /**
   * Metodo que se ejecuta en caso de que getCusRequestHomepass refleje un error
   * @param {any} getCusRequestHomePass respuesta del legado
   * @returns una promesa
   */
  async getCusRequestHomepassError(getCusRequestHomePass: any) {
    let traceability_2;
    let traceability;
    this.logger.write('JOB getCusRequestHomePass', Etask.FIND_CUSREQUESTHOMEPASS, ELevelsErrors.INFO, getCusRequestHomePass, null);
    traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
    traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
    traceability.setTransactionId(GeneralUtil.getCorrelationalId);
    traceability.setDescription(ETaskMessageGeneral.DATOS_FOUND_CUSREQUESTHOMEPASS);
    traceability.setTask(ETaskTracingGeneral.GET_CUSREQUESTHOMEPASS);
    traceability.setResponse(getCusRequestHomePass);
    await this._serviceTracing.createServiceTracing(traceability.getTraceability());

    getCusRequestHomePass.forEach(async (element) => {
      const bodyBuscarSolicitudPorIdSolicitud = {
        user: element.cmtRequestCrearSolicitud[0].customer.user,
        sourceAplication: Echannel.EC9_B2C,
        destinationAplication: 'MGL',
        idSolicitudRequest: element.response[0].idSolicitud,
        tipoSolicitud: 'HHPP',
        idTcrmRequest: element.idCaseTcrm,
      };

      let buscarSolicitudPorIdSolicitud = await this._mappingLegados.consumerLegadoRest(
        bodyBuscarSolicitudPorIdSolicitud,
        generalConfig.apiCMatricesAs400_buscarSolicitudPorIdSolicitud,
      );
      if (buscarSolicitudPorIdSolicitud.executed) {
        this.logger.write(
          'Request put CMatrices buscarSolicitudPorIdSolicitud',
          Etask.REQUEST_CMATRICES_BUSCAR_SOLICITUD_POR_ID_SOLICITUD,
          ELevelsErrors.INFO,
          bodyBuscarSolicitudPorIdSolicitud,
          buscarSolicitudPorIdSolicitud,
        );
        traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
        traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
        traceability.setTransactionId(GeneralUtil.getCorrelationalId);
        traceability.setDescription(ETaskMessageGeneral.PUT_BUSCAR_SOCILITUD_POR_Id_SOLICITUD);
        traceability.setTask(ETaskTracingGeneral.CONSUMIR_CMATRICES);
        traceability.setIdCaseTcrm(element.idCaseTcrm);
        traceability.setResponse(buscarSolicitudPorIdSolicitud);
        traceability.setRequest(bodyBuscarSolicitudPorIdSolicitud);
        traceability.setServiceid(generalConfig.apiCMatricesAs400_buscarSolicitudPorIdSolicitud);
        await this._serviceTracing.createServiceTracing(traceability.getTraceability());

        if (
          buscarSolicitudPorIdSolicitud.data.estado === EstateTransaction.FINALIZADO &&
          buscarSolicitudPorIdSolicitud.data.resultado === StateHHPP.HHPP_CREADO
        ) {
          await this.estadoFinalizado(element, buscarSolicitudPorIdSolicitud);
        } else {
          traceability_2 = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
          traceability_2.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
          traceability_2.setTransactionId(GeneralUtil.getCorrelationalId);
          traceability_2.setDescription(ETaskMessageGeneral.HHPP_PENDIENTE_Y_ESTADO_VACIO);
          traceability_2.setTask(ETaskTracingGeneral.CONSUMIR_CMATRICES);
          traceability_2.setIdCaseTcrm(element.idCaseTcrm);

          await this._serviceTracing.createServiceTracing(traceability_2.getTraceability());

          const dataUpdateCmtRequestCrearSolicitud = {
            updateAt: new Date(),
            stateHHPP: buscarSolicitudPorIdSolicitud.data.resultado,
            stateTransaction: buscarSolicitudPorIdSolicitud.data.estado,
          };
          let updateDb = await this._cusRequestHomePassProvider.updateCusRequestHomePass(
            { idCaseTcrm: element.idCaseTcrm },
            dataUpdateCmtRequestCrearSolicitud,
          );
          await this.insertTraceability(updateDb, element);

          if (buscarSolicitudPorIdSolicitud.data.estado === EstateTransaction.INICIADO) {
            await this.estadoIniciado(element, traceability, getCusRequestHomePass);
          }
        }
      } else {
        /*
                    TIMEOUT LEGADO  
                     */
        traceability_2 = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
        traceability_2.setStatus(EStatusTracingGeneral.STATUS_FAILED);
        traceability_2.setTransactionId(GeneralUtil.getCorrelationalId);
        traceability_2.setDescription(ETaskMessageGeneral.TIMEOUT_CMATRICES);
        traceability_2.setTask(ETaskTracingGeneral.CONSUMIR_CMATRICES);
        traceability_2.setIdCaseTcrm(element.idCaseTcrm);
        traceability.setResponse(buscarSolicitudPorIdSolicitud);
        await this._serviceTracing.createServiceTracing(traceability_2.getTraceability());
      }
    });
  }

  /**
   * Metodo para insertar trazabilidad
   * @param {any} updateDb data a insertar
   * @param {any} element data a insertar
   * @returns una promesa
   */
  async insertTraceability(updateDb: any, element: any) {
    let traceability;
    if (updateDb) {
      traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
      traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.DATOS_UPDATE_CUSREQUESTHOMEPASS);
      traceability.setTask(ETaskTracingGeneral.UPDATE_CUSREQUESTHOMEPASS);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    } else {
      traceability = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
      traceability.setStatus(EStatusTracingGeneral.STATUS_FAILED);
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setDescription(ETaskMessageGeneral.DATOS_UPDATE_CUSREQUESTHOMEPASS);
      traceability.setTask(ETaskTracingGeneral.UPDATE_CUSREQUESTHOMEPASS);
      traceability.setIdCaseTcrm(element.idCaseTcrm);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
    }
  }
}

/**
 * funcion utilizada para generar un numero aleatorio
 * @returns un numero aleatorio
 */
function numberRandom() {
  return crypto.randomInt(10000000, 99999999);
}
