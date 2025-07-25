/**
 * Clase que se implementa para realizar las respectivas operaciones de detalles de direcciones
 * @author Sebastian Traslaviña
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { GeographicDto } from '../../dto/geographic/geographic.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import GeneralUtil from '../../../common/utils/generalUtil';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { IDetailAddress } from '../detailAddress.service';
import { IDetailAddressUc } from '../../../core/use-case/procedures/detailAddress.uc';
import { ETaskDesc, Etask } from '../../../common/utils/enums/task.enum';
@Injectable()
export class DetailAddress implements IDetailAddress {

  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _detailAddressUc: IDetailAddressUc,
  ) {}

  /**
   * Metodo que realiza la consulta de barrio o barrios por dirección para estandarizar la dirección del cliente en la tienda virtual
   * @param {String} channel canal ingresado por el usuario en el header
   * @param {String} token token ingresado por el usuario en el header
   * @param {GeographicDto} geographicDto Detalles de direccion ingresada por el usuario
   * @returns una promesa
   */

  async consultDetailsAddres(geographicDto: GeographicDto, channel: any): Promise<ResponseService<any>> {
    try {
      this._validateChannel.validateChannel(channel);
      const consultDetailsAddres = await this._detailAddressUc.detailAddress(geographicDto);
      return new ResponseService(true, EmessageMapping.DEFAULT, HttpStatus.CREATED, consultDetailsAddres);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_DETAIL_ADDRESS, ETaskDesc.CONSULT_DETAIL_ADDRESS);
      throw error;
    }
  }
}
