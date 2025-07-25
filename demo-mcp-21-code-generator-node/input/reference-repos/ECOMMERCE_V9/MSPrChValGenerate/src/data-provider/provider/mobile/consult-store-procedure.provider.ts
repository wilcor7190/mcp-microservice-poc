/**
 * clase abstracta donde se configura el store procedure
 * * @author Edwin Avila
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IConsultStoredProcedureProvider {
  abstract consultStoredProcedure(
    sqlConsult: string,
    params: any,
  ): Promise<any>;
}
