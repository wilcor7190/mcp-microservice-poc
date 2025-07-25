/**
 * Clase que se implementa para realizar las  consultas de barrios por codigo Dane directo a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import Logging from '../../../../common/lib/logging';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { INeighborhoodbydaneUc } from '../neighborhoodbydane.uc';
import { NeighborhoodbydaneDTO } from '../../../../controller/dto/neighborhoodbydane/neighborhoodbydane.dto';
import generalConfig from '../../../../common/configuration/general.config';
import { ENameCursorDB, EStoreProcedureDB, EStoredName } from 'src/common/utils/enums/store-procedure.enum';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { IGeographicAddressList } from 'src/core/entity/address-complement/geographic-address-list.entity';
import * as oracledb from 'oracledb';

@Injectable()
export class NeighborhoodbydaneUcimpl implements INeighborhoodbydaneUc {
  private readonly logger = new Logging(NeighborhoodbydaneUcimpl.name);

  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _consultaStoresProceduredProvider: IOracleProvider,
  ) {}

  /**
   * Metodo que realiza la consulta de un barrio o barrios por el departamento y municipio enviado directamente a BD
   * @param {NeighborhoodbydaneDTO} neighborhoodbydaneDto
   * @returns una promesa
   */
  async neighborhoodbydane(neighborhoodbydaneDto: NeighborhoodbydaneDTO) {
    this.logger.write('neighborhoodbydane()', Etask.CONSULT_NEIGHBORHOOD_BY_DANE, ELevelsErrors.INFO, neighborhoodbydaneDto);
    try {
      const sqlConsulta = EStoreProcedureDB.CONSULTA_NEIGHBORHOOD;
      let codigoDane = neighborhoodbydaneDto.daneCode;
      codigoDane = this.leadingZeros(codigoDane);

      let addressType = (neighborhoodbydaneDto?.addressType || '') == '' ? generalConfig.consultAddressType : neighborhoodbydaneDto?.addressType;
      const params = this.createParamsForSP(codigoDane, addressType);

      const resultSP = await this._consultaStoresProceduredProvider.execute(sqlConsulta, params, NeighborhoodbydaneUcimpl.name, ENameCursorDB.CONSULTA_NEIGHBORHOOD);
      if (resultSP.po_codigo != 0) {
        throw new BusinessException(201, EmessageMapping.LEGADO_ERROR, true, {
          document: { message: 'ERROR', code: resultSP.po_codigo, description: resultSP.po_descripcion, source: EStoredName.CONSULTA_COMPLEMENTOS },
        });
      }
      let response: IGeographicAddressList = { geographicAddress: [] };
      resultSP.po_data.forEach((value) => {
        response.geographicAddress.push({ geographicLocation: value[0] });
      });
      return { geographicAddressList: response };
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_NEIGHBORHOOD_BY_DANE, ETaskDesc.CONSULT_NEIGHBORHOOD_BY_DANE);
      throw error;
    }
  }

  /**
   * Metodo que completa el codigo dane con un 0 si es menor a 8
   * @param codigoDane codigo a completar
   * @returns {string} codigo dane completado
   */
  leadingZeros(codigoDane: string): string {
    while (codigoDane.length < 8) codigoDane = codigoDane + '0';
    return codigoDane;
  }

  private createParamsForSP(codigoDane: string, addressType: string) {
    return {
      pi_codigo_dane: codigoDane,
      pi_tipo_dir: addressType,
      po_codigo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      po_descripcion: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      po_c_barrio: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };
  }
}
