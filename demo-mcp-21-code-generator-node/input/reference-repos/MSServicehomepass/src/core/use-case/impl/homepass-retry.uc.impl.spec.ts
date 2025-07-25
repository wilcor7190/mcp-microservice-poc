import { ICusRequestHomePassProvider } from 'src/data-provider/cusRequestHomePass.provider';
import { IHomePassRetryUc } from '../homepass-retry.uc';
import { IMappingLegadosUc } from '../resource/mapping-legaos.resource.uc';
import { HomePassRetryUcimpl } from './homepass-retry.uc.impl';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { Test } from '@nestjs/testing';
import Traceability from 'src/common/lib/traceability';
import generalConfig from 'src/common/configuration/general.config';
import { ICusRequestHomePass } from 'src/core/entity/cusRequestHomePass/cusRequestHomePass.entity';
import { argForGetCusRequestHomepassError, elementEstadoIniciado } from 'src/mockup/homepass/homepassUc.mock';

describe('homepass-retry-UC', () => {
  let homePassRetryUc: Partial<HomePassRetryUcimpl>;
  let mappingLegados: IMappingLegadosUc;
  let cusRequestHomePassProvider: ICusRequestHomePassProvider;
  let serviceTracing: IServiceTracingUc;
  let serviceError: IServiceErrorUc;

  beforeEach(async () => {
    mappingLegados = {
      consumerLegadoRest: jest.fn(),
      consumerLegadoRestJOB: jest.fn(),
      consumerLegadoRestPost: jest.fn(),
    };

    cusRequestHomePassProvider = {
      createCusRequestHomePassGeneral: jest.fn(),
      getCusRequestHomePass: jest.fn(),
      updateCusRequestHomePass: jest.fn(),
    };

    serviceTracing = {
      createServiceTracing: jest.fn(),
    };

    serviceError = {
      createServiceError: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        HomePassRetryUcimpl,
        { provide: IMappingLegadosUc, useValue: mappingLegados },
        { provide: ICusRequestHomePassProvider, useValue: cusRequestHomePassProvider },
        { provide: IServiceTracingUc, useValue: serviceTracing },
        { provide: IServiceErrorUc, useValue: serviceError },
      ],
    }).compile();
    homePassRetryUc = module.get<HomePassRetryUcimpl>(HomePassRetryUcimpl);
  });

  describe('homepass-retry-UC - methods', () => {
    it('getStateHomePass for greater than 0 and non error', async () => {
      jest.spyOn(cusRequestHomePassProvider, 'getCusRequestHomePass').mockResolvedValueOnce([{ response: '' }]);
      jest.spyOn(homePassRetryUc, 'getCusRequestHomepassError').mockResolvedValueOnce();

      const result = await homePassRetryUc.getStateHomePass();
      expect(homePassRetryUc.getCusRequestHomepassError).toHaveBeenCalled();
      expect(result).toBe(50);
    });

    it('estadoIniciado trazability call', async () => {
      const element = elementEstadoIniciado;

      const trace = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
      const getCusRequestHomePass = { getCusRequestHomePass: { idCaseTcrm: '' } };

      jest.spyOn(mappingLegados, 'consumerLegadoRest').mockResolvedValueOnce({ data: { messageType: 'I' } });
      jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValueOnce({});
      jest.spyOn(cusRequestHomePassProvider, 'updateCusRequestHomePass').mockResolvedValueOnce('resp' as unknown as ICusRequestHomePass);
      jest.spyOn(homePassRetryUc, 'insertTraceability').mockResolvedValueOnce();

      const result = await homePassRetryUc.estadoIniciado(element, trace, getCusRequestHomePass);
      expect(mappingLegados.consumerLegadoRest).toHaveBeenCalled();
      expect(mappingLegados.consumerLegadoRest).toHaveBeenCalled();
    });

    it('estadoIniciado trazability call: messageType not equal to I', async () => {
      const element = elementEstadoIniciado;

      const trace = new Traceability({ origen: `${generalConfig.apiVersion}${generalConfig.performJob}` });
      const getCusRequestHomePass = { getCusRequestHomePass: { idCaseTcrm: '' } };

      jest.spyOn(mappingLegados, 'consumerLegadoRest').mockResolvedValueOnce({ data: { messageType: '' } });
      jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValueOnce({});
      jest.spyOn(cusRequestHomePassProvider, 'updateCusRequestHomePass').mockResolvedValueOnce('resp' as unknown as ICusRequestHomePass);
      jest.spyOn(homePassRetryUc, 'insertTraceability').mockResolvedValueOnce();

      const result = await homePassRetryUc.estadoIniciado(element, trace, getCusRequestHomePass);
      expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
    });

    it('insertTraceability', async () => {
      const updateDb = {};
      const element = { idCaseTcrm: '' };

      const result = await homePassRetryUc.insertTraceability(updateDb, element);
      expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
    });

    it('insertTraceability where updateDb is null', async () => {
      const updateDb = null;
      const element = { idCaseTcrm: '' };

      const result = await homePassRetryUc.insertTraceability(updateDb, element);
      expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
    });
  });

  it('estadoFinalizado trazability call', async () => {
    const element = elementEstadoIniciado;

    const buscarSolicitudPorIdSolicitud = { data: { resultado: '', estado: '' } };

    jest.spyOn(mappingLegados, 'consumerLegadoRestJOB').mockResolvedValue({ executed: true, data: { messageType: 'I' } });
    jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValueOnce({});
    jest.spyOn(cusRequestHomePassProvider, 'updateCusRequestHomePass').mockResolvedValueOnce('resp' as unknown as ICusRequestHomePass);
    jest.spyOn(homePassRetryUc, 'insertTraceability').mockResolvedValueOnce();

    const result = await homePassRetryUc.estadoFinalizado(element, buscarSolicitudPorIdSolicitud);
    expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
  });

  it('estadoFinalizado trazability call', async () => {
    const element = elementEstadoIniciado;

    const buscarSolicitudPorIdSolicitud = { data: { resultado: '', estado: '' } };

    jest.spyOn(mappingLegados, 'consumerLegadoRestJOB').mockResolvedValue({ executed: false, data: { messageType: 'I' } });
    jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValueOnce({});
    jest.spyOn(cusRequestHomePassProvider, 'updateCusRequestHomePass').mockResolvedValueOnce('resp' as unknown as ICusRequestHomePass);
    jest.spyOn(homePassRetryUc, 'insertTraceability').mockResolvedValueOnce();

    const result = await homePassRetryUc.estadoFinalizado(element, buscarSolicitudPorIdSolicitud);
    expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
  });

  it('getCusRequestHomepassError trazability call', async () => {
    const getCusRequestHomePass = argForGetCusRequestHomepassError;

    jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValue({});
    jest.spyOn(mappingLegados, 'consumerLegadoRest').mockResolvedValue({ executed: true, data: { estado: 'FINALIZADO', resultado: 'HHPP CREADO' } });
    jest.spyOn(homePassRetryUc, 'estadoFinalizado').mockResolvedValueOnce();

    const result = await homePassRetryUc.getCusRequestHomepassError(getCusRequestHomePass);
    expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
  });

  it('getCusRequestHomepassError trazability call: NO EstateTransaction.FINALIZADO & StateHHPP.HHPP_CREADO', async () => {
    const getCusRequestHomePass = argForGetCusRequestHomepassError;

    jest.spyOn(serviceTracing, 'createServiceTracing').mockResolvedValue({});
    jest.spyOn(mappingLegados, 'consumerLegadoRest').mockResolvedValue({ executed: true, data: { estado: '', resultado: '' } });
    jest.spyOn(homePassRetryUc, 'estadoFinalizado').mockResolvedValueOnce();
    jest.spyOn(homePassRetryUc, 'estadoIniciado').mockResolvedValueOnce();
    jest.spyOn(homePassRetryUc, 'insertTraceability').mockResolvedValueOnce();
    jest.spyOn(cusRequestHomePassProvider, 'updateCusRequestHomePass').mockResolvedValue({} as unknown as ICusRequestHomePass );

    await homePassRetryUc.getCusRequestHomepassError(getCusRequestHomePass);
    expect(serviceTracing.createServiceTracing).toHaveBeenCalled();
  });
});
