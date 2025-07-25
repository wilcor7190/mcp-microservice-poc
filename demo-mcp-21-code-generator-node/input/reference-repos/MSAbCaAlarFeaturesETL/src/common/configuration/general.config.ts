/**
 * Se almacena la configuracion de los nombres de los métodos que se usan
 * @author Santiago Vargas
 */

export default {
  apiMapping: process.env.API_MAPPING || '/RSAbsoluteCalendarAlarmFeaturesETL',
  apiVersion: process.env.API_VERSION || 'V1',
  controllerCategories: process.env.CONTROLLER || '/Categories/manual',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0),
  cronExecutionCategories: process.env.CRON_EXECUTION_CATEGORIES || '0 0 0 1 1 *',
  logTrazabililty: (process.env.LOG_TRAZABILITY === 'true'),

  // Ruta Img
  urlImage: process.env.URL_IMAGE || 'https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/',
  sizeFullImage: process.env.SIZE_FULL_IMAGE || '646x1000',
  sizeThumbnail: process.env.SIZE_THUMBNAIL || '200x310',

  // Kafka
  kafkaBroker: process.env.KAFKA_BROKER || '10.17.1.254:9095',
  kafkaIdGroup: process.env.KAFKA_ID_GROUP || 'kafka-ms-abcalar-feature-etl',
  kafkaTopic: process.env.KAFKA_TOPIC || 'calendaralarmfeaturestopic'
}
export class GlobalReqOrigin {
  static globalOrigin: any;
  static client: Object;
  static request: any;
  static requestHeaders: string;
}