/**
 * Clase abstracta para el manejo de promesas en el ms
 * @author Juan Gabriel Garzon
 */

import { Injectable } from '@nestjs/common';
import { BulkManualDTO } from '../dto/general/general.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IContingencyService {


    abstract getData(): any;

    abstract getDataMobile(): any;

    abstract getDataHomes():  any;

    abstract getDataManual(req: BulkManualDTO): Promise<ResponseService>;
}