/**
 * Clase que se implementa para realizar la respectiva consulta de detalles de direcciones
 * @author Sebastian Traslaviña
 */
import { Injectable } from '@nestjs/common';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { GeographicDto } from '../../../../controller/dto/geographic/geographic.dto';
import { IDetailAddressUc } from '../detailAddress.uc';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/task.enum';
import { BusinessException } from '../../../../common/lib/business-exceptions';
import { ENameCursorDB, EStoreProcedureDB, EStoredName } from 'src/common/utils/enums/store-procedure.enum';
import * as oracledb from 'oracledb';
import GeneralUtil from 'src/common/utils/generalUtil';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';

@Injectable()
export class DetailAdderessimpl implements IDetailAddressUc {

  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _oracleProvider: IOracleProvider,
  ) {}

  /**
   * Metodo en el cual se prepara la informacion para consumir el stored procedure que retorna los detalles de un barrio o barrios relacionados a la direccion ingresada por el usuario
   * @param {GeographicDto} geographicDto Detalles de direccion ingresada por el usuario
   * @returns una promesa
   */
  async detailAddress(geographicDto: GeographicDto) {
    let datosDesglosados
    let fillPosAlt
    try {
      const sqlConsulta = EStoreProcedureDB.CONSULTA_DETAIL_ADDRESS;
      const params = this.createParamsForSP(geographicDto);
      const resultSP =  await this._oracleProvider.execute(sqlConsulta, params, DetailAdderessimpl.name, ENameCursorDB.CONSULTA_DETAIL_ADDRESS);
      if (resultSP.po_codigo != 0 || resultSP.po_data.length === 0) {
        throw new BusinessException(201, GeneralUtil.assignGlobalMessageErrorByCode(resultSP.po_codigo), true, {
          document: {
            message: 'ERROR',
            code: resultSP.po_codigo,
            description:
              GeneralUtil.mappingMessage(EmessageMapping[GeneralUtil.assignDetailMessageErrorByCode(resultSP.po_codigo)]) || resultSP.po_descripcion,
            source: EStoredName.CONSULTA_DETAIL_ADDRESS,
          },
        });
      }

      datosDesglosados = resultSP.po_data[0];
      fillPosAlt = await this.fillPostAlt(datosDesglosados);

      return {
        geographicAddressList: {
          geographicAddress: this.fillGeo(datosDesglosados),
          geographicSubAddress: this.fillSubGeo(datosDesglosados),
          addressPlate: datosDesglosados[20] !== null ? datosDesglosados[20] : '',
          complements: this.fillComp(datosDesglosados),
          alternateGeographicAddress: this.fillAlternate(datosDesglosados),
          cadastreId: fillPosAlt.cadastreId,
          plateTypeIt: fillPosAlt.plateTypeIt,
          plateValueIt: fillPosAlt.plateValueIt,
          geoState: fillPosAlt.geoState,
          word3G: fillPosAlt.word3G,
          indications: fillPosAlt.indications,
        },
      };
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_DETAIL_ADDRESS, ETaskDesc.CONSULT_DETAIL_ADDRESS);
      throw error;
    }
  }

  createParamsForSP(geographicDto: GeographicDto): any {
    let params1 = this.fillParams1(geographicDto);
    let params2 = this.fillParams2(geographicDto);
    let params3 = this.fillParams3(geographicDto);
    try{
      return {
        pi_codigodanecentropoblado: params1.pi_codigodanecentropoblado,
        pi_id_tipo_direccion: params1.pi_id_tipo_direccion,
        pi_dir_princ_alt: params1.pi_dir_princ_alt,
        pi_barrio: params1.pi_barrio,
        pi_tipo_via_principal: params1.pi_tipo_via_principal,
        pi_num_via_principal: params1.pi_num_via_principal,
        pi_lt_via_principal: params1.pi_lt_via_principal,
        pi_nl_post_via_p: params1.pi_nl_post_via_p,
        pi_bis_via_principal: params1.pi_bis_via_principal,
        pi_cuad_via_principal: params1.pi_cuad_via_principal,
        pi_tipo_via_generadora: params1.pi_tipo_via_generadora,
        pi_num_via_generadora: params1.pi_num_via_generadora,
        pi_lt_via_generadora: params1.pi_lt_via_generadora,
        pi_nl_post_via_g: params1.pi_nl_post_via_g,
        pi_letra3g: params1.pi_letra3g,
        pi_bis_via_generadora: params2.pi_bis_via_generadora,
        pi_cuad_via_generadora: params2.pi_cuad_via_generadora,
        pi_placa_direccion: params2.pi_placa_direccion,
        pi_cp_tipo_nivel1: params2.pi_cp_tipo_nivel1,
        pi_cp_tipo_nivel2: params2.pi_cp_tipo_nivel2,
        pi_cp_tipo_nivel3: params2.pi_cp_tipo_nivel3,
        pi_cp_tipo_nivel4: params2.pi_cp_tipo_nivel4,
        pi_cp_tipo_nivel5: params2.pi_cp_tipo_nivel5,
        pi_cp_tipo_nivel6: params2.pi_cp_tipo_nivel6,
        pi_cp_valor_nivel1: params2.pi_cp_valor_nivel1,
        pi_cp_valor_nivel2: params2.pi_cp_valor_nivel2,
        pi_cp_valor_nivel3: params2.pi_cp_valor_nivel3,
        pi_cp_valor_nivel4: params2.pi_cp_valor_nivel4,
        pi_cp_valor_nivel5: params2.pi_cp_valor_nivel5,
        pi_cp_valor_nivel6: params2.pi_cp_valor_nivel6,
        pi_mz_tipo_nivel1: params3.pi_mz_tipo_nivel1,
        pi_mz_tipo_nivel2: params3.pi_mz_tipo_nivel2,
        pi_mz_tipo_nivel3: params3.pi_mz_tipo_nivel3,
        pi_mz_tipo_nivel4: params3.pi_mz_tipo_nivel4,
        pi_mz_tipo_nivel5: params3.pi_mz_tipo_nivel5,
        pi_mz_tipo_nivel6: params3.pi_mz_tipo_nivel6,
        pi_mz_valor_nivel1: params3.pi_mz_valor_nivel1,
        pi_mz_valor_nivel2: params3.pi_mz_valor_nivel2,
        pi_mz_valor_nivel3: params3.pi_mz_valor_nivel3,
        pi_mz_valor_nivel4: params3.pi_mz_valor_nivel4,
        pi_mz_valor_nivel5: params3.pi_mz_valor_nivel5,
        pi_mz_valor_nivel6: params3.pi_mz_valor_nivel6,
        PI_IT_TIPO_PLACA: params3.PI_IT_TIPO_PLACA,
        PI_IT_VALOR_PLACA: params3.PI_IT_VALOR_PLACA,
        po_codigo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        po_descripcion: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        po_v_response: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      };
    }catch(e){
      GeneralUtil.assignTaskError(e, Etask.CONSULT_DETAIL_ADDRESS, ETaskDesc.CONSULT_DETAIL_ADDRESS);
      throw e;
    }
  }

  /**
   * Primer metodo utilizado para mapear los parametros de consumo al stored procedure
   * @param {any} geographicDto informacion a mapear
   * @returns {Object} un objeto
   */
  fillParams1(geographicDto: any): any {
    return {
      pi_codigodanecentropoblado: geographicDto.geographicAddressList.geographicAddress.codeDane,
      pi_id_tipo_direccion:
        geographicDto.geographicAddressList.geographicAddress?.typeAddrMER != undefined
          ? geographicDto.geographicAddressList.geographicAddress.typeAddrMER
          : null,
      pi_dir_princ_alt:
        geographicDto.geographicAddressList.geographicAddress?.streetAlt != undefined ? geographicDto.geographicAddressList.geographicAddress.streetAlt : null,
      pi_barrio:
        geographicDto.geographicAddressList.geographicAddress?.neighborhood != undefined
          ? geographicDto.geographicAddressList.geographicAddress.neighborhood
          : null,
      pi_tipo_via_principal:
        geographicDto.geographicAddressList.geographicAddress?.streetType != undefined
          ? geographicDto.geographicAddressList.geographicAddress.streetType
          : null,
      pi_num_via_principal:
        geographicDto.geographicAddressList.geographicAddress?.streetNr != undefined ? geographicDto.geographicAddressList.geographicAddress.streetNr : null,
      pi_lt_via_principal:
        geographicDto.geographicAddressList.geographicAddress?.streetSuffix != undefined
          ? geographicDto.geographicAddressList.geographicAddress.streetSuffix
          : null,
      pi_nl_post_via_p:
        geographicDto.geographicAddressList.geographicAddress?.streetNlPostViaP != undefined
          ? geographicDto.geographicAddressList.geographicAddress.streetNlPostViaP
          : null,
      pi_bis_via_principal:
        geographicDto.geographicAddressList.geographicAddress?.streetBis != undefined ? geographicDto.geographicAddressList.geographicAddress.streetBis : null,
      pi_cuad_via_principal:
        geographicDto.geographicAddressList.geographicAddress?.streetBlockGenerator != undefined
          ? geographicDto.geographicAddressList.geographicAddress.streetBlockGenerator
          : null,
      pi_tipo_via_generadora:
        geographicDto.geographicAddressList.geographicSubAddress?.streetTypeGenerator != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetTypeGenerator
          : null,
      pi_num_via_generadora:
        geographicDto.geographicAddressList.geographicSubAddress?.streetNrGenerator != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetNrGenerator
          : null,
      pi_lt_via_generadora:
        geographicDto.geographicAddressList.geographicSubAddress?.streetLtGenerator != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetLtGenerator
          : null,
      pi_nl_post_via_g:
        geographicDto.geographicAddressList.geographicSubAddress?.streetNlPostViaG != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetNlPostViaG
          : null,
      pi_letra3g:
        geographicDto.geographicAddressList.geographicSubAddress?.word3G != undefined ? geographicDto.geographicAddressList.geographicSubAddress.word3G : null,
    };
  }

  /**
   * Segundo metodo utilizado para mapear los parametros de consumo al stored procedure
   * @param {any} geographicDto informacion a mapear
   * @returns {Object} un objeto
   */
  fillParams2(geographicDto: GeographicDto): any {
    return {
      pi_bis_via_generadora:
        geographicDto.geographicAddressList.geographicSubAddress?.streetBisGenerator != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetBisGenerator
          : null,
      pi_cuad_via_generadora:
        geographicDto.geographicAddressList.geographicSubAddress?.streetName != undefined
          ? geographicDto.geographicAddressList.geographicSubAddress.streetName
          : null,
      pi_placa_direccion:
        geographicDto.geographicAddressList.geographicSubAddress?.plate != undefined ? geographicDto.geographicAddressList.geographicSubAddress.plate : null,
      pi_cp_tipo_nivel1:
        geographicDto.geographicAddressList.complements?.nivel1Type != undefined ? geographicDto.geographicAddressList.complements.nivel1Type : null,
      pi_cp_tipo_nivel2:
        geographicDto.geographicAddressList.complements?.nivel2Type != undefined ? geographicDto.geographicAddressList.complements.nivel2Type : null,
      pi_cp_tipo_nivel3:
        geographicDto.geographicAddressList.complements?.nivel3Type != undefined ? geographicDto.geographicAddressList.complements.nivel3Type : null,
      pi_cp_tipo_nivel4:
        geographicDto.geographicAddressList.complements?.nivel4Type != undefined ? geographicDto.geographicAddressList.complements.nivel4Type : null,
      pi_cp_tipo_nivel5:
        geographicDto.geographicAddressList.complements?.nivel5Type != undefined ? geographicDto.geographicAddressList.complements.nivel5Type : null,
      pi_cp_tipo_nivel6:
        geographicDto.geographicAddressList.complements?.nivel6Type != undefined ? geographicDto.geographicAddressList.complements.nivel6Type : null,
      pi_cp_valor_nivel1:
        geographicDto.geographicAddressList.complements?.nivel1Value != undefined ? geographicDto.geographicAddressList.complements.nivel1Value : null,
      pi_cp_valor_nivel2:
        geographicDto.geographicAddressList.complements?.nivel2Value != undefined ? geographicDto.geographicAddressList.complements.nivel2Value : null,
      pi_cp_valor_nivel3:
        geographicDto.geographicAddressList.complements?.nivel3Value != undefined ? geographicDto.geographicAddressList.complements.nivel3Value : null,
      pi_cp_valor_nivel4:
        geographicDto.geographicAddressList.complements?.nivel4Value != undefined ? geographicDto.geographicAddressList.complements.nivel4Value : null,
      pi_cp_valor_nivel5:
        geographicDto.geographicAddressList.complements?.nivel5Value != undefined ? geographicDto.geographicAddressList.complements.nivel5Value : null,
      pi_cp_valor_nivel6:
        geographicDto.geographicAddressList.complements?.nivel6Value != undefined ? geographicDto.geographicAddressList.complements.nivel6Value : null,
    };
  }

  /**
   * Tercer metodo utilizado para mapear los parametros de consumo al stored procedure
   * @param {any} geographicDto informacion a mapear
   * @returns {Object} un objeto
   */
  fillParams3(geographicDto: GeographicDto): any {
    return {
      pi_mz_tipo_nivel1:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel1Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel1Type
          : null,
      pi_mz_tipo_nivel2:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel2Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel2Type
          : null,
      pi_mz_tipo_nivel3:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel3Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel3Type
          : null,
      pi_mz_tipo_nivel4:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel4Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel4Type
          : null,
      pi_mz_tipo_nivel5:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel5Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel5Type
          : null,
      pi_mz_tipo_nivel6:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel6Type != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel6Type
          : null,
      pi_mz_valor_nivel1:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel1Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel1Value
          : null,
      pi_mz_valor_nivel2:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel2Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel2Value
          : null,
      pi_mz_valor_nivel3:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel3Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel3Value
          : null,
      pi_mz_valor_nivel4:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel4Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel4Value
          : null,
      pi_mz_valor_nivel5:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel5Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel5Value
          : null,
      pi_mz_valor_nivel6:
        geographicDto.geographicAddressList.alternateGeographicAddress?.nivel6Value != undefined
          ? geographicDto.geographicAddressList.alternateGeographicAddress.nivel6Value
          : null,
      PI_IT_TIPO_PLACA: geographicDto.geographicAddressList.plateTypeIt != undefined ? geographicDto.geographicAddressList.plateTypeIt : null,
      PI_IT_VALOR_PLACA: geographicDto.geographicAddressList.plateValueIt != undefined ? geographicDto.geographicAddressList.plateValueIt : null,
    };
  }

  /**
   * Primer metodo utilizado para mapear la respuesta de informacion del legado
   * @param {any} datosDesglosados informacion a mapear
   * @returns {object} objeto con datos mapeados
   */
  fillGeo(datosDesglosados: any): any {
    return {
      id: datosDesglosados[0] !== null ? datosDesglosados[0] : '',
      subId: datosDesglosados[1] !== null ? datosDesglosados[1] : '',
      detailId: datosDesglosados[3] !== null ? datosDesglosados[3] : '',
      textAddress: datosDesglosados[4] !== null ? datosDesglosados[4] : '',
      strata: datosDesglosados[2] !== null ? datosDesglosados[2] : '',
      typeAddrMER: datosDesglosados[5] !== null ? datosDesglosados[5] : '',
      streetAlt: datosDesglosados[6] !== null ? datosDesglosados[6] : '',
      neighborhood: datosDesglosados[7] !== null ? datosDesglosados[7] : '',
      streetType: datosDesglosados[8] !== null ? datosDesglosados[8] : '',
      streetNr: datosDesglosados[9] !== null ? datosDesglosados[9] : '',
      streetSuffix: datosDesglosados[10] !== null ? datosDesglosados[10] : '',
      streetNlPostViaP: datosDesglosados[11] !== null ? datosDesglosados[11] : '',
      streetBis: datosDesglosados[12] !== null ? datosDesglosados[12] : '',
      streetBlockGenerator: datosDesglosados[13] !== null ? datosDesglosados[13] : '',
    };
  }

  /**
   * Segundo metodo utilizado para mapear la respuesta de informacion del legado
   * @param {any} datosDesglosados informacion a mapear
   * @returns {object} objeto con datos mapeados
   */
  async fillSubGeo(datosDesglosados: any) {
    return {
      streetTypeGenerator: datosDesglosados[14] !== null ? datosDesglosados[14] : '',
      streetNrGenerator: datosDesglosados[15] !== null ? datosDesglosados[15] : '',
      streetLtGenerator: datosDesglosados[16] !== null ? datosDesglosados[16] : '',
      streetNlPostViaG: datosDesglosados[17] !== null ? datosDesglosados[17] : '',
      streetBisGenerator: datosDesglosados[18] !== null ? datosDesglosados[18] : '',
      streetName: datosDesglosados[19] !== null ? datosDesglosados[19] : '',
    };
  }

  /**
   * Tercer metodo utilizado para mapear la respuesta de informacion del legado
   * @param {any} datosDesglosados informacion a mapear
   * @returns {object} objeto con datos mapeados
   */
  fillComp(datosDesglosados: any): any {
    return {
      nivel1Type: datosDesglosados[21] !== null ? datosDesglosados[21] : '',
      nivel2Type: datosDesglosados[22] !== null ? datosDesglosados[22] : '',
      nivel3Type: datosDesglosados[23] !== null ? datosDesglosados[23] : '',
      nivel4Type: datosDesglosados[24] !== null ? datosDesglosados[24] : '',
      nivel5Type: datosDesglosados[25] !== null ? datosDesglosados[25] : '',
      nivel6Type: datosDesglosados[26] !== null ? datosDesglosados[26] : '',
      nivel1Value: datosDesglosados[27] !== null ? datosDesglosados[27] : '',
      nivel2Value: datosDesglosados[28] !== null ? datosDesglosados[28] : '',
      nivel3Value: datosDesglosados[29] !== null ? datosDesglosados[29] : '',
      nivel4Value: datosDesglosados[30] !== null ? datosDesglosados[30] : '',
      nivel5Value: datosDesglosados[31] !== null ? datosDesglosados[31] : '',
      nivel6Value: datosDesglosados[32] !== null ? datosDesglosados[32] : '',
    };
  }

  /**
   * Cuarto metodo utilizado para mapear la respuesta de informacion del legado
   * @param {any} datosDesglosados informacion a mapear
   * @returns {object} objeto con datos mapeados
   */
  fillAlternate(datosDesglosados: any): any {
    return {
      nivel1Type: datosDesglosados[33] !== null ? datosDesglosados[33] : '',
      nivel2Type: datosDesglosados[34] !== null ? datosDesglosados[34] : '',
      nivel3Type: datosDesglosados[35] !== null ? datosDesglosados[35] : '',
      nivel4Type: datosDesglosados[36] !== null ? datosDesglosados[36] : '',
      nivel5Type: datosDesglosados[37] !== null ? datosDesglosados[37] : '',
      nivel6Type: datosDesglosados[44] !== null ? datosDesglosados[44] : '',
      nivel1Value: datosDesglosados[38] !== null ? datosDesglosados[38] : '',
      nivel2Value: datosDesglosados[39] !== null ? datosDesglosados[39] : '',
      nivel3Value: datosDesglosados[40] !== null ? datosDesglosados[40] : '',
      nivel4Value: datosDesglosados[41] !== null ? datosDesglosados[41] : '',
      nivel5Value: datosDesglosados[42] !== null ? datosDesglosados[42] : '',
      nivel6Value: datosDesglosados[45] !== null ? datosDesglosados[45] : '',
    };
  }

  /**
   * Quinto metodo utilizado para mapear la respuesta de informacion del legado
   * @param {any} datosDesglosados informacion a mapear
   * @returns {object} objeto con datos mapeados
   */
  fillPostAlt(datosDesglosados: any): any {
    return {
      cadastreId: datosDesglosados[43] !== null ? datosDesglosados[43] : '',
      plateTypeIt: datosDesglosados[46] !== null ? datosDesglosados[46] : '',
      plateValueIt: datosDesglosados[47] !== null ? datosDesglosados[47] : '',
      geoState: datosDesglosados[48] !== null ? datosDesglosados[48] : '',
      word3G: datosDesglosados[49] !== null ? datosDesglosados[49] : '',
      indications: datosDesglosados[50] !== null ? datosDesglosados[50] : '',
    };
  }
}
