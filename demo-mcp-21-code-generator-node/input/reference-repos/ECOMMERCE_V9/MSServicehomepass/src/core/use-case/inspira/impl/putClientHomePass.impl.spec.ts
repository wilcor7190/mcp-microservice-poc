import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { ICusRequestHomePassProvider } from '../../../../data-provider/cusRequestHomePass.provider';
import { mockedResponseCrearDB } from '../../../../../test/request-dummy';
import { PutClientHomePassimpl } from './putClientHomePass.impl';
import { consumerLegadoRest, mockPutClientHomePass, mockUpdateDB } from '../../../../../test/dummy-homepass';

class MockMappingLegados implements IMappingLegadosUc {
  consumerLegadoRestJOB(traceInfo: any, endPoint: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  consumerLegadoRestPost(traceInfo: any, endPoint: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async consumerLegadoRest(traceInfo: any, legado: any) {
    if (traceInfo == true) {
      return new Promise((resolve) => {
        resolve({
          executed: false,
          message: 'Error from Legado',
        });
      });
    } else {
      return new Promise((resolve) => {
        resolve({
          executed: true,
          type: 'cmtAddressGeneralResponseDto',
          message: 'No se encontro ninguna dirección con los criterios de busqueda ingresados',
          messageType: 'I',
          idCentroPoblado: '24926',
          centroPoblado: 'BOGOTA',
          listAddresses: [],
          data: 'si',
        });
      });
    }
  }
}

class MockCusRequestHomepassProvider implements ICusRequestHomePassProvider {
  updateCusRequestHomePass(filter: any, data: any): Promise<any> {
    return new Promise((resolve) => {
      resolve(mockUpdateDB);
    });
  }
  getCusRequestHomePass(filter: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createCusRequestHomePassGeneral(
    CusRequestHomePass: any,
    user: string,
    codigoDane: any,
    idCaseTcrm: any,
    booleansData: any,
    bodyRequest: any,
    idAddress: any,
  ): Promise<any> {
    return new Promise((resolve) => {
      resolve(mockedResponseCrearDB);
    });
  }
}

describe('initialFunction', () => {
  let putClientHomePassUc = new PutClientHomePassimpl(new MockMappingLegados(), new MockCusRequestHomepassProvider());

  beforeEach(() => {});

  test('returns a client that have a pending request', async () => {
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(consumerLegadoRest);
    jest.spyOn(MockCusRequestHomepassProvider.prototype, 'updateCusRequestHomePass').mockResolvedValue(mockUpdateDB);
    let cor = await putClientHomePassUc.putClientHomePass(mockPutClientHomePass);
    expect(cor.message).toEqual('Ya existe una solicitud en curso que se encuentra PENDIENTE. de barrio abierto.');
  });
});
