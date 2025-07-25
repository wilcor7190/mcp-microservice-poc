import { CronExpression } from "@nestjs/schedule";

export default {
  apiMapping: process.env.API_MAPPING || '/MSAbCaAlarPricesETL',
  apiMappingProductConfiguration: process.env.API_MAPPING_PRODUCT_CONFIGURATION || '/ProductConfiguration',
  apiVersion: process.env.API_VERSION || 'V1',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0),
  logTrazabililty: (process.env.LOG_TRAZABILITY === 'true'),

  //JOB
  controllerManual: process.env.CONTROLLER_MANUAL || '/manual',
  cronPricesEtl: process.env.CRON_PRICESETL || CronExpression.EVERY_12_HOURS,

  //KAFKA
  kafkaBroker: process.env.KAFKA_BROKER || '10.17.1.254:9095',
  kafkaIdGroup: process.env.KAFKA_ID_GROUP || 'kafka-ms-abcalar-prices-etl',
  kafkaTopic: process.env.KAFKA_TOPIC || 'calendaralarmpricestopic'
};

export class GlobalReqOrigin{
  static globalOrigin: any;
  static client:Object;
  static request:any;
  static requestHeaders:string;
}


