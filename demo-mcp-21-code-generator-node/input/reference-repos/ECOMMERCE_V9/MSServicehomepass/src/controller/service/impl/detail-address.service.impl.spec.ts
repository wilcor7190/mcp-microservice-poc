import { Test, TestingModule } from "@nestjs/testing";
import { DetailAddress } from "./detail-address.service.impl";
import { IDetailAddressUc } from "../../../core/use-case/procedures/detailAddress.uc";
import { IGlobalValidateService } from "../resources/globalValidate.service";


const mockDetailAddressUc = {
    detailAddress: jest.fn()
}

const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

describe('AddressComplement', () => {
    let service: DetailAddress;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                DetailAddress,
                { provide: IDetailAddressUc, useValue: mockDetailAddressUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<DetailAddress>(DetailAddress);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('detailAddress', () => {
        it('should return success', async () => {
            const BodyExample = {
                geographicAddressList: {
                  geographicAddress: {
                    codeDane: '11001000',
                    typeAddrMER: 'CK',
                    streetAlt: '',
                    neighborhood: '',
                    streetType: 'CARRERA',
                    streetNr: '48',
                    streetSuffix: '',
                    streetNlPostViaP: '',
                    streetBis: '',
                    streetBlockGenerator: '',
                  },
                  geographicSubAddress: {
                    streetTypeGenerator: '',
                    streetNrGenerator: '176',
                    streetLtGenerator: '',
                    streetNlPostViaG: '',
                    word3G: '',
                    streetBisGenerator: '',
                    streetName: '',
                    plate: '11',
                  },
                  complements: {
                    nivel1Type: '',
                    nivel2Type: '',
                    nivel3Type: '',
                    nivel4Type: '',
                    nivel5Type: '',
                    nivel6Type: '',
                    nivel1Value: '',
                    nivel2Value: '',
                    nivel3Value: '',
                    nivel4Value: '',
                    nivel5Value: '',
                    nivel6Value: '',
                  },
                  alternateGeographicAddress: {
                    nivel1Type: '',
                    nivel2Type: '',
                    nivel3Type: '',
                    nivel4Type: '',
                    nivel5Type: '',
                    nivel6Type: '',
                    nivel1Value: '',
                    nivel2Value: '',
                    nivel3Value: '',
                    nivel4Value: '',
                    nivel5Value: '',
                    nivel6Value: '',
                  },
                  plateTypeIt: '',
                  plateValueIt: '',
                },
              };
            mockDetailAddressUc.detailAddress.mockResolvedValue({po_data:['TEST']});
            const result = await service.consultDetailsAddres(BodyExample, mockDetailAddressUc);
            expect(result).toBeDefined();
        })
    })
})