/**
 * Clase que se implementa para realizar las respectivas operaciones de consulta de barrios por codigo Dane
 * @author Juan David Marin
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import GeneralUtil from '../../../common/utils/generalUtil';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { INeighborhoodbydane } from '../neighborhoodbydane.service';
import { INeighborhoodbydaneUc } from '../../../core/use-case/procedures/neighborhoodbydane.uc';
import { NeighborhoodbydaneDTO } from '../../../controller/dto/neighborhoodbydane/neighborhoodbydane.dto';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import { EStoredName } from 'src/common/utils/enums/store-procedure.enum';
@Injectable()
export class Neighborhoodbydane implements INeighborhoodbydane {
  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _neighborhoodbydaneUc: INeighborhoodbydaneUc,
  ) {}

  /**
   * Metodo que realiza la consulta de un barrio o barrios por el departamento y municipio enviado Para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel
   * @param {string} token
   * @param {NeighborhoodbydaneDTO} neighborhoodbydaneDto
   * @returns una promesa
   */
  async consultNeighborhoodbydane(channel: string, token: string, neighborhoodbydaneDto: NeighborhoodbydaneDTO): Promise<ResponseService<any>> {
    try {
      this._validateChannel.validateChannel(channel);
      const consultNeighborhoodbydane = await this._neighborhoodbydaneUc.neighborhoodbydane(neighborhoodbydaneDto);
      if (consultNeighborhoodbydane instanceof Error) {
        return new ResponseService(false, EmessageMapping.DEFAULT_ERROR, HttpStatus.SERVICE_UNAVAILABLE, {
          code: consultNeighborhoodbydane,
          message: consultNeighborhoodbydane.stack,
          source: EStoredName.CONSULTA_NEIGHBORHOOD,
        });
      }
      return new ResponseService(true, EmessageMapping.DEFAULT, HttpStatus.OK, consultNeighborhoodbydane);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_NEIGHBORHOOD_BY_DANE, ETaskDesc.CONSULT_NEIGHBORHOOD_BY_DANE);
      throw error;
    }
  }
}
