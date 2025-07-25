import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessage, MessageModel } from '@claro/generic-models-library';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { MessageProvider } from './message.provider.impl';
import databaseConfig from 'src/common/configuration/database.config';

describe('MessageProvider', () => {
  let service: MessageProvider;
  let model: Model<MessageModel>;
  let serviceTracingProvider: IServiceTracingProvider;

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
          provide: getModelToken(MessageModel.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue([mockMessage]),
            }),
            countDocuments: jest.fn().mockResolvedValue(1),
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockMessage), // Devuelve directamente mockMessage
            }),
            insertMany: jest.fn().mockResolvedValue(true),
            findOneAndUpdate: jest.fn().mockResolvedValue(mockMessage),
            watch: jest.fn().mockReturnValue({
              on: jest.fn(),
            }),
          },
        },
        {
          provide: IServiceTracingProvider,
          useValue: {
            createServiceTracing: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageProvider>(MessageProvider);
    model = module.get<Model<MessageModel>>(getModelToken(MessageModel.name));
  });

  it('should load messages on module init', async () => {
    jest.spyOn(service, 'loadMessages').mockImplementation(jest.fn());
    jest.spyOn(service, 'watchChanges').mockImplementation(jest.fn());

    service.onModuleInit();

    expect(service.loadMessages).toHaveBeenCalled();
    if (databaseConfig.mongoReplicaSet) {
      expect(service.watchChanges).toHaveBeenCalled();
    }
  });

  it('should load messages', async () => {
    await service.loadMessages();
    expect(model.find).toHaveBeenCalled();
  });

  it('should watch changes in the collection', () => {
    const mockWatch = jest.fn();
    jest.spyOn(model, 'watch').mockReturnValue({ on: mockWatch } as any);

    service.watchChanges();

    expect(model.watch).toHaveBeenCalled();
    expect(mockWatch).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should get total messages count', async () => {
    const messageFilter = { id: 'DEFAULT' };
    const resp = await service.getFilter(messageFilter);
    expect(resp).toEqual(1);
  });

  it('should create messages', async () => {
    const resp = await service.createMessages([mockMessage]);
    expect(resp).toBe(true);
  });

  it('should get total messages count', async () => {
    const messageFilter = { id: 'DEFAULT' };
    const resp = await service.getTotal(messageFilter);
    expect(resp).toEqual(1);
  });

  it('should update a message', async () => {
    const resp = await service.updateMessage(mockMessage);
    expect(resp).toEqual(mockMessage);
  });
});
