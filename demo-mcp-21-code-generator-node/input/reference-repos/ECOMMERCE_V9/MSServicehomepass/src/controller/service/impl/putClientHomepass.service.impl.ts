/**
 * Clase que se implementa para realizar las respectivas operaciones de consulta de clientes con ordenes de servicio
 * @author Juan David Marin
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import Logging from '../../../common/lib/logging';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import GeneralUtil from '../../../common/utils/generalUtil';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { IPutClientHomepass } from '../putClientHomepass.service';
import { CLienthomepassDto } from '../../../controller/dto/clienthomepass/clienthomepass.dto';
import { IOrchPutClientHomePassUc } from '../../../core/use-case/orchPutClienHomePass.uc';
import { ETaskDesc, Etask } from '../../../common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { LegacyException } from 'src/common/lib/legacy-exeptions';

@Injectable()
export class PutClientHomepass implements IPutClientHomepass {
  private readonly logger = new Logging(PutClientHomepass.name);
  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _orchPutClientHomePassUc: IOrchPutClientHomePassUc,
  ) {}

  /**
   * Metodo que se utiliza para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel canal ingresado por el cliente en el header
   * @param {CLienthomepassDto} cLienthomepassDto informacion a validar
   * @returns una promesa
   */
  async consultPutClientHomepass(channel: string, cLienthomepassDto: CLienthomepassDto): Promise<ResponseService<any>> {
    this.logger.write('consultPutClientHomepass()', Etask.CONSULT_PUT_CLIENT_HOMEPASS, ELevelsErrors.INFO, cLienthomepassDto);
    try {
      this._validateChannel.validateChannel(channel);
      const consulPutClient = await this._orchPutClientHomePassUc.initialFunction(cLienthomepassDto);
      if (consulPutClient.Response === EmessageMapping.LEGADO_ERROR)
        throw new LegacyException(HttpStatus.SERVICE_UNAVAILABLE, consulPutClient.Response, false, {
          document: {
            code: 50000,
            message: consulPutClient.message || consulPutClient.consultAddress.message,
            source: GeneralUtil.mappingMessage(EmessageMapping[EmessageMapping.SOURCE_ADDRESS]),
          },
        });
      if (consulPutClient.Response === EmessageMapping.DEFAULT) return new ResponseService(true, consulPutClient.Response, HttpStatus.OK);

      if (consulPutClient.Response === EmessageMapping.NO_DATA_FOUND)
        return new ResponseService(false, consulPutClient.Response, HttpStatus.BAD_REQUEST, {
          code: 50000,
          message: GeneralUtil.mappingMessage(EmessageMapping[EmessageMapping.NO_DATA_FOUND]) + ' ' + consulPutClient.idCaseTcrm,
        });
      if (consulPutClient.Response === EmessageMapping.CLIENTE_OPERACION) return new ResponseService(true, consulPutClient.Response, HttpStatus.CREATED);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_PUT_CLIENT_HOMEPASS, ETaskDesc.CONSULT_PUT_CLIENT_HOMEPASS);
      throw error;
    }
  }
}
