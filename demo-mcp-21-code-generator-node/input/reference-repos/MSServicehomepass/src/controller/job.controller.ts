/**
 * Clase controladora para realizar las respectivas operaciones de actualizar las ordenes de servicio en hogares
 * @author Juan David Marin
 */
import { Controller, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { ResponseService } from './dto/response-service.dto';
import { IJobService } from './service/get-state-homepass.service';
import { Swagger } from '../common/utils/enums/message.enum';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
@ApiTags(`${generalConfig.controllerJob}`)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerJob}`)
export class JobController {
  private readonly logger = new Logging(JobController.name);
  constructor(private readonly _httpJobService: IJobService) {}

  /**
   * Job utilziado para gestionar los estados de las solicitudes HomePass con estado pendientes, en proceso y terminadas.
   * @param channel
   * @returns una promesa
   */
  @Post()
  @ApiOperation({ operationId: 'getAll', description: Swagger.GET_JOB })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiResponse({ type: ResponseService })
  executeJob() {
    this.logger.write('executeJob()', Etask.MANUAL_JOB_EXECUTION, ELevelsErrors.INFO);
    return this._httpJobService.execJob();
  }
}
