/**
 * Almacena la configuración de conexión a Kafka
 * @author Hamilton Acevedo
 */
import { hostname } from 'os';

const GROUP_ID = `kafka-${hostname()}`;

export default {
  topic: process.env.KAFKA_TOPIC || 'TraceDataTopic',
  broker: process.env.KAFKA_BROKER || 'localhost:9092',
  groupId: GROUP_ID,
  retries: Number(process.env.KAFKA_NUMBER_RETRIES) || 1,
  delayRetry: Number(process.env.KAFKA_DELAY_RETRIES) || 5000,
  collectionTrace: process.env.KAFKA_COLLECTION_TRACE || 'ColProPriceEcomFindProd',
  eventType: process.env.KAFKA_EVENT_TYPE || 'TraceDataTopic',
};