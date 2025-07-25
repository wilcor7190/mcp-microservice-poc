import { Test, TestingModule } from '@nestjs/testing';
import { IMessageProvider } from '../../../data-provider/message.provider';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { MessageUcimpl } from './message.uc.impl';
import { getModelToken } from '@nestjs/mongoose';
import { IMessage, MessageModel } from '@claro/generic-models-library';

describe('MessageUcimpl ', () => {
  let service: MessageUcimpl;
  let imessageProvider: IMessageProvider;

  beforeEach(async () => {
    imessageProvider = {
      getMessages: jest.fn(),
      getFilter: jest.fn(),
      createMessages: jest.fn(),
      updateMessage: jest.fn(),
      getTotal: jest.fn(),
      getMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUcimpl,
        { provide: IMessageProvider, useValue: imessageProvider },
        {
          provide: getModelToken(MessageModel.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            countDocuments: jest.fn(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
          },
        },
      ],
      exports: [IMessageProvider],
    }).compile();
    service = module.get<MessageUcimpl>(MessageUcimpl);
  });

  it('Metodo loadMessages para buscar todos los mensajes en coll_message', async () => {
    expect(imessageProvider.getMessages).toBeDefined();
  });

  it('Metodo getMessages para cargar mensajes ', async () => {
    let message: IMessage = {
      id: EmessageMapping.DEFAULT_ERROR,
      description: 'Error interno del servicio',
      message: '¡Ups¡, parece que algo salió mal, inténtalo nuevamente.',
    };
    const page = 1941;
    const limit = 86;
    const result = await service.getMessages(page, limit, message);
    expect(result).toBeDefined;
    expect(imessageProvider.getFilter).toBeDefined();
  });
});
