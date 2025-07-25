import { MessageModel } from '@claro/generic-models-library';
import { Model } from 'mongoose';
import { MessageProvider } from './message.provider.impl';

describe('MessageProvider', () => {
  let service: MessageProvider;
  let messageModel: Model<MessageModel>;

  beforeEach(async () => {
    const messageModelmock = {
      countDocuments: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    } as unknown as jest.Mocked<Model<MessageModel>>;

    service = new MessageProvider(messageModelmock);
  
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getTotal', () => {
    it('should return the total number of messages', async () => {
      // Arrange
      const filter = {};

      const messageModel = jest.fn().mockImplementation(() => ({
        countDocuments: jest.fn().mockReturnValue(10),
      }))();

      const messageProvider = new MessageProvider(messageModel);
      // Act
      const result = await messageProvider.getTotal(filter);

      // Assert
      expect(result).toBe(10);
    });
  });

  describe('getMessages', () => {
    it('should return the messages based on the filter', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const filter = {};
      const projection = {};

      const messageModel = jest.fn().mockImplementation(() => ({
        find: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(14),
        }),
      }))();
      

      const messageProvider = new MessageProvider(messageModel);
      // Act
      const result = await messageProvider.getMessages(page, limit, filter);

      // Assert
      expect(result).toBeDefined();
    });
  });

 

  describe('getMessage', () => {
    it('should return the message with the specified id', async () => {
      // Arrange
      const id = '123';

      const messageModel = jest.fn().mockImplementation(() => ({
        findOne: jest.fn().mockReturnValue(id),
      }))();

      const serviceTracing = jest.fn().mockImplementation(() => ({
        createServiceTracing: jest.fn().mockReturnValue(11),
      } ))();

      const messageProvider = new MessageProvider(messageModel);
      // Act
      const result = await messageProvider.getMessage(id);

      // Assert
      expect(result).toBe(id);
    });
  });
});