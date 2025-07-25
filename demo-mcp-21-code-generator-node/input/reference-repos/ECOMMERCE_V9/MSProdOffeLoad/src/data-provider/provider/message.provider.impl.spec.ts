import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import databaseConfig from "../../common/configuration/database.config";
import { EmessageMapping } from "../../common/utils/enums/message.enum";
import { MessageProvider } from "./message.provider.impl";
import { MessageModel } from "@claro/generic-models-library";

describe('TestService SellerProvider', () => {
    let service: MessageProvider;
    let model: Model<MessageModel>;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageProvider,
                {
                    provide: getModelToken(MessageModel.name, databaseConfig.database), useValue: {
                        find: jest.fn().mockReturnThis(),
                        countDocuments: jest.fn(),
                        skip: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                    }
                },
            ],
        }).compile();

        service = module.get<MessageProvider>(MessageProvider);
        model = module.get<Model<MessageModel>>(getModelToken(MessageModel.name, databaseConfig.database));
    });


    it('test unitario createMessages', async () => {
        const page = 1941;
        const limit = 86;
        const projection: any = {}
        let messages: any = {
            id: EmessageMapping.DEFAULT_ERROR
        }
        let resp = await service.getMessages(page, limit, messages, projection);
        expect(resp).toBeDefined();
    });
    it('test unitario getFilter', async () => {
        await service.getFilter('');
        expect(model.countDocuments).toHaveBeenCalled;
    });
});