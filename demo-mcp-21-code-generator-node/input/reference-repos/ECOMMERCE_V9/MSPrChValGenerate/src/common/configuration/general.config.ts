/**
 * Se almacena la configuracion de los nombres de los métodos que se usan
 * @author alexisterzer
 */
const SFTP_MODULE_USERNAME = process.env.SFTP_MODULE_USERNAME || 'cshv9qa';
const SFTP_MODULE_PASSWORD = process.env.SFTP_MODULE_PASSWORD || 'gR&O&RW#hYfV';
const SFTP2_MODULE_USERNAME = process.env.SFTP2_MODULE_USERNAME || 'cshv9qa';
const SFTP2_MODULE_PASSWORD = process.env.SFTP2_MODULE_PASSWORD || 'gR&O&RW#hYfV';

const protocol = '';

export default {
  apiMapping: process.env.API_MAPPING || '/MSPrChValGenerate',
  apiVersion: process.env.API_VERSION || 'V1',
  controllerMessage: process.env.CONTROLLER_MESSAGE || '/Message',
  contingencyController: process.env.CONTINGENCY_CONTROLLER || '/contingency',
  jobConvertionController: process.env.JOBCONVERTION_CONTROLLER || '/jobConvertion',
  controllerError: process.env.CONTROLLER_ERROR || '/errors',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0),
  sftpModuleHost: process.env.SFTP_MODULE_HOST || `${protocol}172.22.94.68`,
  sftpModulePort: process.env.SFTP_MODULE_PORT || '22',
  sftpModuleUsername: SFTP_MODULE_USERNAME,
  sftpModulePassword: SFTP_MODULE_PASSWORD,
  sftp2ModuleHost: process.env.SFTP2_MODULE_HOST || `${protocol}172.22.94.68`,
  sftp2ModulePort: process.env.SFTP2_MODULE_PORT || '22',
  sftp2ModuleUsername: SFTP2_MODULE_USERNAME,
  sftp2ModulePassword: SFTP2_MODULE_PASSWORD,
  cronExecutionFeatures: process.env.CRON_EXECUTION_FEATURES || '0 0-23/1 * * *',
  cronExecutionSPMovil: process.env.CRON_EXECUTION_SP_MOVIL || '0 0-23/1 * * *',
  cronExecutionFeaturesPricesTyT: process.env.CRON_EXECUTION_TYT_PRICESATTRIBUTES || '0 0-23/1 * * *',
  cronExecutionMobilePricesAttributes: process.env.CRON_EXECUTION_MOBILE_PRICESATTRIBUTES || '0 0-23/1 * * *',
  cronExecutionHomesPricesAttributes: process.env.CRON_EXECUTION_HOMES_PRICESATTRIBUTES || '0 0-23/1 * * *',
  paginationDB: Number(process.env.PAGINATION_DB) || 100,
  origenJob: 'JOBPrChValGenerateSP',
  specificationSubtype: process.env.SPECIFICATION_SUBTYPE || 'Telefono',
  specificationSubtypePos: process.env.SPECIFICATION_SUBTYPEPOS || 'Movil',
  specificationSubtypePre: process.env.SPECIFICATION_SUBTYPEPRE || 'Movil',
  servicesOmnLimit: process.env.SERVICE_OMN_LIMIT || 100,
  disponibilityManualController: process.env.DISPONIBILITY_CONTROLLER_MANUAL || '/loadManual',
  logTrazabililty: (process.env.LOG_TRAZABILITY === 'true'),

}
export class GlobalReqOrigin {
  static globalOrigin: any;
  static client: Object;
  static request: any;
  static requestHeaders: string;
}