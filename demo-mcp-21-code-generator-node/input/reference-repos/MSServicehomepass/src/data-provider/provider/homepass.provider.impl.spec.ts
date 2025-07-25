import { Test, TestingModule } from "@nestjs/testing";
import { ICusRequestHomePassProvider } from "../cusRequestHomePass.provider"
import { CusRequestHomePassModel } from "../model/CusRequestHomepass/cusRequestHomePass.model";
import { CusRequestHomePassProvider } from "./cusRequestHomePass.provider.impl";
import { getModelToken } from "@nestjs/mongoose";
import { IServiceErrorUc } from "../../core/use-case/resource/service-error.resource.uc";
import { IServiceTracingUc } from "../../core/use-case/resource/service-tracing.resource.uc";
import { IHomePass } from "../homePass.provider";
import { HomePassProviderimpl } from "./homepass.provider.impl";
import { IHttpProvider } from "../http.provider";
import { EHttpMethod } from "../model/http/request-config-http.model";
import { Etask } from "../../common/utils/enums/task.enum";

describe('homepassProvider', () => {
    let homepassProvider: IHomePass;
    let mockHTTP = {
        executeRest:jest.fn()
    }

    beforeEach(async () => {
        
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                HomePassProviderimpl,
                { provide: IHttpProvider, useValue: mockHTTP}
            ]
        }).compile();

        homepassProvider = module.get<IHomePass>(HomePassProviderimpl)
    })
    afterEach(() => {
        jest.resetAllMocks();
      });

    describe('consumerServiceHomePass', () => {
        it('should return success', async () => {
            mockHTTP.executeRest.mockReturnThis().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([{"":""}])
            })
            let result = await homepassProvider.consumerServiceHomePass({method: EHttpMethod.get, url: ''},Etask.CONSULT_HOMEPASS)
            expect(result).toBeDefined();
        })
    })
})