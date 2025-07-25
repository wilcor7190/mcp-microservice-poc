/**
 * Clase que se implementa para realizar las respectivas consultas de estructuras de direcciones a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IOrchStructuresUc } from '../structures.uc';
import Logging from '../../../../common/lib/logging';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import GeneralUtil from '../../../../common/utils/generalUtil';
import { ENameCursorDB, EStoreProcedureDB, EStoredName } from 'src/common/utils/enums/store-procedure.enum';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import * as oracledb from 'oracledb';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';

@Injectable()
export class StructuresUc implements IOrchStructuresUc {
  private readonly logger = new Logging(StructuresUc.name);

  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _consultaStoresProceduredProvider: IOracleProvider,
    public readonly _lvlFuncionalities: ILvlFuncionalitiesUc,
  ) {}

  /**
   * Metodo que realiza la consulta a BD del filtro de las estructuras, por los tipos de dirección enviada. para estandarizar la dirección del cliente en la tienda virtual
   * @param {any} data informacion de direccion
   */
  async initialFunction(bodyStructure: any) {
    this.logger.write('initialFunction()', Etask.CONSULT_STRUCTURES, ELevelsErrors.INFO, bodyStructure);
    try {
      const sqlConsulta = EStoreProcedureDB.CONSULTA_STRUCTURES;
      let fillAlternate = new Array<string | undefined>(6).fill(undefined);
      let fillComplements = new Array<string | undefined>(6).fill(undefined);

      let validateComplements = this._lvlFuncionalities.validateData(bodyStructure.geographicAddressList?.complements);

      if (!this._lvlFuncionalities.validateData(bodyStructure.geographicAddressList.alternateGeographicAddress)) {
        fillAlternate = this._lvlFuncionalities.mapFilling(bodyStructure.geographicAddressList.alternateGeographicAddress, !validateComplements);
      }
      if (!this._lvlFuncionalities.validateData(bodyStructure.geographicAddressList.complements)) {
        fillComplements = this._lvlFuncionalities.mapFilling(bodyStructure.geographicAddressList.complements, false);
      }

      let geographicAddress = bodyStructure.geographicAddressList.geographicAddress;
      let complements = bodyStructure.geographicAddressList.complements;
      let alternateGeographicAddress = bodyStructure.geographicAddressList.alternateGeographicAddress;

      let mapAlternate = GeneralUtil.mapAlternateGeographics(alternateGeographicAddress, fillAlternate);
      let mapComp = GeneralUtil.mapComplements(complements, fillComplements);

      let params = this.createParamsForSP(geographicAddress, mapAlternate, mapComp, bodyStructure);
      const resultSP = await this._consultaStoresProceduredProvider.execute(sqlConsulta, params, StructuresUc.name, ENameCursorDB.CONSULTA_STRUCTURES);
      if (resultSP.po_codigo != 0) {
        throw new BusinessException(201, EmessageMapping.LEGADO_ERROR, true, {
          document: { message: 'ERROR', code: resultSP.po_codigo, description: resultSP.po_descripcion, source: EStoredName.CONSULTA_STRUCTURES },
        });
      }
      return resultSP.po_data;
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_STRUCTURES, ETaskDesc.CONSULT_STRUCTURES);
      throw error;
    }
  }

  private createParamsForSP(geographicAddress: any, mapAlternate: any, mapComp: any, bodyStructure: any) {
    return {
      PI_CODIGO_DANE: geographicAddress.daneCode,
      PI_TIPO_DIRECCION: geographicAddress.addressType,
      pi_barrio: geographicAddress.neighborhood,
      pi_mz_tipo_nivel1: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel1, ''),
      pi_mz_valor_nivel1: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel1, ''),
      pi_mz_tipo_nivel2: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel2, ''),
      pi_mz_valor_nivel2: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel2, ''),
      pi_mz_tipo_nivel3: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel3, ''),
      pi_mz_valor_nivel3: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel3, ''),
      pi_mz_tipo_nivel4: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel4, ''),
      pi_mz_valor_nivel4: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel4, ''),
      pi_mz_tipo_nivel5: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel5, ''),
      pi_mz_valor_nivel5: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel5, ''),
      pi_mz_tipo_nivel6: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_tipo_nivel6, ''),
      pi_mz_valor_nivel6: GeneralUtil.repleceWhenUndefined(mapAlternate?.pi_mz_valor_nivel6, ''),
      PI_CP_NIVEL_NIVEL1: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL1, ''),
      pi_cp_valor_nivel1: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel1, ''),
      PI_CP_NIVEL_NIVEL2: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL2, ''),
      pi_cp_valor_nivel2: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel2, ''),
      PI_CP_NIVEL_NIVEL3: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL3, ''),
      pi_cp_valor_nivel3: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel3, ''),
      PI_CP_NIVEL_NIVEL4: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL4, ''),
      pi_cp_valor_nivel4: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel4, ''),
      PI_CP_NIVEL_NIVEL5: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL5, ''),
      pi_cp_valor_nivel5: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel5, ''),
      PI_CP_NIVEL_NIVEL6: GeneralUtil.repleceWhenUndefined(mapComp?.PI_CP_NIVEL_NIVEL6, ''),
      pi_cp_valor_nivel6: GeneralUtil.repleceWhenUndefined(mapComp?.pi_cp_valor_nivel6, ''),
      PI_IT_TIPO_PLACA: bodyStructure.geographicAddressList.plateTypeIt,
      PI_IT_TIPO_VALOR_PLACA: bodyStructure.geographicAddressList.plateValueIt,
      po_codigo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      po_descripcion: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      PO_CONSULTA_DIR: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };
  }
}
