import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import databaseConfig from '../../common/configuration/database.config';
import { EmessageMapping } from '../../common/utils/enums/message.enum';
import { MessageProvider } from './message.provider.impl';
import { IMessage, MessageModel } from '@claro/generic-models-library';

describe('TestService SellerProvider', () => {
  let service: MessageProvider;
  let model: Model<MessageModel>;
  const mockMessage: IMessage = {
    id: 'DEFAULT',
    description: 'DEFAULT_DESCRIPTION',
    message: 'DEFAULT_MESSAGE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageProvider,
        {
          provide: getModelToken(MessageModel.name, databaseConfig.database),
          useValue: {
            find: jest.fn().mockReturnThis(),
            countDocuments: jest.fn(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnValue(mockMessage),
            insertMany: jest.fn().mockReturnValue(true),
            findOneAndUpdate: jest.fn().mockReturnValue(mockMessage),
          },
        },
      ],
    }).compile();

    service = module.get<MessageProvider>(MessageProvider);
    model = module.get<Model<MessageModel>>(getModelToken(MessageModel.name, databaseConfig.database));
  });

  it('unit test getMessage', async () => {
    let resp = await service.getMessage('DEFAULT');

    expect(resp.message).toBe('DEFAULT_MESSAGE');
  });

  it('unit test getMessages', async () => {
    const page = 1941;
    const limit = 86;
    const projection: any = {};
    let messages: any = {
      id: EmessageMapping.DEFAULT_ERROR,
    };
    let resp = await service.getMessages(page, limit, messages, projection);
    expect(resp).toBeDefined();
  });

  it('unit test createMessages', async () => {
    let resp = await service.createMessages([mockMessage]);

    expect(resp).toBe(true);
  });

  it('unit test updateMessage', async () => {
    let resp = await service.updateMessage(mockMessage);

    expect(resp.message).toBe('DEFAULT_MESSAGE');
  });
});
