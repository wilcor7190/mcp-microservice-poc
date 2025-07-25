/**
 * Clase que se implementa para orquestar las operaciones que es posible realizar por medio del servicio
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IHomePassUc } from '../inspira/homePass.uc';
import { IHomepassOperacion } from '../operation/homepassOperacion';
import { IOrchHomepassUc } from '../orchHomepass.uc';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class OrchHomePassUcimpl implements IOrchHomepassUc {
  private readonly logger = new Logging(OrchHomePassUcimpl.name);

  constructor(
    public readonly _homepassOperacion: IHomepassOperacion,
    public readonly _homepass: IHomePassUc,
  ) {}

  /**
   * Metodo para orquestar las funciones posibles a realizar
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {any} data Informacion ingresada por el usuario para validar cobertura
   * @returns una promesa
   */
  initialFunction(data: any, channel: any): any {
    this.logger.write('Orquestador', Etask.ORCHESTRATOR, ELevelsErrors.INFO, data);
    if (!data.isMigratedUser) {
      return this._homepass.initialFunction(data, channel);
    } else {
      return this._homepassOperacion.provitionalFunction();
    }
  }
}
