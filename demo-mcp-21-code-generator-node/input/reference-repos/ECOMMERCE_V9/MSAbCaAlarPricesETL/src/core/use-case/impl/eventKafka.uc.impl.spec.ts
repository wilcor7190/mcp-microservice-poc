import { ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import generalConfig from "../../../common/configuration/general.config";
import { IEventPricesKafkaUc } from "../eventPricesKafka.uc";
import { EventPricesKafkaUcImpl } from "./eventPricesKafka.uc.impl";

describe('TestService retryDisponibility', () => {
    let service: IEventPricesKafkaUc;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                      name: 'KAFKA',
                      transport: Transport.KAFKA,
                      options: {
                        consumer: {
                          groupId: generalConfig.kafkaIdGroup,
                        },
                        client: {
                          brokers: [generalConfig.kafkaBroker],
                          ssl: false,
                        },
                      },
                    },
                  ])],
            providers: [
                { provide: IEventPricesKafkaUc, useClass: EventPricesKafkaUcImpl },
            ],
        }).compile();

        service = module.get<IEventPricesKafkaUc>(IEventPricesKafkaUc);
    });

    it('unit test retryDisponibility', async () => {
        let resp = await service.eventPricesKafka();      

        expect(resp).toBeUndefined();
    });

    it('unit test retryDisponibility', async () => {
      jest.spyOn(service, 'eventPricesKafka')

      await service.eventPricesKafka()
      
      expect(service.eventPricesKafka).toHaveBeenCalledTimes(1)
      expect(service.eventPricesKafka).toHaveBeenCalledWith()
  });

});