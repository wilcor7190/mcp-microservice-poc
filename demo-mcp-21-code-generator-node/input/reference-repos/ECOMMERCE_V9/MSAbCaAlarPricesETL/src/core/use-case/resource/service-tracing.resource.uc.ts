import { Injectable } from '@nestjs/common';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import { IServiceTracing } from '@claro/generic-models-library';
@Injectable()
export abstract class IServiceTracingUc {
  abstract createServiceTracing(
    serviceTracing: IServiceTracing,
    level?: ELevelsErros,
    processingTime?: number
  );
}
