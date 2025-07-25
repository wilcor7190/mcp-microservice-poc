import { Test } from '@nestjs/testing';
import { AddressComplementController } from './addressComplement.controller';
import { IAddressComplement } from './service/address-complement.service';
import {
  AddressComplement_200,
  AddressComplement_201,
  AddressComplement_400,
  BodyExampleCase1,
  BodyExampleCase2,
  BodyExampleCase3,
  BodyExampleFakeData,
  BodyExampleFakeLegacy,
} from 'src/mockup/address-complement/address-complement.mock';
import { GeographicAdDto } from './dto/geographicAddres/geographicAddress.dto';

jest.setTimeout(15000);
describe('AddressComplementController', () => {
  let service: IAddressComplement;
  let mockService: IAddressComplement;
  let controller: AddressComplementController;

  beforeEach(async () => {
    mockService = {
      consultAddressComplement: jest.fn(),
    };
    const module = await Test.createTestingModule({
      controllers: [AddressComplementController],
      providers: [{ provide: IAddressComplement, useValue: mockService }],
    }).compile();
    controller = module.get<AddressComplementController>(AddressComplementController);
    service = module.get<IAddressComplement>(IAddressComplement);
  });

  describe('consultAddressComplement endpoint', () => {
    it('should return 200 with example #1', async () => {
      jest.spyOn(service, 'consultAddressComplement').mockResolvedValueOnce(AddressComplement_200);
      const result = await controller.consultAddressComplement(`EC9_B2C`, BodyExampleCase1);
      expect(result).toBe(AddressComplement_200);
      expect(result.status).toBe(200);
    });

    it('should return 200 with example #2', async () => {
      jest.spyOn(service, 'consultAddressComplement').mockResolvedValueOnce(AddressComplement_200);
      const result = await controller.consultAddressComplement(`EC9_B2C`, BodyExampleCase2 as unknown as GeographicAdDto);
      expect(result).toBe(AddressComplement_200);
      expect(result.status).toBe(200);
    });

    it('should return 200 with example #3', async () => {
      jest.spyOn(service, 'consultAddressComplement').mockResolvedValueOnce(AddressComplement_200);
      const result = await controller.consultAddressComplement(`EC9_B2C`, BodyExampleCase3 as unknown as GeographicAdDto);
      expect(result).toBe(AddressComplement_200);
      expect(result.status).toBe(200);
    });

    it('should return 201 legacy error', async () => {
      jest.spyOn(service, 'consultAddressComplement').mockResolvedValueOnce(AddressComplement_201);
      const result = await controller.consultAddressComplement(`EC9_B2C`, BodyExampleFakeLegacy as unknown as GeographicAdDto);
      expect(result).toBe(AddressComplement_201);
      expect(result.status).toBe(201);
    });

    it('should return 400 data validation', async () => {
      jest.spyOn(service, 'consultAddressComplement').mockResolvedValueOnce(AddressComplement_400);
      const result = await controller.consultAddressComplement(`EC9_B2C`, BodyExampleFakeData as unknown as GeographicAdDto);
      expect(result).toBe(AddressComplement_400);
      expect(result.status).toBe(400);
    });
  });
});
