import { HomePassUc } from './homePass.uc.impl';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { ICusRequestHomePass } from '../../../entity/cusRequestHomePass/cusRequestHomePass.entity';
import { ICusRequestHomePassProvider } from '../../../../data-provider/cusRequestHomePass.provider';
import {
  mockedResponseCrearDB,
  mockedResponseGeneral1,
  mockedResponseGeneral2,
  mockedResponseGeneral3,
  mockedResponseTabulada1,
  mockedResponseTabulada2,
  requestHomepassUC,
  requestHomepassUC3,
  mockedResponseGeneral4,
  mockedResponseGeneral5,
} from '../../../../../test/request-dummy';
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';

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
  updateCusRequestHomePass(filter: any, data: any): Promise<ICusRequestHomePass> {
    throw new Error('Method not implemented.');
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
  let channel = 'EC9_B2C';
  let homePassUc = new HomePassUc(new MockMappingLegados(), new MockCusRequestHomepassProvider());

  beforeEach(() => {});

  test('returns error object when exactaTabulada is not executed', async () => {
    const mockedResponse = {
      executed: false,
      message: 'Error from Legado',
    };
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValueOnce(mockedResponse);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);
    expect(cor.source).toEqual('CMatricesAs400Service - ConsultaDireccionExactaTabulada');
  });

  test('returns a home with claro services', async () => {
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral1).mockResolvedValueOnce(mockedResponseTabulada1);
    jest.spyOn(homePassUc, 'errorConsulDirGeneral').mockResolvedValueOnce(undefined);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);
    expect(cor.message).toEqual('En la dirección ingresada se encuentra instalado un servicio Claro.');
  });

  test('stratum validate', async () => {
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral5).mockResolvedValueOnce(mockedResponseTabulada1);
    jest.spyOn(homePassUc, 'errorConsulDirGeneral').mockResolvedValueOnce(undefined);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);

    expect(cor.message).toEqual(EmessageMapping.VALIDACION_STRATUM);
  });

  test('consultaDireccion data addresses listHhpps state PO DE state ACT', async () => {
    const expectedResponse = 'Existe cobertura en esta direccion.';
    mockedResponseGeneral1.data.addresses.listHhpps[0].state = 'PO';
    mockedResponseGeneral1.data.addresses.listHhpps[0].node.state = 'ACT';

    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral1).mockResolvedValueOnce(mockedResponseTabulada1);
    jest.spyOn(homePassUc, 'errorConsulDirGeneral').mockResolvedValueOnce(undefined);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);

    expect(cor.message).toEqual(expectedResponse);
  });

  test('consultaDireccion data addresses listHhpps state PO DE state NAC', async () => {
    const expectedResponse = 'No existe cobertura en esta direccion.';
    mockedResponseGeneral1.data.addresses.listHhpps[0].state = 'PO';
    mockedResponseGeneral1.data.addresses.listHhpps[0].node.state = 'NAC';

    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral1).mockResolvedValueOnce(mockedResponseTabulada1);
    jest.spyOn(homePassUc, 'errorConsulDirGeneral').mockResolvedValueOnce(undefined);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);

    expect(cor.message).toEqual(expectedResponse);
  });

  test('returns a home with idCaseTcrm', async () => {
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral2).mockResolvedValueOnce(mockedResponseTabulada2);
    jest.spyOn(MockCusRequestHomepassProvider.prototype, 'createCusRequestHomePassGeneral').mockResolvedValue(mockedResponseCrearDB);
    let cor = await homePassUc.initialFunction(requestHomepassUC, channel);
    expect(cor.geographicAddress.idCaseTcrm).toBeDefined;
  });

  test('returns a home that no exists', async () => {
    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral3);
    jest.spyOn(homePassUc, 'errorConsulDirGeneral').mockResolvedValueOnce(undefined);
    let cor = await homePassUc.initialFunction(requestHomepassUC3, channel);
    expect(cor.message).toEqual('Homepass no existe');
  });

  test('ConsultaDireccion executed false', async () => {
    const expetedMessage = 'Error legacy';

    mockedResponseGeneral3.executed = false;

    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral3);
    let resp = await homePassUc.initialFunction(requestHomepassUC3, channel);

    expect(resp.code).toBe('-1');
    expect(resp.message).toBe(expetedMessage);
  });

  test('ConsultaDireccion data messageType E', async () => {
    const expetedMessage = 'Error legacy';

    jest.spyOn(MockMappingLegados.prototype, 'consumerLegadoRest').mockResolvedValue(mockedResponseGeneral4);
    let resp = await homePassUc.initialFunction(requestHomepassUC3, channel);

    expect(resp.code).toBe('-1');
    expect(resp.message).toBe(expetedMessage);
  });
});
