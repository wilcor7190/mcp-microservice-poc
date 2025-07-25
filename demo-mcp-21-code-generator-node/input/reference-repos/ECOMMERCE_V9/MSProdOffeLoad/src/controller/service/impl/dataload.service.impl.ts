/**
 * Clase para realizar la creación de dataloads
 * @author Santiago Vargas
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import Traceability from '../../../common/lib/traceability';
import GeneralUtil from '../../../common/utils/generalUtil';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from '../../../common/utils/enums/tracing.enum';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import Logging from '../../../common/lib/logging';
import { ETaskDesc, Etask } from '../../../common/utils/enums/taks.enum';
import { IDataloadDTO } from '../../../controller/dto/dataload/dataload.dto';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IOrchDataloadUC } from '../../../core/use-case/orch-dataload.uc';
import { IServiceErrorUc } from '../../../core/use-case/resource/service-error.resource.uc';
import { IDataloadService } from '../dataload.service';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class DataloadService implements IDataloadService {

  constructor(
    private readonly orchDataloadUC: IOrchDataloadUC,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(DataloadService.name);

  /**
   * Valida la categoria y crea el dataload
   * @param {IDataloadDTO} req Categoria y dataload a generar
   * @returns {ResponseService} Inicio de creación del dataload
   */
  async generateDataloadManual(req: IDataloadDTO): Promise<ResponseService>{
    const transaction = await APM.startTransaction(`generateDataloadManual - GENERANDO DATALOAD MANUAL`);
    try {
      this.orchDataloadUC.orchDataload(req);
      return new ResponseService(
        true, 
        Etask.DATALOAD_MANUAL, 
        HttpStatus.OK, 
        { code: "0000", message: "Creado" }
      );
    } catch (error) {
      this.logger.write(ETaskDesc.ERROR_GENERATE_DATALOAD, `${Etask.DATALOAD_MANUAL}, ${req}`);

      this.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_GENERATE_DATALOAD,);

      return new ResponseService(false, ETaskDesc.ERROR_GENERATE_DATALOAD, error.code, { error: error.stack, message: error.description })
    }finally {
      transaction.end();
  }
  }

  /**
   * Funcion para registrar la trazabilidad
   * @param {EStatusTracingGeneral} status Estado de la trazabilidad
   * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
   * @param {ETaskTracingGeneral}task Nombre de la tarea
   */
  private async createTraceability(
    status: EStatusTracingGeneral,
    description: EDescriptionTracingGeneral | string,
    task: ETaskTracingGeneral,
  ): Promise<void> {
    let traceability = new Traceability({});
    traceability.setTransactionId(GeneralUtil.getCorrelationalId);
    traceability.setStatus(status);
    traceability.setDescription(description);
    traceability.setTask(task);
    await this._serviceTracing.createServiceTracing(
      traceability.getTraceability(),
    );
  }
}