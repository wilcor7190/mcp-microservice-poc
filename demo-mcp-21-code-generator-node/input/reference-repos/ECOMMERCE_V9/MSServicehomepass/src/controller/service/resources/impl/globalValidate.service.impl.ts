/**
 * Clase para realizar la validación de los canales permitidos en el ms
 * @author Oscar Avila
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { IGlobalValidateService } from '../globalValidate.service';
import GeneralUtil from '../../../../common/utils/generalUtil';
import { BusinessException } from '../../../../common/lib/business-exceptions';
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';

@Injectable()
export class GlobalValidateService implements IGlobalValidateService {
  /**
   * Consulta si un canal recibido es correcto
   * @param {String} channel Canal recibido por el usuario en header
   * @returns {boolean} confirmacion de validacion
   */
  public validateChannel(channel: string): any {
    const channelValidate: boolean = GeneralUtil.validateChannel(channel);
    if (!channelValidate) {
      throw new BusinessException(HttpStatus.BAD_REQUEST, EmessageMapping.CHANNEL_ERROR, true);
    }
    return true;
  }
}
