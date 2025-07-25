/**
 * Clase que se implementa para realizar las respectivas operaciones de consultas e instalacion de servicios en hogares
 * @author Juan David Marin
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import GeneralUtil from '../../../common/utils/generalUtil';
import { BusinessException } from '../../../common/lib/business-exceptions';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { IHomePassService } from '../homepass.service';
import { HomePassDTO } from '../../../controller/dto/hompass/hompass.dto';
import { IOrchHomepassUc } from '../../../core/use-case/orchHomepass.uc';
import { EValidationHomepass } from '../../../common/utils/enums/homepass.enum';
import Logging from '../../../common/lib/logging';
import { ETaskDesc, Etask } from '../../../common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class HomePass implements IHomePassService {
  private readonly logger = new Logging(HomePass.name);
  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _orchHomePass: IOrchHomepassUc,
  ) {}

  /**
   * Metodo utilizado para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {HomePassDTO} homePassDTO Informacion ingresada por el usuario para validar cobertura
   * @returns una promesa
   */
  async consultHomePass(homePassDTO: HomePassDTO, channel: string) {
    this.logger.write('Inicio consultHomePass()', Etask.CONSULT_HOMEPASS, ELevelsErrors.INFO, homePassDTO);
    try {
      this._validateChannel.validateChannel(channel);
      const result = await this._orchHomePass.initialFunction(homePassDTO, channel);

      if (result.message === EValidationHomepass.VALIDACION_STRATUM) {
        delete result.message;
        return new ResponseService(true, EmessageMapping.VALIDACION_STRATUM, HttpStatus.OK, result);
      }

      if (result.message === EValidationHomepass.CON_SERVICIO) {
        delete result.message;
        return new ResponseService(true, EmessageMapping.CON_SERVICIO, HttpStatus.OK, result);
      }
      if (result.message === EValidationHomepass.CON_COBERTURA) {
        delete result.message;
        return new ResponseService(true, EmessageMapping.CON_COBERTURA, HttpStatus.OK, result);
      }
      if (result.message === EValidationHomepass.SIN_COBERTURA) {
        delete result.message;
        return new ResponseService(true, EmessageMapping.SIN_COBERTURA, HttpStatus.OK, result);
      }
      if (result.message === EValidationHomepass.SIN_COBERTURA_STRATA_MINUSONE) {
        delete result.message;
        return new ResponseService(true, EmessageMapping.DIRECCION_SIN_COBERTURA, HttpStatus.OK, result);
      }

      if (result.code == '-1') return new ResponseService(false, EmessageMapping.LEGADO_ERROR, HttpStatus.CREATED, result);
      if (result.Response === EmessageMapping.CLIENTE_OPERACION) return new ResponseService(true, result.Response, HttpStatus.CREATED);
      if (result.source === false) throw new BusinessException(HttpStatus.CREATED, EmessageMapping.DEFAULT_ERROR, result);
      if (result.message === EValidationHomepass.HHPP_NO_EXISTE) return new ResponseService(true, EValidationHomepass.HHPP_NO_EXISTE, HttpStatus.OK, result);

      return new ResponseService(true, EmessageMapping.DEFAULT, HttpStatus.OK, result);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_HOMEPASS, ETaskDesc.CONSULT_HOMEPASS);
      throw error;
    }
  }
}
