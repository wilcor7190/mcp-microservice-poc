/**
 * Clase implementada como modulo global para conexion transversal a oracle
 * @author Daniel Felipe Torres Vanegas
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IOracleProvider } from '../oracle.provider';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import databaseConfig from 'src/common/configuration/database.config';
import { Span } from 'elastic-apm-node';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import  Traceability  from 'src/common/lib/traceability';
import { EOracleConnectionStatus, EProcessStatus } from 'src/common/utils/enums/params.enum';
import { EStatusTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import ApmService from 'src/common/utils/apm-service';
import GeneralUtil from 'src/common/utils/generalUtil';
import { ResultSet } from 'oracledb';
import { ENameCursorDB } from 'src/common/utils/enums/store-procedure.enum';
import { ResponseDB } from 'src/core/entity/response-db.entity';
const oracledb = require('oracledb');

@Injectable()
export class OracleProvider implements IOracleProvider, OnModuleInit, OnModuleDestroy {

  public static ORACLE_CLIENT_CONNECTION: any;
  private readonly logger = new Logging(OracleProvider.name);

  constructor(private readonly _serviceTracing: IServiceTracingUc) { }

  /**
  * Al cargar el modulo se inicia la conexion a oracle
  */
  onModuleInit() {
    this.oracleConnection(EOracleConnectionStatus.CONNECTION)
      .catch((error) => this.logger.write(`Error conexion a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, EOracleConnectionStatus.CONNECTION, error))
  }

  /**
   * Función para conectar o reconectar a base de datos ORACLE
   * @param status me indica si es por conexion o reconexion
   */
  oracleConnection(status: string): Promise<void> {
    let endTime: number[], spanIn: Span;
    const startTime = process.hrtime();
    return new Promise((resolve, reject) => {
      this.logger.write(`Inicio ${status} a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO);

      if (status == EOracleConnectionStatus.RECONNECTION)
        spanIn = ApmService.startSpan(EOracleConnectionStatus.RECONNECTION.toUpperCase(), MappingApiRest.DB, Etask.ORACLE_DATABASE.toLowerCase(), Etask.APM);

      // Tiempo maximo de espera configurado en variavble de entorno
      let executionProcess: string = EProcessStatus.START;
      setTimeout(() => {
        if (executionProcess == EProcessStatus.START) {

          endTime = process.hrtime(startTime);
          executionProcess = EProcessStatus.ERROR;
          this.logger.write(`Fin ${status} a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, null, 'timeout exceeded ' + status, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));

          if (spanIn) spanIn.end();
          reject({
            stack: Etask.ORACLE_DATABASE,
            message: 'timeout exceeded ' + status
          });
        }
      }, databaseConfig.timeout as number);

      (oracledb.getConnection(databaseConfig.connStr) as Promise<any>)
        .then((connection: any) => {
          OracleProvider.ORACLE_CLIENT_CONNECTION = connection;
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        })
        .finally(() => {
          if (executionProcess == EProcessStatus.START) {
            if (spanIn) spanIn.end();
            executionProcess = EProcessStatus.SUCCESS;
            endTime = process.hrtime(startTime);
            this.logger.write(`Fin ${status} a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, null, null, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));
          }
        })
    })
  }

  /**
   * Funcion encargada de validar si la conexion a ORACLE esta disponible
   * @returns {boolean} true = conexion disponible, false = no hay conexion
   */
  validateConnection(): Promise<boolean> {
    this.logger.write(`Inicio validacion de conexión oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO);
    return new Promise((resolve) => {

      let endTime: number[];
      const startTime = process.hrtime();
      const spanIn: Span = ApmService.startSpan(EOracleConnectionStatus.PING.toUpperCase(), MappingApiRest.DB, Etask.ORACLE_DATABASE.toLowerCase(), Etask.APM);

      // Tiempo maximo de espera para validar ping 3 segundos
      let executionProcess: string = EProcessStatus.START;
      setTimeout(() => {
        if (executionProcess == EProcessStatus.START) {
          if (spanIn) spanIn.end();
          endTime = process.hrtime(startTime);
          executionProcess = EProcessStatus.ERROR;
          this.logger.write(`Fin validacion de conexión oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, null, null, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));
          resolve(false)
        }
      }, 3000);

      // Si el ping no esta disponible
      if (!OracleProvider.ORACLE_CLIENT_CONNECTION || !OracleProvider.ORACLE_CLIENT_CONNECTION?.ping) {
        if (spanIn) spanIn.end();
        endTime = process.hrtime(startTime);
        executionProcess = EProcessStatus.ERROR;
        this.logger.write(`Fin validacion de conexión oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, null, null, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));
        resolve(false);
      }

      // Ejecucion de promesa PING a Oracle
      (OracleProvider.ORACLE_CLIENT_CONNECTION.ping() as Promise<any>)
        .then(() => resolve(true))
        .catch(() => resolve(false))
        .finally(() => {
          if (executionProcess == EProcessStatus.START) {
            if (spanIn) spanIn.end();
            executionProcess = EProcessStatus.SUCCESS;
            endTime = process.hrtime(startTime);
            this.logger.write(`Fin validacion de conexión oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, null, null, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));
          }
        })
    })
  }

  /**
   * Funcion encargada de ejecutar las consultas o procedimientos a ORACLE
   * @param query consulta o procedimiento almacenado
   * @param params parametros
   * @param reference me indica que query o procedimiento esta ejecutando
   */
  runOracle(query: string, params: any, reference: string): Promise<any> {
    let endTime: number[], spanIn: Span, result: any;
    const startTime = process.hrtime();
    return new Promise((resolve, reject) => {

      const action: string = JSON.stringify({ query, params }).split("\\n").join(" ");
      this.logger.write(`Inicio ejecución de consulta o procedimiento almacenado Oracle | ${reference}`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO);
      spanIn = ApmService.startSpan(reference, MappingApiRest.DB, Etask.ORACLE_DATABASE.toLowerCase(), action);

      // Tiempo maximo de espera configurado en variavble de entorno
      let executionProcess: string = EProcessStatus.START;
      setTimeout(() => {
        if (executionProcess == EProcessStatus.START) {

          if (spanIn) spanIn.end();
          endTime = process.hrtime(startTime);
          executionProcess = EProcessStatus.ERROR;
          this.logger.write(`Resultado ejecución de consulta o procedimiento almacenado Oracle | ${reference}`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, params, 'timeout exceeded ' + reference, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));

          reject({
            stack: Etask.ORACLE_DATABASE,
            message: 'timeout exceeded ' + reference
          });
        }
      }, databaseConfig.timeout as number);

      (OracleProvider.ORACLE_CLIENT_CONNECTION.execute(query, params) as Promise<any>)
        .then((response: any) => {
          result = response;
          resolve(result);
        })
        .catch((error: any) => reject(error))
        .finally(() => {
          if (executionProcess == EProcessStatus.START) {
            if (spanIn) spanIn.end();
            executionProcess = EProcessStatus.SUCCESS;
            endTime = process.hrtime(startTime);
            this.logger.write(`Resultado ejecución de consulta o procedimiento almacenado Oracle | ${reference}`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO, params, result?.outBinds?.po_descripcion, Math.round(endTime[0] * 1000 + endTime[1] / 1000000));
          }
        })
    });
  }

  /**
   * Funcion encargada de ejecutar los querys a oralce
   * @param query consulta o procedimiento almacenado
   * @param params parametros de salida (Cursores)
   */
  async execute<T = any>(query: string, params: any, reference: string, nameCursor: ENameCursorDB, isMaped?: boolean): Promise<any> {
    let result: any;
    const startTime = process.hrtime();
    let data: ResponseDB<T>;
    try {
      // Validamos conexion a oracle
      let connectionStatus: boolean = await this.validateConnection();

      // Si la conexion no esta disponible ejecuto reconexion
      if (!connectionStatus)
        await this.oracleConnection(EOracleConnectionStatus.RECONNECTION);

      // Traza
      let traceability = new Traceability({});
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setTask(`REQUEST_CONSUMO_BD_ORALCE: ${reference}`);
      traceability.setStatus(EStatusTracingGeneral.LEGACY_SUCCESS);
      traceability.setRequest({ query, params });
      this._serviceTracing.createServiceTracing(traceability.getTraceability()); 

      // Ejecucion de consulta o procedimiento almacenado
      result = await this.runOracle(query, params, reference);

      data = {
        po_codigo: result?.outBinds?.po_codigo,
        po_descripcion: result?.outBinds?.po_descripcion,
        po_data: isMaped ? await this.dataFromResultSet<T>(result?.outBinds[`${nameCursor}`]) : await result?.outBinds[`${nameCursor}`]?.getRows(),
      };

      return data;

    } catch (error) {
      this.logger.write(`Error execute oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, null, error)
      throw error
    } finally {
      let traceabilityResult = new Traceability({});
      traceabilityResult.setTransactionId(GeneralUtil.getCorrelationalId);
      traceabilityResult.setTask(`RESPONSE_CONSUMO_BD_ORACLE: ${reference}`);
      traceabilityResult.setStatus(result ? EStatusTracingGeneral.LEGACY_SUCCESS : EStatusTracingGeneral.LEGACY_WARN);
      traceabilityResult.setRequest({ query, params });
      traceabilityResult.setResponse(result);
      traceabilityResult.setProcessingTime(Math.round((process.hrtime(startTime)[0] * 1000) + (process.hrtime(startTime)[1] / 1000000)));
      this._serviceTracing.createServiceTracing(traceabilityResult.getTraceability()); 
      if (result?.outBinds[`${nameCursor}`]) {
        try {
          await result?.outBinds[`${nameCursor}`].close(); // Cierra el ResultSet explícitamente
        } catch (closeError) {
          this.logger.write(`Error closing ResultSet`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, null, closeError);
        }
      }
    }
  }

  /**
   * Cuando el modulo se destruyo cerrar coenxion oracle
   */
  onModuleDestroy(): void {
    if (!OracleProvider.ORACLE_CLIENT_CONNECTION || !OracleProvider.ORACLE_CLIENT_CONNECTION?.close)
      return;
    
    this.logger.write(`Inicio desconexión a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO);
    (OracleProvider.ORACLE_CLIENT_CONNECTION.close() as Promise<any>)
      .then(() => {
        this.logger.write(`Fin desconexión a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.INFO);
      })
      .catch((error) => {
        this.logger.write(`Error desconexión a oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, null, error);
      })
  }

  async dataFromResultSet<T = any>(data: ResultSet<any>): Promise<T[]> {
    let response = [];
    try {
  const keys = data.metaData.map((value) => value.name);
      for (const row of await data.getRows()) {
        let obj = {};
        keys.forEach((key, index) => {
          obj[key] = row[index];
        });
        response.push(obj);
      }
      return <T[]>response;
    } catch (e) {
      this.logger.write(`Error execute oracle`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, null, e);
      throw e;
    } finally {
      if (data) {
        try {
          await data.close(); // Cierra el ResultSet explícitamente
        } catch (closeError) {
          this.logger.write(`Error closing ResultSet`, Etask.ORACLE_DATABASE, ELevelsErrors.ERROR, null, closeError);
        }
      }
    }
  }
}