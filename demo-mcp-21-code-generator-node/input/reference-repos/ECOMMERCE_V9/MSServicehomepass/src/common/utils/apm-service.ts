import * as APM from '@claro/general-utils-library';
import Logging from "../lib/logging";
import { Etask } from './enums/task.enum';
import { levelsErros } from '@claro/logging-library';

/**
 * Clase con metodos utilitarios apm integrar data aelastic 
 * @author Marlyn Tatiana Quiroz
 */

export default class ApmService {
  static readonly logger = new Logging(ApmService.name);

  /**
   *  @description Metodo implementado para capturar los errores que se puedan generar
   *  unicamente si estan estos capturadores o definidos en los try catch.
   */
  public static async captureError(data: any) {
    this.logger.write('captureError() - capturar los errores que se puedan generar', Etask.APM, levelsErros.INFO);
    APM.captureError(data);
  }

  /**
   *  @description Metodo implementado para que al momento de  iniciar nuestro micro servicio
   *  comience a interceptar (capturar) las transacciones realizadas.
   */
  public static async startTransaction(name): Promise<any> {
    this.logger.write('startTransaction() - capturar las transacciones realizadas', Etask.APM, levelsErros.INFO);
    return APM.startTransaction(name);
  }


  /**
   *  @description Inicia y devuelve un nuevo intervalo asociado con la transacción activa actual
   */
  public static startSpan(name, type, subtype, action) {
    this.logger.write('startSpan() - intervalo asociado con la transacción activa', Etask.APM, levelsErros.INFO);
    return APM.startSpan(name, type, subtype, action);
  }

}