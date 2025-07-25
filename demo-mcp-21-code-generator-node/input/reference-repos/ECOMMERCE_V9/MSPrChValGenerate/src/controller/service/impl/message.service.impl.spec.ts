import { MessageService } from './message.service.impl';
import { IMessageUc } from '../../../core/use-case/resource/message.uc';
import { ResponseService } from 'src/controller/dto/response-service.dto';
import { IMessageDTO } from '../../dto/message/message.dto';
import { IMessage } from '@claro/generic-models-library';
import { responseDummy } from "../../../../test/response-dummy";
import { ResponsePaginator } from 'src/controller/dto/response-paginator.dto';

describe('MessageService', () => {
  let messageService: MessageService;
  let messageUCMock: jest.Mocked<IMessageUc>;

  beforeEach(() => {
    messageUCMock = {
      loadMessages: jest.fn().mockResolvedValue({} as IMessage),
      update: jest.fn().mockResolvedValue({} as IMessage),
      getById: jest.fn().mockResolvedValue({} as IMessage),
      getMessages: jest.fn().mockResolvedValue(new ResponsePaginator<IMessage>([], 1, 10)),
    } as jest.Mocked<IMessageUc>;


    messageService = new MessageService(messageUCMock);
  });

  describe('update', () => {
    it('should update message and return response', async () => {
      // Arrange
      const message: IMessageDTO = {} as IMessageDTO; // provide necessary data
      const expectedResponse: ResponseService<IMessage> = new ResponseService(
        true,
        'Mensaje actualizado correctamente.',
        responseDummy.status,
        {} as IMessage
      );
      messageUCMock.update.mockResolvedValue({} as IMessage);

      // Act
      const result = await messageService.update(message);

      // Assert
      expect(messageUCMock.update).toHaveBeenCalledWith(message);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        message: 'Mensaje actualizado correctamente.',
        status: responseDummy.status,
        documents: {}
      }));
    });
  });

  describe('getById', () => {
    it('should get message by id and return response', async () => {
      // Arrange
      const idMessage = 'messageId'; // provide a valid message id
      const expectedResponse: ResponseService<IMessage> = new ResponseService(
        true,
        'Consulta ejecutada correctamente.',
        responseDummy.status,
        {} as IMessage
      );
      messageUCMock.getById.mockResolvedValue({} as IMessage);

      // Act
      const result = await messageService.getById(idMessage);

      // Assert
      expect(messageUCMock.getById).toHaveBeenCalledWith(idMessage);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        message: 'Consulta ejecutada correctamente.',
        status: responseDummy.status,
        documents: {}
      }));
    });
  });

  describe('getMessages', () => {
    it('should get messages and return response', async () => {
      // Arrange
      const page = 1; // provide page number
      const limit = 10; // provide limit number
      const filter = '{}'; // provide filter object as string
      const channel = 'someChannel'; // provide a valid channel
      const expectedResponse: ResponseService<any> = new ResponseService(
        true,
        'Consulta ejecutada correctamente.',
        responseDummy.status,
        new ResponsePaginator<IMessage>([], page, limit)
      );
      messageUCMock.getMessages.mockResolvedValue(new ResponsePaginator<IMessage>([], page, limit));

      // Act
      const result = await messageService.getMessages(page, limit, filter, channel);

      // Assert
      expect(messageUCMock.getMessages).toHaveBeenCalledWith(page, limit, {});
      expect(result).toBeDefined()
    });
    
  });



});
