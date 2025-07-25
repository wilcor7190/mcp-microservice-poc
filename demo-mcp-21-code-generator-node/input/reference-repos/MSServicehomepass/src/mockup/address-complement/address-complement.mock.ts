import { GeographicAdDto } from "src/controller/dto/geographicAddres/geographicAddress.dto";

export const AddressComplement_200 = {
  process: '42376400-8dfe-11ee-8c83-db3d5f741cd4',
  success: true,
  status: 200,
  documents: [
    {
      geographicAddressList: {
        geographicAddress: [
          {
            alternateGeographicAddress: {},
            complements: [
              {
                nivel1Type: 'BLOQUE',
                nivel1Value:
                  '3,36,34,20,57,6,39,52,45,30,38,28,43,18,31,53,1,10,29,19,55,41,12,14,24,22,47,16,8,9,26,33,51,40,44,27,17,35,2,49,7,5,23,4,54,56,32,37,48,15,11,21,25,42,13,50,46',
              },
              {
                nivel1Type: 'TORRE',
                nivel1Value: '33,1,24',
              },
              {
                nivel1Type: 'EDIFICIO',
                nivel1Value: '10 BLOQUE 28',
              },
            ],
            plateTypelt: '',
            plateValueIt: '',
            detailId: '',
            textAddress: '',
            subId: '',
            strata: '',
            streetAlt: '',
            neighborhood: '',
            streetType: '',
            streetNr: '',
            streetLt: '',
            way2Word: '',
            streetBis: '',
            streetBlock: '',
            geographicSubAddress: {
              streetType: '',
              streetNr: '',
              streetLt: '',
              way2Word: '',
              streetBis: '',
              streetBlock: '',
            },
            addressPlate: '',
            indications: '',
            geoState: '',
            word3G: '',
            addressType: '',
          },
        ],
      },
    },
  ],
  message: 'Execution successfull',
  requestTime: '2023-11-28T09:56:06-05:00',
  responseTime: 43365,
  method: 'POST',
  origen: '/MSServicehomepass/v1/coverage/addresscomplement',
};

export const AddressComplement_201 = {
  process: '3ea3f8f0-a546-11ec-b752-edc758fffcab',
  success: true,
  status: 201,
  documents: [
    {
      message: 'ERROR',
      code: '-1',
      description: 'Database Error',
      source: 'PKG_CONSULTA_DIRECCIONES_V1.PRC_CONSULTA_COMPLEMENTOS_SP',
    },
  ],
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar',
  requestTime: '2022-03-16T11:29:25-05:00',
  responseTime: 49119,
  method: 'POST',
  origen: '/v1/Coverage/Addresscomplement',
};

export const AddressComplement_400 = {
  process: 'd3785800-a46e-11ec-9a98-ef9e4ca5ddbd',
  success: false,
  status: 400,
  message: 'El canal recibido no es soportado por el servicio.',
  requestTime: '2022-03-15T09:47:24-05:00',
  method: 'POST',
  origen: '/v1/Coverage/Addresscomplement',
};

export const BodyExampleCase1: GeographicAdDto = {
  geographicAddressList: {
    geographicAddress: {
      addressType: 'CK',
      id: '2561972',
    },
    alternateGeographicAddress:{
      nivel1Type: '',
      nivel2Type: '',
      nivel3Type: '',
      nivel6Type: '',
      nivel1Value: '',
      nivel2Value: '',
      nivel3Value: '',
      nivel6Value: '',
      nivel4Type: '',
      nivel4Value: '',
      nivel5Type: '',
      nivel5Value: '',
    },
    complements: {
      nivel1Type: '',
      nivel2Type: '',
      nivel3Type: '',
      nivel6Type: '',
      nivel1Value: '',
      nivel2Value: '',
      nivel3Value: '',
      nivel6Value: '',
      nivel4Type: '',
      nivel4Value: '',
      nivel5Type: '',
      nivel5Value: '',
    },
    plateTypeIt: '',
    plateValueIt: ''
  },
};

export const BodyExampleCase2 = {
  geographicAddressList: {
    geographicAddress: {
      addressType: 'CK',
      id: '2561972',
    },
    alternateGeographicAddress: {},
    complements: {
      nivel1Type: 'BLOQUE',
      nivel1Value: '24',
    },
    plateTypeIt: '',
    plateValueIt: '',
  },
};

export const BodyExampleCase3 = {
  geographicAddressList: {
    geographicAddress: {
      addressType: 'CK',
      id: '2561972',
    },
    alternateGeographicAddress: {},
    complements: {
      nivel1Type: 'BLOQUE',
      nivel1Value: '24',
      nivel5Type: 'APARTAMENTO',
      nivel5Value: '503',
    },
    plateTypeIt: '',
    plateValueIt: '',
  },
};

export const BodyExampleFakeLegacy = {
  geographicAddressList: {
    geographicAddress: {
      addressType: 'CK',
      id: '25619721',
    },
  },
};

export const BodyExampleFakeData = {
  geographicAddressList: {
    geographicAddress: {
      addressType: 'CK',
    },
  },
};
