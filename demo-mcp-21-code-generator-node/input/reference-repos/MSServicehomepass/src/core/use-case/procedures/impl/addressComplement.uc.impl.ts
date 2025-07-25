/**
 * Clase utilizada para realizar las respectivas consultas de complementos de direcciones
 * @Author Sebastian Traslaviña
 */

import { Injectable } from '@nestjs/common';
import Logging from '../../../../common/lib/logging';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { IAddressComplementUc } from '../addressComplment.uc';
import { GeographicAdDto } from '../../../../controller/dto/geographicAddres/geographicAddress.dto';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import GeneralUtil from '../../../../common/utils/generalUtil';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import * as oracledb from 'oracledb';
import { ENameCursorDB, EStoreProcedureDB, EStoredName } from 'src/common/utils/enums/store-procedure.enum';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { IPoComplemento } from 'src/core/entity/address-complement/po-complementos.entity';
import { ResponseDB } from 'src/core/entity/response-db.entity';

@Injectable()
export class AddressComplementimpl implements IAddressComplementUc {
  private readonly logger = new Logging(AddressComplementimpl.name);

  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _oracleProvider: IOracleProvider,
    public readonly _lvlFuncionalities: ILvlFuncionalitiesUc,
  ) {}

  /**
   * Metodo utilizado para consultar al legado posibles complementos de direcciones
   * @param {GeographicAdDto} geographicDto informacion relacionada a la direccion ingresada por el cliente
   * @returns {Promise<any>} retorna direccion del cliente estandarizada
   */
  async requestAddressComplement(geographicDto: GeographicAdDto): Promise<ResponseDB<IPoComplemento>> {
    this.logger.write('Request Address', Etask.ADDRESS_COMPLEMENT, ELevelsErrors.INFO, geographicDto);
    try {
      const sqlConsult = EStoreProcedureDB.CONSULTA_COMPLEMENTOS;
      let fillAlternate = new Array<string | undefined>(6).fill(undefined);
      let fillComplements = new Array<string | undefined>(6).fill(undefined);
      let validateComplements = this._lvlFuncionalities.validateData(geographicDto.geographicAddressList?.complements);

      if (!this._lvlFuncionalities.validateData(geographicDto.geographicAddressList?.alternateGeographicAddress)) {
        fillAlternate = this._lvlFuncionalities.mapFilling(geographicDto.geographicAddressList.alternateGeographicAddress, !validateComplements);
      }
      if (!this._lvlFuncionalities.validateData(geographicDto.geographicAddressList?.complements)) {
        fillComplements = this._lvlFuncionalities.mapFilling(geographicDto.geographicAddressList.complements, false);
      }

      let mapAlt = GeneralUtil.mapAlternateGeographics(geographicDto.geographicAddressList?.alternateGeographicAddress, fillAlternate);
      let mapCom = GeneralUtil.mapComplements(geographicDto.geographicAddressList?.complements, fillComplements);

      const params = this.createParamsForSP(geographicDto, mapAlt, mapCom);
      let resultSP = await this._oracleProvider.execute(
        sqlConsult,
        params,
        AddressComplementimpl.name,
        ENameCursorDB.CONSULTA_COMPLEMENTOS,
        true
      );
      if (resultSP.po_codigo != 0) {
        throw new BusinessException(201, EmessageMapping.LEGADO_ERROR, true, {
          document: { message: 'ERROR', code: resultSP.po_codigo, description: resultSP.po_descripcion, source: EStoredName.CONSULTA_COMPLEMENTOS },
        });
      }
      return resultSP;
    } catch (err) {
      GeneralUtil.assignTaskError(err, Etask.ADDRESS_COMPLEMENT, ETaskDesc.ADDRESS_COMPLEMENT);
      throw err;
    }
  }

  private createParamsForSP(geographicDto: GeographicAdDto, mapAlt: any, mapCom: any) {
    return {
      PI_TIPO_DIRECCION: geographicDto.geographicAddressList.geographicAddress.addressType,
      PI_DIRECCION_ID: geographicDto.geographicAddressList.geographicAddress.id,
      pi_mz_tipo_nivel1: mapAlt.pi_mz_tipo_nivel1,
      pi_mz_valor_nivel1: mapAlt.pi_mz_valor_nivel1,
      pi_mz_tipo_nivel2: mapAlt.pi_mz_tipo_nivel2,
      pi_mz_valor_nivel2: mapAlt.pi_mz_valor_nivel2,
      pi_mz_tipo_nivel3: mapAlt.pi_mz_tipo_nivel3,
      pi_mz_valor_nivel3: mapAlt.pi_mz_valor_nivel3,
      pi_mz_tipo_nivel4: mapAlt.pi_mz_tipo_nivel4,
      pi_mz_valor_nivel4: mapAlt.pi_mz_valor_nivel4,
      pi_mz_tipo_nivel5: mapAlt.pi_mz_tipo_nivel5,
      pi_mz_valor_nivel5: mapAlt.pi_mz_valor_nivel5,
      pi_mz_tipo_nivel6: mapAlt.pi_mz_tipo_nivel6,
      pi_mz_valor_nivel6: mapAlt.pi_mz_valor_nivel6,
      PI_CP_NIVEL_NIVEL1: mapCom.PI_CP_NIVEL_NIVEL1,
      pi_cp_valor_nivel1: mapCom.pi_cp_valor_nivel1,
      PI_CP_NIVEL_NIVEL2: mapCom.PI_CP_NIVEL_NIVEL2,
      pi_cp_valor_nivel2: mapCom.pi_cp_valor_nivel2,
      PI_CP_NIVEL_NIVEL3: mapCom.PI_CP_NIVEL_NIVEL3,
      pi_cp_valor_nivel3: mapCom.pi_cp_valor_nivel3,
      PI_CP_NIVEL_NIVEL4: mapCom.PI_CP_NIVEL_NIVEL4,
      pi_cp_valor_nivel4: mapCom.pi_cp_valor_nivel4,
      PI_CP_NIVEL_NIVEL5: mapCom.PI_CP_NIVEL_NIVEL5,
      pi_cp_valor_nivel5: mapCom.pi_cp_valor_nivel5,
      PI_CP_NIVEL_NIVEL6: mapCom.PI_CP_NIVEL_NIVEL6,
      pi_cp_valor_nivel6: mapCom.pi_cp_valor_nivel6,
      PI_IT_TIPO_PLACA: geographicDto.geographicAddressList.plateTypeIt ? geographicDto.geographicAddressList.plateTypeIt : '',
      PI_IT_TIPO_VALOR_PLACA: geographicDto.geographicAddressList.plateValueIt ? geographicDto.geographicAddressList.plateValueIt : '',
      po_codigo: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_OUT,
      },
      po_descripcion: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
      },
      PO_COMPLEMENTOS: {
        type: oracledb.CURSOR,
        dir: oracledb.BIND_OUT,
      },
    };
  }
}
