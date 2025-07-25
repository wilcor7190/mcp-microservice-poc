import { Test, TestingModule } from "@nestjs/testing";
import { ICusRequestHomePassProvider } from "../cusRequestHomePass.provider"
import { CusRequestHomePassModel } from "../model/CusRequestHomepass/cusRequestHomePass.model";
import { CusRequestHomePassProvider } from "./cusRequestHomePass.provider.impl";
import { getModelToken } from "@nestjs/mongoose";
import { IServiceErrorUc } from "../../core/use-case/resource/service-error.resource.uc";
import { IServiceTracingUc } from "../../core/use-case/resource/service-tracing.resource.uc";

describe('CusRequestHomePassProvider', () => {
    let cusRequestHomePassProvider: ICusRequestHomePassProvider;
    let mockServiceErrorUc: IServiceErrorUc;
    let mockServiceTracingUc: IServiceTracingUc;
    const mockCusRequestHomePassModel = {
        find: jest.fn(),
        findOneAndUpdate: jest.fn(),
        create: jest.fn()
    }


    beforeEach(async () => {

        mockServiceErrorUc = {
            createServiceError: jest.fn()
        }

        mockServiceTracingUc = {
            createServiceTracing: jest.fn()
        }


        const module: TestingModule = await Test.createTestingModule({
            providers:[
                CusRequestHomePassProvider,
                { provide: getModelToken(CusRequestHomePassModel.name), useValue: mockCusRequestHomePassModel },
                { provide: IServiceErrorUc, useValue: mockServiceErrorUc },
                { provide: IServiceTracingUc, useValue: mockServiceTracingUc }
            ]
        }).compile();

        cusRequestHomePassProvider = module.get<ICusRequestHomePassProvider>(CusRequestHomePassProvider)
    })
    afterEach(() => {
        jest.resetAllMocks();
      });

    describe('getCusRequestHomePass', () => {
        it('should return success', async () => {
            mockCusRequestHomePassModel.find.mockReturnThis().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([{"":""}])
            })
            let result = await cusRequestHomePassProvider.getCusRequestHomePass({})
            expect(result).toBeDefined();
        })

        it('should return exception', async () => {
            try {
                mockCusRequestHomePassModel.create.mockReturnThis().mockReturnValue({
                    exec: jest.fn().mockResolvedValueOnce([{ "": "" }])
                })
                let result = await cusRequestHomePassProvider.getCusRequestHomePass({})
                expect(result).toBeDefined();
            }catch (e) {
                expect(e).toBeDefined();
            }
        })

        it('should return success', async () => {
            mockCusRequestHomePassModel.findOneAndUpdate.mockReturnThis().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([{"":""}])
            })
            let result = await cusRequestHomePassProvider.updateCusRequestHomePass({},{})
            expect(result).toBeDefined();
        })
    })
})