import { Test, TestingModule } from '@nestjs/testing';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { IMessage } from '@claro/generic-models-library';
import { IMessageProvider } from 'src/data-provider/message.provider';
import { MessageUcimpl } from './message.uc.impl';
import { error } from 'console';

describe('MessageUcimpl ', () => {
  let service: MessageUcimpl;
  let imessageProvider: jest.Mocked<IMessageProvider>

  beforeEach(async () => {
    imessageProvider = {
      getMessages: jest.fn(),
      getMessage: jest.fn(),
      getTotal: jest.fn(),
      updateMessage: jest.fn(),
    }as jest.Mocked<IMessageProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUcimpl,
        { provide: IMessageProvider, useValue: imessageProvider },
      ],
    }).compile();
    service = module.get<MessageUcimpl>(MessageUcimpl);
  });

  it('Metodo loadMessages para buscar todos los mensajes en coll_message', async () => {
    await service.loadMessages();
    expect(imessageProvider.getMessages).toHaveBeenCalled;
  });

  it('Metodo loadMessages error', async () => {
    imessageProvider.getMessages.mockRejectedValue(new Error());

    await service.loadMessages();

    expect(error).toBeDefined();
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
    expect(imessageProvider.getMessages).toBeDefined;
  });

  it('Metodo getById', async () => {
    const content = {} as any
    await service.getById(content);
    expect(imessageProvider.getMessage).toHaveBeenCalled;
  });

});
