import { HttpStatus } from '@nestjs/common';

import { IHttpProvider } from 'src/data-provider/http.provider';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { SKUSondUcimpl } from './sku-sond.uc.impl';
import { ResponseHttp } from 'src/data-provider/model/http/response-http.model';
import { responseConsumeInventoryManageSucces, responseGetSKUSond } from 'src/mock/response';
import e from 'express';
import { Etask } from 'src/common/utils/enums/taks.enum';

describe("SKUSondUcimpl", () => {
    let uc: SKUSondUcimpl;
    let httpProvider: IHttpProvider;

    beforeEach(() => {
       httpProvider = {
            executeRest: jest.fn().mockResolvedValue(responseConsumeInventoryManageSucces)
        } as any; 
        uc = new SKUSondUcimpl(httpProvider);
    });

    describe("getSKUSond", () => {
        it("should return the expected response when the API call is successful", async () => {
            // Arrange
            const sku = "70049324";
            const salesType = "PRE";
            const channel = "EC9_B2C";

            jest.spyOn(uc, "consumeInventoryManage" as any).mockResolvedValue(
                responseConsumeInventoryManageSucces as unknown as ResponseHttp<any>);

            // Act
            const response = await uc.getSKUSond(sku, salesType, channel);

            // Assert
            expect(response).toEqual(responseGetSKUSond);

        });

        it("should throw an error when the API call fails", async () => {
            // Arrange
            const sku = "70049324";
            const salesType = "PRE";
            const channel = "EC9_B2C";

            jest.spyOn(uc, "consumeInventoryManage").mockResolvedValue({
                executed: false,
                status: 404,
                data: {
                    message: "Product with SKU: 700493224 not found, or doesn't have property: materialKit",
                    status:  HttpStatus.INTERNAL_SERVER_ERROR,
                },
            } as unknown as ResponseHttp<any>);

            // Act
            try {
                await uc.getSKUSond(sku, salesType, channel);
            } catch (error) {
                // Assert
                expect(error).toBeInstanceOf(BusinessException);
                expect(error.reason).toBe("Product with SKU: 700493224 not found, or doesn't have property: materialKit");
                expect(error.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

    });


    describe("consumeInventoryManage", () => {
    
        it("should return the expected response when the API call is successful", async () => {
            // Arrange
            const sku = "70049324";
            const salesType = "PRE";

            jest.spyOn(httpProvider, "executeRest").mockResolvedValue(responseConsumeInventoryManageSucces as unknown as ResponseHttp<any>);

            // Act
            const response = await uc.consumeInventoryManage(sku, salesType);

            // Assert
            expect(response).toEqual(responseConsumeInventoryManageSucces);
        });

        it("should throw an error when the API call fails", async () => {
            // Arrange
            const sku = "70049324";
            const salesType = "PRE";

            jest.spyOn(httpProvider, "executeRest").mockRejectedValue(new Error("Internal server error. Please try again later.") as unknown as ResponseHttp<any>);

            // Act
            try {
                await uc.consumeInventoryManage(sku, salesType);
            } catch (error) {
                // Assert
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe("Internal server error. Please try again later.");
                expect(error.task_name).toBe(Etask.CONSULT_ORDER_INFORMATION);
            }
        });
    })

});