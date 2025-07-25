import { Test, TestingModule } from '@nestjs/testing';
import { IMessageProvider } from '../../../data-provider/message.provider';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { MessageUcimpl } from './message.uc.impl';
import { IMessage } from '@claro/generic-models-library';

describe('MessageUcimpl ', () => {
  let service: MessageUcimpl;
  let imessageProvider: IMessageProvider;
  let message: IMessage = {
    id: EmessageMapping.DEFAULT_ERROR,
    description: 'Error interno del servicio',
    message: '¡Ups¡, parece que algo salió mal, inténtalo nuevamente.',
  };

  beforeEach(async () => {
    imessageProvider = {
      getMessages: jest.fn(),
      getFilter: jest.fn().mockResolvedValue(message),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUcimpl,
        {
          provide: IMessageProvider,
          useValue: imessageProvider,
        },
      ],
    }).compile();
    service = module.get<MessageUcimpl>(MessageUcimpl);
  });

  it('Metodo loadMessages para buscar todos los mensajes en coll_message', async () => {
    await service.loadMessages();
    expect(imessageProvider.getMessages).toHaveBeenCalled();
  });

  it('Metodo getMessages para cargar mensajes ', async () => {
    const page = 1941;
    const limit = 86;
    await service.getMessages(page, limit, message);
    expect(imessageProvider.getFilter).toHaveBeenCalled();
  });
  it('Metodo getFilter response total 0', async () => {
    let message: IMessage = {
      id: EmessageMapping.DEFAULT_ERROR,
      description: 'Error interno del servicio',
      message: '¡Ups¡, parece que algo salió mal, inténtalo nuevamente.',
    };
    const page = 1941;
    const limit = 86;
    await service.getMessages(page, limit, message);
    expect(imessageProvider.getFilter).toHaveBeenCalled();
    expect(imessageProvider.getMessages).toHaveBeenCalled();
  });
});
