/**
 * Clase que se implementa para realizar las respectivas consultas de informacion de hogares a legados
 * @author Juan David Marin
 */
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/task.enum';
import { EValidationHomepass, Estratum } from '../../../../common/utils/enums/homepass.enum';
import { ICusRequestHomePassProvider } from '../../../../data-provider/cusRequestHomePass.provider';
import { IHomePassUc } from '../homePass.uc';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { Injectable } from '@nestjs/common';
import { ValueConsult } from '../../../../common/utils/enums/params.enum';
import * as crypto from 'node:crypto';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import GeneralUtil from 'src/common/utils/generalUtil';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class HomePassUc implements IHomePassUc {
  private readonly logger = new Logging(HomePassUc.name);

  constructor(
    public _mappingLegados: IMappingLegadosUc,
    public _cusRequestHomePassProvider: ICusRequestHomePassProvider,
  ) {}

  /**
   * Firma del metodo utilizado para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {any} data Informacion ingresada por el usuario para validar cobertura
   * @returns una promesa
   */
  async initialFunction(data: any, channel: string) {
    this.logger.write('Inicio initialFunction()', Etask.CONSULT_HOMEPASS, ELevelsErrors.INFO, data);
    try {
      let booleansData = {
        isMigratedUser: data.isMigratedUser,
        stateHHPP: 'HHPP NO EXISTE',
      };
      let geographicAddress = data.geographicAddressList.geographicAddress[0];
      let consultaDireccion: any;
      let idDireccion: any;
      let returndireccionId: any;
      let dataResponse: any;
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      const redacDay = today.toISOString();
      //Mapero de legado.
      if (geographicAddress.idDetailAddress === undefined || geographicAddress.idDetailAddress === null || geographicAddress.idDetailAddress === '') {
        let body = await this.mapBodyConsult(data, channel, redacDay, geographicAddress);
        const exactaTabulada = await this._mappingLegados.consumerLegadoRest(body, generalConfig.consultaDireccionExactaTabulada);
        if (exactaTabulada.executed === false || exactaTabulada.data.messageType === 'E') {
          return {
            message: 'Error',
            code: '-1',
            description: (exactaTabulada?.data?.message? exactaTabulada.data.message: exactaTabulada.message) + ' ' + generalConfig.consultaDireccionExactaTabulada,
            source: 'CMatricesAs400Service - ConsultaDireccionExactaTabulada',
          };
        }
        let adresses = exactaTabulada?.data?.listAddresses;
        let validateListAddresses = adresses? adresses[0]: undefined;
        idDireccion = validateListAddresses?.splitAddres?.idDireccionDetallada;
        let flowPart1 = await this.flowPart1(validateListAddresses, data, channel, redacDay, returndireccionId, dataResponse, booleansData);
        if (flowPart1) {
          return flowPart1;
        } else {
          consultaDireccion = true;
        }
      } else {
        idDireccion = geographicAddress.idDetailAddress;
        consultaDireccion = true;
      }

      let bodyConsultaDireccion = {
        headerRequest: {
          transactionId: data.transactionId,
          system: ValueConsult.ECOMMERCE,
          requestDate: new Date(),
          ipApplication: data.ip,
        },
        idDireccion: idDireccion,
      };

      return this.consultaDireccionResponse(consultaDireccion, bodyConsultaDireccion, data, booleansData);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_HOMEPASS, ETaskDesc.CONSULT_HOMEPASS);
      throw error;
    }
  }

  /**
   * Metodo utilizado para dividir el flujo de homepass
   * @param {any} consultaDireccion Flag para saber si se consume el servicio
   * @param {any} bodyConsultaDireccion Data necesaria para consumo de legado
   * @param {any} data Data necesaria para consumo de legado
   * @param {any} booleansData Data necesaria para consumo de legado
   * @returns una promesa
   */
  async consultaDireccionResponse(consultaDireccion: any, bodyConsultaDireccion: any, data: any, booleansData: any) {
    this.logger.write('consultaDireccionResponse()', Etask.CONSULT_HOMEPASS, ELevelsErrors.INFO);
    if (consultaDireccion) {
      const ConsultaDireccion = await this._mappingLegados.consumerLegadoRest(bodyConsultaDireccion, generalConfig.consultaDireccion);
      if (ConsultaDireccion.executed !== true) {
        return {
          message: 'Error legacy',
          code: '-1',
          description: ConsultaDireccion.message + ' ' + generalConfig.consultaDireccion,
          source: 'AddressV2.1-ConsultaDireccion',
        };
      }
      if (ConsultaDireccion.data.messageType === 'E') {
        return {
          message: 'Error legacy',
          code: '-1',
          description: ConsultaDireccion.data.message + ' ' + generalConfig.consultaDireccion,
          source: 'AddressV2.1-ConsultaDireccion',
        };
      }

      let HhppsNotUndefined = await this.listHhppsIsNotUndefined(ConsultaDireccion);
      if (HhppsNotUndefined) {
        return HhppsNotUndefined;
      } else {
        let message= ConsultaDireccion?.data?.message;
        let idCaseTcrm = idCaseTcrmFunction();
        let user = data.user;
        let codigoDane = ConsultaDireccion.data.addresses.city.daneCode;
        let idRequest= idCaseTcrmFunction();
        let idObj= {
          idRequest: idRequest,
          idAddress: ConsultaDireccion.data.addresses.addressId,
          idCaseTcrm: idCaseTcrm,
        }
        const crearDB = await this._cusRequestHomePassProvider.createCusRequestHomePassGeneral(
          ConsultaDireccion,
          user,
          codigoDane,
          booleansData,
          data,
          idObj,
          message,
        );

        if (!crearDB) return { error: 'error creando base de datos' };
        return {
          message: 'Homepass no existe',
          geographicAddress: {
            idCaseTcrm: idCaseTcrm,
          },
          code: ConsultaDireccion.data.messageType,
          description: ConsultaDireccion.data.message,
          source: true,
        };
      }
    }
  }

  /**
   * Primer metodo utilizado para mapear el objeto SplitAddress
   * @param {any} element Data necesaria para mapeo
   * @returns {json} un objeto mapeado
   */
  async fillSplitAddress(element: any) {
    return {
      streetAlt: element.splitAddres.dirPrincAlt ? element.splitAddres.dirPrincAlt : '',
      neighborhood: element.splitAddres.barrio ? element.splitAddres.barrio : '',
      streetType: element.splitAddres.tipoViaPrincipal ? element.splitAddres.tipoViaPrincipal : '',
      streetNr: element.splitAddres.numViaPrincipal ? element.splitAddres.numViaPrincipal : '',
      streetSuffix: element.splitAddres.ltViaPrincipal ? element.splitAddres.ltViaPrincipal : '',
      streetNlPostViaP: element.splitAddres.nlPostViaP ? element.splitAddres.streetNlPostViaP : '',
      streetBis: element.splitAddres.bisViaPrincipal ? element.splitAddres.bisViaPrincipal : '',
      streetBlockGenerator: element.splitAddres.cuadViaPrincipal ? element.splitAddres.cuadViaPrincipal : '',
      streetTypeGenerator: element.splitAddres.tipoViaGeneradora ? element.splitAddres.tipoViaGeneradora : '',
      streetNrGenerator: element.splitAddres.numViaGeneradora ? element.splitAddres.numViaGeneradora : '',
      streetLtGenerator: element.splitAddres.ltViaGeneradora ? element.splitAddres.ltViaGeneradora : '',
      streetNlPostViaG: element.splitAddres.nlPostViaG ? element.splitAddres.nlPostViaG : '',
      streetBisGenerator: element.splitAddres.bisViaGeneradora ? element.splitAddres.bisViaGeneradora : '',
      streetName: element.splitAddres.cuadViaGeneradora ? element.splitAddres.cuadViaGeneradora : '',
      addressPlate: element.splitAddres.placaDireccion ? element.splitAddres.placaDireccion : '',
    };
  }

  /**
   * Segundo metodo utilizado para mapear el objeto SplitAddress
   * @param {any} element Data necesaria para mapeo
   * @returns {json} un objeto mapeado
   */
  async fillSplitAddress2(element: any) {
    return {
      type: element.splitAddres.idTipoDireccion ? element.splitAddres.idTipoDireccion : '',
      plateTypeLt: element.splitAddres.itTipoPlaca ? element.splitAddres.itTipoPlaca : '',
      plateValueLt: element.splitAddres.itValorPlaca ? element.splitAddres.itValorPlaca : '',
      cadastreId: element.splitAddres.idDirCatastro ? element.splitAddres.idDirCatastro : '',
      geoState: element.splitAddres.estadoDirGeo ? element.splitAddres.estadoDirGeo : '',
    };
  }

  /**
   * Metodo utilizado para mapear el objeto Complements
   * @param {any} element Data necesaria para mapeo
   * @returns {json} un objeto mapeado
   */
  async fillComplements(element: any) {
    return {
      nivel1Type: element.splitAddres.cpTipoNivel1 ? element.splitAddres.cpTipoNivel1 : '',
      nivel2Type: element.splitAddres.cpTipoNivel2 ? element.splitAddres.cpTipoNivel2 : '',
      nivel3Type: element.splitAddres.cpTipoNivel3 ? element.splitAddres.cpTipoNivel3 : '',
      nivel4Type: element.splitAddres.cpTipoNivel4 ? element.splitAddres.cpTipoNivel4 : '',
      nivel5Type: element.splitAddres.cpTipoNivel5 ? element.splitAddres.cpTipoNivel5 : '',
      nivel6Type: element.splitAddres.cpTipoNivel6 ? element.splitAddres.cpTipoNivel6 : '',
      nivel1Value: element.splitAddres.cpValorNivel1 ? element.splitAddres.cpValorNivel1 : '',
      nivel2Value: element.splitAddres.cpValorNivel2 ? element.splitAddres.cpValorNivel2 : '',
      nivel3Value: element.splitAddres.cpValorNivel3 ? element.splitAddres.cpValorNivel3 : '',
      nivel4Value: element.splitAddres.cpValorNivel4 ? element.splitAddres.cpValorNivel4 : '',
      nivel5Value: element.splitAddres.cpValorNivel5 ? element.splitAddres.cpValorNivel5 : '',
      nivel6Value: element.splitAddres.cpValorNivel6 ? element.splitAddres.cpValorNivel6 : '',
    };
  }

  /**
   * Metodo utilizado para mapear el objeto AlternateGeographics
   * @param {any} element
   * @returns {json} un objeto mapeado
   */
  async fillAlternate(element: any) {
    return {
      nivel1Type: element.splitAddres.mzTipoNivel1 ? element.splitAddres.mzTipoNivel1 : '',
      nivel2Type: element.splitAddres.mzTipoNivel2 ? element.splitAddres.mzTipoNivel2 : '',
      nivel3Type: element.splitAddres.mzTipoNivel3 ? element.splitAddres.mzTipoNivel3 : '',
      nivel4Type: element.splitAddres.mzTipoNivel4 ? element.splitAddres.mzTipoNivel4 : '',
      nivel5Type: element.splitAddres.mzTipoNivel5 ? element.splitAddres.mzTipoNivel5 : '',
      nivel6Type: element.splitAddres.mzTipoNivel6 ? element.splitAddres.mzTipoNivel6 : '',
      nivel1Value: element.splitAddres.mzValorNivel1 ? element.splitAddres.mzValorNivel1 : '',
      nivel2Value: element.splitAddres.mzValorNivel2 ? element.splitAddres.mzValorNivel2 : '',
      nivel3Value: element.splitAddres.mzValorNivel3 ? element.splitAddres.mzValorNivel3 : '',
      nivel4Value: element.splitAddres.mzValorNivel4 ? element.splitAddres.mzValorNivel4 : '',
      nivel5Value: element.splitAddres.mzValorNivel5 ? element.splitAddres.mzValorNivel5 : '',
      nivel6Value: element.splitAddres.mzValorNivel6 ? element.splitAddres.mzValorNivel6 : '',
    };
  }

  /**
   * Metodo utilizado para mapear de forma limpia el objeto listCoverMapClean
   * @param {any} dataResponseConsultaDireccion data a mapear
   * @returns un objeto mapeado
   */
  async funcCoverDataResponseConsultaDireccion(dataResponseConsultaDireccion: any) {
    return dataResponseConsultaDireccion.listCover.map(function (elem) {
      return {
        technology: elem.technology ? elem.technology : '',
        node: elem.node ? elem.node : '',
        state: elem.state ? elem.state : '',
        qualificationDate: elem.qualificationDate ? elem.qualificationDate : '',
      };
    });
  }

  /**
   * Metodo utilizado para mapear de forma limpia el objeto listHHPPSMapClean
   * @param {any} dataResponseConsultaDireccion data a mapear
   * @returns un objeto mapeado
   */
  async funcHHPPSDataResponseConsultaDireccion(dataResponseConsultaDireccion: any) {
    return dataResponseConsultaDireccion.listHhpps.map(function (elem) {
      return {
        id: elem.hhppId ? elem.hhppId : '',
        idQualificationTechnologyType: elem.qualificationDate ? elem.qualificationDate : '',
        rushCblType: elem.rushtype ? elem.rushtype : '',
        state: elem.state ? elem.state : '',
        technology: elem.technology ? elem.technology : '',
        nodes: {
          node: {
            nodeId: elem.node.nodeId ? elem.node.nodeId : '',
            state: elem.node.state ? elem.node.state : '',
            qualificationDate: elem.node.qualificationDate ? elem.node.qualificationDate : '',
            nodeName: elem.node.nodeName ? elem.node.nodeName : '',
            technology: elem.node.technology ? elem.node.technology : '',
          },
        },
      };
    });
  }

  /**
   * Metodo para utilizar en caso de que en la respuesta del legado ConsultaDireccionExactaTabulada, la etiqueta listHhpps sea igual a PO o DE
   * @param listHhpps informacion a mapear
   * @param response informacion a mapear
   * @param listCoverMapClean informacion a mapear
   * @param listHhppsMapClean informacion a mapear
   * @param fecha informacion a mapear
   * @returns una promesa
   */
  async case_PO_or_DE(listHhpps: any, response: any, listCoverMapClean: any, listHhppsMapClean: any, fecha: any) {
    if (
      (listHhpps.subCcmmTechnology?.state ? listHhpps.subCcmmTechnology.state : '') == '1' &&
      (listHhpps.subCcmmTechnology?.qualificationDate ? listHhpps.subCcmmTechnology.qualificationDate : 0) < fecha
    ) {
      if (listHhpps.subCcmmTechnology.tecnologyCcmmNode.state == generalConfig.CcmmNodeActivo) {
        return {
          message: EValidationHomepass.CON_COBERTURA,
          geographicAddress: await this.mapResponseHomepass(response, listCoverMapClean, listHhppsMapClean),
        };
      } else if (listHhpps.subCcmmTechnology.tecnologyCcmmNode.state == generalConfig.CcmmNodeInactivo) {
        return {
          message: EValidationHomepass.SIN_COBERTURA,
          geographicAddress: await this.mapResponseHomepass(response, listCoverMapClean, listHhppsMapClean),
        };
      }
    }
  }

  /**
   * Metodo para utilizar en caso de que en la respuesta del legado ConsultaDireccionExactaTabulada, la etiqueta listHhpps sea vacia
   * @param consultaDireccion informacion a mapear
   * @returns una promesa
   */
  async listHhppsIsNotUndefined(consultaDireccion: any) {
    if (consultaDireccion.data.addresses.listHhpps != undefined) {
      let dataResponseConsultaDireccion = consultaDireccion.data.addresses;
      let listCoverMapClean = await this.funcCoverDataResponseConsultaDireccion(dataResponseConsultaDireccion);
      let listHhppsMapClean = await this.funcHHPPSDataResponseConsultaDireccion(dataResponseConsultaDireccion);
      let listHhpps = consultaDireccion.data.addresses.listHhpps[0];

      if (consultaDireccion.data.addresses.stratum === Estratum.cod0) {
        return {
          message: EmessageMapping.VALIDACION_STRATUM,
          geographicAddress: await this.mapResponseHomepass(dataResponseConsultaDireccion, listCoverMapClean, listHhppsMapClean),
        };
      } else if(consultaDireccion.data.addresses.stratum === Estratum.codm1){
        return {
          message: EValidationHomepass.SIN_COBERTURA_STRATA_MINUSONE,
          geographicAddress: await this.mapResponseHomepass(dataResponseConsultaDireccion, listCoverMapClean, listHhppsMapClean),
        }
      }

      switch (listHhpps.state) {
        case 'CS': //CAMBIA
          return {
            message: EValidationHomepass.CON_SERVICIO,
            geographicAddress: await this.mapResponseHomepass(dataResponseConsultaDireccion, listCoverMapClean, listHhppsMapClean),
          };
        case 'PO':
        case 'DE':
          let response = consultaDireccion.data.addresses;
          listHhpps = response.listHhpps[0];
          const f = new Date();
          const fecha = f.getFullYear() + '/' + (f.getMonth() + 1) + '/' + f.getDate();
          let case_PO_or_DE = await this.case_PO_or_DE(listHhpps, response, listCoverMapClean, listHhppsMapClean, fecha);
          if (case_PO_or_DE) {
            return case_PO_or_DE;
          } else {
            if (listHhpps.node.state == generalConfig.nodeActivo) {
              return {
                message: EValidationHomepass.CON_COBERTURA,
                geographicAddress: await this.mapResponseHomepass(response, listCoverMapClean, listHhppsMapClean),
              };
            } else if (listHhpps.node.state == generalConfig.nodeInactivo) {
              return {
                message: EValidationHomepass.SIN_COBERTURA,
                geographicAddress: await this.mapResponseHomepass(response, listCoverMapClean, listHhppsMapClean),
              };
            }
          }
      }
    }
  }

  /**
   *
   * Metodo utilizado para dividir el flujo de homepass
   * @param validateListAddresses informacion a mapear
   * @param data informacion a mapear
   * @param channel informacion a mapear
   * @param redacDay informacion a mapear
   * @param returndireccionId informacion a mapear
   * @param dataResponse informacion a mapear
   * @param booleansData informacion a mapear
   * @returns una promesa
   */
  async flowPart1(validateListAddresses: any, data: any, channel: any, redacDay: any, returndireccionId: any, dataResponse: any, booleansData: any) {
    if (validateListAddresses == undefined || validateListAddresses == null) {
      //Consulta dirección general
      let geographicAddress = data.geographicAddressList.geographicAddress[0];

      let consultaDireccionGeneralRequest = await this.mapBodyConsult(data, channel, redacDay, geographicAddress);

      const proBando = JSON.stringify(consultaDireccionGeneralRequest);
      this.logger.write('Consumo request ConsultaDireccionGeneral HomePassUc', Etask.CONSUMO_REQ_CONSULTARDIRECCIONGENERAL, ELevelsErrors.INFO, proBando);
      const responseCreate = await this._mappingLegados.consumerLegadoRest(proBando, generalConfig.consultaDireccionGeneral);
      this.logger.write(
        'Consumo response ConsultaDireccionGeneral HomePassUc',
        Etask.CONSUMO_RES_CONSULTARDIRECCIONGENERAL,
        ELevelsErrors.INFO,
        undefined,
        responseCreate,
      );
      let errorConsultaDireccionGeneral = await this.errorConsulDirGeneral(responseCreate);
      if (errorConsultaDireccionGeneral) {
        return errorConsultaDireccionGeneral;
      }
      let listsAddress = responseCreate.data.listAddresses;
      let idCaseTcrm = idCaseTcrmFunction();
      for (const iterator of responseCreate.data.listAddresses) {
        returndireccionId = iterator.splitAddres.direccionId;
      }
      let idRequest = idCaseTcrmFunction();
      let responseLegado = JSON.parse(responseCreate.requestInfo.data);
      let user = responseLegado.user;
      let codigoDane = responseLegado.codigoDane;
      let message = responseCreate?.data?.message;
      let idObj= {
        idRequest: idRequest,
        idAddress: returndireccionId,
        idCaseTcrm: idCaseTcrm,
      }
      this.logger.write('Crear BD HomePassUc consulta direccion general', Etask.CREAR_HOMEPASSUC_CDG, ELevelsErrors.INFO);
      const crearDB = await this._cusRequestHomePassProvider.createCusRequestHomePassGeneral(
        responseCreate,
        user,
        codigoDane,
        booleansData,
        data,
        idObj,
        message,
      );
      if (!crearDB) return { error: 'error creando base de datos' };
      for (const element of listsAddress) {
        let fillSplit = await this.fillSplitAddress(element);
        let fillSplit2 = await this.fillSplitAddress2(element);
        let fillComp = await this.fillComplements(element);
        let fillAlt = await this.fillAlternate(element);

        dataResponse = {
          geographicAddress: {
            splitAddress: {
              type: fillSplit2.type,
              streetAlt: fillSplit.streetAlt,
              neighborhood: fillSplit.neighborhood,
              streetType: fillSplit.streetType,
              streetNr: fillSplit.streetNr,
              streetSuffix: fillSplit.streetSuffix,
              streetNlPostViaP: fillSplit.streetNlPostViaP,
              streetBis: fillSplit.streetBis,
              streetBlockGenerator: fillSplit.streetBlockGenerator,
              streetTypeGenerator: fillSplit.streetTypeGenerator,
              streetNrGenerator: fillSplit.streetNrGenerator,
              streetLtGenerator: fillSplit.streetLtGenerator,
              streetNlPostViaG: fillSplit.streetNlPostViaG,
              streetBisGenerator: fillSplit.streetBisGenerator,
              streetName: fillSplit.streetName,
              addressPlate: fillSplit.addressPlate,
              complement: fillComp,
              alternateGeographicAddress: fillAlt,
              plateTypeLt: fillSplit2.plateTypeLt,
              plateValueLt: fillSplit2.plateValueLt,
              cadastreId: fillSplit2.cadastreId,
              geoState: fillSplit2.geoState,
            },
            idCaseTcrm: idCaseTcrm,
          },
        };
      }
      return dataResponse;
    }
  }

  async errorConsulDirGeneral(responseCreate) {
    if (responseCreate.executed !== true || responseCreate.data == undefined) {
      return {
        message: 'Error',
        code: '-1',
        description: responseCreate.message + ' ' + generalConfig.consultaDireccionGeneral,
        source: 'AddressV2.1-ConsultaDireccionGeneral',
      };
    }
  }

  /**
   * Metodo para mapear un body utilizado para consultar informacion a legados
   * @param {any} data informacion a mapear
   * @param {any} channel informacion a mapear
   * @param {any} redacDay informacion a mapear
   * @param {any} geographicAddress informacion a mapear
   * @returns un body mapeado
   */
  async mapBodyConsult(data: any, channel: any, redacDay: any, geographicAddress: any) {
    return {
      headerRequest: {
        transactionId: data.transactionId,
        system: channel,
        requestDate: redacDay,
        ipApplication: data.ip,
      },
      codigoDane: data.daneCode,
      direccion: data.address,
      isDth: data.isDth,
      nodoGestion: data.managementNode,
      user: data.user,
      estrato: data.strata,
      direccionTabulada: {
        idTipoDireccion: geographicAddress.type,
        dirPrincAlt: geographicAddress.streetAlt,
        barrio: geographicAddress.neighborhood,
        tipoViaPrincipal: geographicAddress.streetType,
        numViaPrincipal: geographicAddress.streetNr,
        ltViaPrincipal: geographicAddress.streetLt,
        nlPostViaP: geographicAddress.streetNlPostViaP,
        bisViaPrincipal: geographicAddress.streetBis,
        cuadViaPrincipal: geographicAddress.streetBlock,
        tipoViaGeneradora: geographicAddress.streetTypeGenerator,
        numViaGeneradora: geographicAddress.streetNrGenerator,
        ltViaGeneradora: geographicAddress.streetLtGenerator,
        nlPostViaG: geographicAddress.streetNlPostViaG,
        bisViaGeneradora: geographicAddress.streetBisGenerator,
        cuadViaGeneradora: geographicAddress.streetBlockGenerator,
        placaDireccion: geographicAddress.plate,
        cpTipoNivel1: geographicAddress.complements.nivel1Type,
        cpTipoNivel2: geographicAddress.complements.nivel2Type,
        cpTipoNivel3: geographicAddress.complements.nivel3Type,
        cpTipoNivel4: geographicAddress.complements.nivel4Type,
        cpTipoNivel5: geographicAddress.complements.nivel5Type,
        cpTipoNivel6: geographicAddress.complements.nivel6Type,
        cpValorNivel1: geographicAddress.complements.nivel1Value,
        cpValorNivel2: geographicAddress.complements.nivel2Value,
        cpValorNivel3: geographicAddress.complements.nivel3Value,
        cpValorNivel4: geographicAddress.complements.nivel4Value,
        cpValorNivel5: geographicAddress.complements.nivel5Value,
        cpValorNivel6: geographicAddress.complements.nivel6Value,
        mzTipoNivel1: geographicAddress.alternateGeographicAddress.nivel1Type,
        mzTipoNivel2: geographicAddress.alternateGeographicAddress.nivel2Type,
        mzTipoNivel3: geographicAddress.alternateGeographicAddress.nivel3Type,
        mzTipoNivel4: geographicAddress.alternateGeographicAddress.nivel4Type,
        mzTipoNivel5: geographicAddress.alternateGeographicAddress.nivel5Type,
        mzValorNivel1: geographicAddress.alternateGeographicAddress.nivel1Value,
        mzValorNivel2: geographicAddress.alternateGeographicAddress.nivel2Value,
        mzValorNivel3: geographicAddress.alternateGeographicAddress.nivel3Value,
        mzValorNivel4: geographicAddress.alternateGeographicAddress.nivel4Value,
        mzValorNivel5: geographicAddress.alternateGeographicAddress.nivel5Value,
        idDirCatastro: geographicAddress.cadastreId,
        mzTipoNivel6: geographicAddress.alternateGeographicAddress.nivel6Type,
        mzValorNivel6: geographicAddress.alternateGeographicAddress.nivel6Value,
        itTipoPlaca: geographicAddress.plateTypeLt,
        itValorPlaca: geographicAddress.plateValueLt,
        estadoDirGeo: geographicAddress.geoState,
        letra3G: geographicAddress.Word3G,
        idDireccionDetallada: geographicAddress.idDetailAddress,
      },
    };
  }

  /**
   * Metodo utilizado para mapear una de las posibles respuestas del servicio
   * @param {any} response informacion a mapear
   * @param {any} listCoverMapClean informacion a mapear
   * @param {any} listHhppsMapClean informacion a mapear
   * @returns un objeto mapeado
   */
  async mapResponseHomepass(response: any, listCoverMapClean: any, listHhppsMapClean: any) {
    return {
      igacAddress: response.igacAddress,
      latitudeCoordinate: response.latitudeCoordinate,
      lengthCoordinate: response.lengthCoordinate,
      strata: response.stratum,
      splitAddress: {
        type: response.splitAddres.idTipoDireccion,
        streetAlt: response.splitAddres.dirPrincAlt,
        neighborhood: response.splitAddres.barrio,
        streetType: response.splitAddres.tipoViaPrincipal,
        streetNr: response.splitAddres.numViaPrincipal,
        streetSuffix: response.splitAddres.ltViaPrincipal,
        streetNlPostViaP: response.splitAddres.nlPostViaP,
        streetBis: response.splitAddres.bisViaPrincipal,
        streetBlockGenerator: response.splitAddres.cuadViaPrincipal,
        streetTypeGenerator: response.splitAddres.tipoViaGeneradora,
        streetNrGenerator: response.splitAddres.numViaGeneradora,
        streetLtGenerator: response.splitAddres.ltViaGeneradora,
        streetNlPostViaG: response.splitAddres.nlPostViaG,
        streetBisGenerator: response.splitAddres.bisViaGeneradora,
        streetName: response.splitAddres.cuadViaGeneradora,
        addressPlate: response.splitAddres.placaDireccion,
        complement: {
          nivel1Type: response.splitAddres.cpTipoNivel1,
          nivel2Type: response.splitAddres.cpTipoNivel2,
          nivel3Type: response.splitAddres.cpTipoNivel3,
          nivel4Type: response.splitAddres.cpTipoNivel4,
          nivel5Type: response.splitAddres.cpTipoNivel5,
          nivel6Type: response.splitAddres.cpTipoNivel6,
          nivel1Value: response.splitAddres.cpValorNivel1,
          nivel2Value: response.splitAddres.cpValorNivel2,
          nivel3Value: response.splitAddres.cpValorNivel3,
          nivel4Value: response.splitAddres.cpValorNivel4,
          nivel5Value: response.splitAddres.cpValorNivel5,
          nivel6Value: response.splitAddres.cpValorNivel6,
        },
        alternateGeographicAddress: {
          nivel1Type: response.splitAddres.mzTipoNivel1,
          nivel2Type: response.splitAddres.mzTipoNivel2,
          nivel3Type: response.splitAddres.mzTipoNivel3,
          nivel4Type: response.splitAddres.mzTipoNivel4,
          nivel5Type: response.splitAddres.mzTipoNivel5,
          nivel6Type: response.splitAddres.mzTipoNivel6,
          nivel1Value: response.splitAddres.mzValorNivel1,
          nivel2Value: response.splitAddres.mzValorNivel2,
          nivel3Value: response.splitAddres.mzValorNivel3,
          nivel4Value: response.splitAddres.mzValorNivel4,
          nivel5Value: response.splitAddres.mzValorNivel5,
          nivel6Value: response.splitAddres.mzValorNivel6,
        },
        plateTypeLt: response.splitAddres.itTipoPlaca,
        plateValueLt: response.splitAddres.itValorPlaca,
        cadastreId: response.splitAddres.idDirCatastro,
        geoState: response.splitAddres.estadoDirGeo,
      },
      listCover: listCoverMapClean,
      listHhpps: listHhppsMapClean,
    };
  }
}

/**
 * funcion para generar un numero aleatorio
 * @returns un numero aleatorio
 */
function idCaseTcrmFunction() {
  const abf = crypto.randomInt(1000000000, 10000000000);
  return 'ECOM-' + abf;
}
