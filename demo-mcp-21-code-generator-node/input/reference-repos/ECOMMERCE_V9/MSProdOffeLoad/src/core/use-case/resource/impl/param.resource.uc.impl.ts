import { Injectable } from '@nestjs/common';
import Logging from '../../../../common/lib/logging';
import Traceability from '../../../../common/lib/traceability';
import { Etask } from '../../../../common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from '../../../../common/utils/enums/tracing.enum';
import GeneralUtil from '../../../../common/utils/generalUtil';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { IParamUc } from '../param.resource.uc';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { IServiceTracingUc } from '../service-tracing.resource.uc';
import { IParam } from '@claro/generic-models-library';

/**
 * Clase para la configuración de parametros generales
 * @author Santiago Vargas
 */
@Injectable()
export class ParamUcimpl implements IParamUc {

    public static params: IParam[];
    private readonly logger = new Logging(ParamUcimpl.name);

    constructor(
        public readonly _paramProvider: IParamProvider,
        public readonly _serviceError: IServiceErrorUc,
        public readonly _serviceTracing: IServiceTracingUc,
    ) { }

    public static get getMessages(): IParam[] {
        return ParamUcimpl.params;
    }

    async loadParams(): Promise<any> {
        let param: IParam[] = [];
        try {
            param = await this._paramProvider.getParams(1, 100, {});
        } catch (error) {

            this.createTraceability(
                EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_LOAD_PARAM,);
            this.logger.write(`Error cargando parámetros`, Etask.LOAD_MESSAGE, error);
        } finally {
            // Actualizar variable estática
            ParamUcimpl.params = param;
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
    task: ETaskTracingGeneral
): Promise<void> {
    let traceability = new Traceability({});
    traceability.setTransactionId(GeneralUtil.getCorrelationalId);
    traceability.setStatus(status);
    traceability.setDescription(description);
    traceability.setTask(task);
    await this._serviceTracing.createServiceTracing(traceability.getTraceability());
}
}