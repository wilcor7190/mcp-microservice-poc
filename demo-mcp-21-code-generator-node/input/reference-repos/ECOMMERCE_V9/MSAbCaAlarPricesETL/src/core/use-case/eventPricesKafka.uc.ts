/**
 * Clase para la emision del evento Kafka
 * @author Oscar Robayo
 */
import { Injectable } from "@nestjs/common";


@Injectable()
export abstract class IEventPricesKafkaUc{
    
    /**
     * Función inicial para la emicion del evento kafka
     */
    abstract eventPricesKafka(): Promise<any>;

}