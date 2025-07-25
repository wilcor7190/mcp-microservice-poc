/**
 * clase abtracta para la conexion a oracle
 * @author Daniel Felipe Torres Vanegas
 */

import { Injectable } from '@nestjs/common';
import { ENameCursorDB } from 'src/common/utils/enums/store-procedure.enum';

@Injectable()
export abstract class IOracleProvider {

    /**
     * Operacion encargada de ejecutar los querys a oralce
     * @param query consulta o procedimiento almacenado
     * @param params parametros de salida (Cursores)
     * @param reference referencia de ejecucion
     */
    abstract execute(query: string, params: any, reference: string, nameCursor: ENameCursorDB, isMaped?: boolean): Promise<any>;
}