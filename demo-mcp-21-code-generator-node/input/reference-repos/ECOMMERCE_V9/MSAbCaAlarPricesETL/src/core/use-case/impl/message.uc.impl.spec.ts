import { Test, TestingModule } from "@nestjs/testing";
import { IMessageProvider } from "../../../data-provider/message.provider";
import { EmessageMapping } from "../../../common/utils/enums/message.enum";
import { MessageProvider } from "../../../data-provider/provider/message.provider.impl";
import { MessageUcimpl } from "./message.uc.impl";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import databaseConfig from "../../../common/configuration/database.config";
import { IMessage, MessageModel } from "@claro/generic-models-library";

describe('MessageUcimpl ', () => {
  let service: MessageUcimpl;
  let imessageProvider: IMessageProvider;
  let model: Model<MessageModel>;

  beforeEach(async () => {
    imessageProvider = {
        createMessages: jest.fn(),
        getMessages: jest.fn(),
        getMessage: jest.fn(),
        getTotal: jest.fn(),
        updateMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUcimpl,
        { provide: IMessageProvider, useClass: MessageProvider },
        { provide: getModelToken(MessageModel.name, databaseConfig.database), useValue:  {
          find: jest.fn().mockReturnThis(),
          countDocuments: jest.fn(),
          skip:jest.fn().mockReturnThis(),
          limit:jest.fn().mockReturnThis(),
        } },
      ],
      exports:[IMessageProvider],
    }).compile();
    service = module.get<MessageUcimpl>(MessageUcimpl);
    model = module.get<Model<MessageModel>>(getModelToken(MessageModel.name, databaseConfig.database));
  });

  it('Metodo loadMessages para buscar todos los mensajes en coll_message', async () => {
    const result = await service.loadMessages()
      expect(imessageProvider.getMessages).toBeDefined();
  });

  it('Metodo getMessages para cargar mensajes ', async () => {
    let message: IMessage={
      id: EmessageMapping.DEFAULT_ERROR,
      description: 'Error interno del servicio',
      message: '¡Ups¡, parece que algo salió mal, inténtalo nuevamente.'
  }
    const page = 1941;
    const limit = 86;
    const result = await service.getMessages(page, limit, message)
      expect(result).toBeDefined;
    expect(imessageProvider.getMessages).toBeDefined();
  });


});