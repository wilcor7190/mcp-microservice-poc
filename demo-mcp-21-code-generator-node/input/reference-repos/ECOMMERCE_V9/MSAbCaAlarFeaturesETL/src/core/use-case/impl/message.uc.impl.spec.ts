import { Test, TestingModule } from '@nestjs/testing';
import { IMessage } from '@claro/generic-models-library';
import { IMessageProvider } from './../../../data-provider/message.provider';
import { ResponsePaginator } from '../../../controller/dto/response-paginator.dto';
import { MessageUcimpl } from './message.uc.impl';

describe('MessageUcimpl', () => {
  let messageUcimpl: MessageUcimpl;
  let messageProviderMock: jest.Mocked<IMessageProvider>;

  beforeEach(async () => {
    messageProviderMock = {
      getMessages: jest.fn(),
      updateMessage: jest.fn(),
      getMessage: jest.fn(),
      loadMessages: jest.fn(),
      getTotal: jest.fn(),
    } as jest.Mocked<IMessageProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUcimpl,
        { provide: IMessageProvider, useValue: messageProviderMock },
      ],
    }).compile();

    messageUcimpl = module.get<MessageUcimpl>(MessageUcimpl);
  });

  describe('loadMessages', () => {
    it('debería cargar los mensajes del proveedor de mensajes y actualizar la variable estática ', async () => {
      const mockMessages: IMessage[] = [
        { id: '1', message: 'Message 1', description: '' },
      ];
      jest
        .spyOn(messageProviderMock, 'getMessages')
        .mockResolvedValue(mockMessages);

      await messageUcimpl.loadMessages();

      expect(messageProviderMock.getMessages).toHaveBeenCalledWith(1, 100, {});
      expect(MessageUcimpl.getMessages).toEqual(mockMessages);
    });

    it('debería registrar un error si hay un error al cargar los mensajes', async () => {
      const mockError = new Error('Failed to load messages');
      jest
        .spyOn(messageProviderMock, 'getMessages')
        .mockRejectedValue(mockError);
      const loggerSpy = jest.spyOn(messageUcimpl['logger'], 'write');

      await messageUcimpl.loadMessages();

      expect(messageProviderMock.getMessages).toHaveBeenCalledWith(1, 100, {});
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error cargando mensajes',
        'CARGANDO_MENSAJES',
        'error',
        mockError,
      );
    });
  });

  describe('getById', () => {
    it('debería obtener un mensaje por su ID desde el proveedor de mensajes', async () => {
      const mockMessage: IMessage = {
        id: '1',
        message: 'Test Message',
        description: '',
      };
      jest
        .spyOn(messageProviderMock, 'getMessage')
        .mockResolvedValue(mockMessage);

      const result = await messageUcimpl.getById('1');

      expect(messageProviderMock.getMessage).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMessage);
    });
  });

  describe('getMessages', () => {
    it('debería obtener los mensajes del proveedor de mensajes y devolver un ResponsePaginator', async () => {
      const mockFilter = {
        /* filter */
      };
      const mockDocuments: IMessage[] = [
        { id: '1', message: 'Message 1', description: '' },
      ];
      const mockResponsePaginator: ResponsePaginator<IMessage> =
        new ResponsePaginator(mockDocuments, 1, 100);

      jest.spyOn(messageProviderMock, 'getTotal').mockResolvedValue(1);
      jest
        .spyOn(messageProviderMock, 'getMessages')
        .mockResolvedValue(mockDocuments);

      const result = await messageUcimpl.getMessages(1, 100, mockFilter);

      expect(messageProviderMock.getTotal).toHaveBeenCalledWith(mockFilter);
      expect(messageProviderMock.getMessages).toHaveBeenCalledWith(
        1,
        100,
        mockFilter,
      );
      expect(result).toEqual(mockResponsePaginator);
    });
  });
});
