/**
 * Clase que se implementa para orquestar las operaciones que es posible realizar por medio del servicio
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IOrchPutClientHomePassUc } from '../../../core/use-case/orchPutClienHomePass.uc';
import { IPutClientHomePass } from '../inspira/putClientHomePass';
import { IPutClientHomePassOperacion } from '../operation/PutClientHomePassOperacion';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class OrchPutClientHomePassUcimpl implements IOrchPutClientHomePassUc {
  private readonly logger = new Logging(OrchPutClientHomePassUcimpl.name);
  constructor(
    public readonly _putClientHomePassOperacion: IPutClientHomePassOperacion,
    public readonly _putClientHomePass: IPutClientHomePass,
  ) {}

  /**
   * Metodo para orquestar las funciones posibles a realizar
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {any} data Informacion ingresada por el usuario para validar cobertura
   * @returns una promesa
   */
  initialFunction(data: any): any {
    if (data.customer.isMigratedUser) {
      this.logger.write('Flujo isMigratedUser = true', Etask.CONSULT_PUT_CLIENT_HOMEPASS, ELevelsErrors.INFO, data);
      return this._putClientHomePassOperacion.provitionalFunction();
    } else {
      this.logger.write('Flujo isMigratedUser = false ', Etask.CONSULT_PUT_CLIENT_HOMEPASS, ELevelsErrors.INFO, data);
      return this._putClientHomePass.putClientHomePass(data);
    }
  }
}
