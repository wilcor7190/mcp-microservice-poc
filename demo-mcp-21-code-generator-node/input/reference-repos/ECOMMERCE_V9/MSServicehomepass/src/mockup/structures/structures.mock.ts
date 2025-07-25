import { StructuresDTO } from "src/controller/dto/structures/structures.dto";

export const Structures_200 = {
  process: 'cf434f80-f5c9-11ed-bf5a-1b56fd041de8',
  success: true,
  status: 200,
  documents: [
    {
      geographicAddressList: {
        geographicAddress: [
          {
            id: '',
            alternateGeographicAddress: [
              {
                nivel4Type: 'MANZANA',
                nivel4Value: 'A,C,E,G,I,K',
              },
            ],
            complements: '',
            plateTypeIt: '',
            plateValueIt: '',
            detailId: '',
            strata: '',
            textAddress: '',
          },
        ],
      },
    },
  ],
  message: 'Execution successfull',
  requestTime: '2023-05-18T22:17:43+00:00',
  responseTime: 21725,
  method: 'POST',
  origen: '/RSServicehomepass/V1/Coverage/structures',
};

export const Structures_201 = {
  process: '3ea3f8f0-a546-11ec-b752-edc758fffcab',
  success: true,
  status: 201,
  documents: [
    {
      message: 'ERROR',
      code: '-1',
      description: 'Database Error',
      source: 'PKG_CONSULTA_DIRECCIONES_V1.PRC_CONSULTA_DIR_BM_IT',
    },
  ],
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar',
  requestTime: '2022-03-16T11:29:25-05:00',
  responseTime: 49119,
  method: 'POST',
  origen: '/v1/Coverage/structures',
};

export const Structures_400 = {
  process: 'd3785800-a46e-11ec-9a98-ef9e4ca5ddbd',
  success: false,
  status: 400,
  documents: ['addressType should not be empty', 'addressType must be a integer value'],
  message: 'Error validación de campos obligatorios.',
  requestTime: '2022-03-15T09:47:24-05:00',
  method: 'POST',
  origen: '/v1/Coverage/structures',
};

export const Structures_500 = {
  process: '6bcfe5b0-f5c6-11ed-bf5a-1b56fd041de8',
  success: false,
  status: 500,
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar.',
  requestTime: '2023-05-18T21:53:28+00:00',
  method: 'GET',
};

export const BodyExample: StructuresDTO = {
  geographicAddressList: [{
    geographicAddress: [{
      daneCode: '66682000',
      neighborhood: 'LA FLORA',
      addressType: 'BM',
    }],
    alternateGeographicAddress: [{
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
    }],
    complements: [{
      nivel1Type: '',
      nivel2Type: '',
      nivel3Type: '',
      nivel6Type: '',
      nivel1Value: '',
      nivel2Value: '',
      nivel3Value: '',
      nivel4Type: '',
      nivel4Value: '',
      nivel5Type: '',
      nivel5Value: '',
      nivel6Value: '',
    }],
    plateTypeIt: '',
    plateValueIt: '',
  }],
};


export const BodyFakeLegacy: StructuresDTO = {
  geographicAddressList: [
    {
    geographicAddress: [{
      daneCode: '66682000',
      neighborhood: 'LOS BLOQUES',
      addressType: 'BM',
    }],
    alternateGeographicAddress: [{
      nivel1Type: '',
      nivel2Type: '',
      nivel3Type: '',
      nivel6Type: '',
      nivel1Value: '',
      nivel2Value: '',
      nivel3Value: '',
      nivel6Value: '',
      nivel4Type: 'MANZANA',
      nivel4Value: 'A',
      nivel5Type: 'CASA',
      nivel5Value: '10',
    }],
    complements: [{
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
      nivel5Type: 'CASA',
      nivel5Value: 'OTRO',
    }],
    plateTypeIt: '',
    plateValueIt: '',
  }
],
};

export const BodyFakeDataValidation: StructuresDTO = {
  geographicAddressList: [{
    geographicAddress: [{
      neighborhood: 'LOS BLOQUES',
      addressType: 'BM',
      daneCode:''
    }],
    complements:[{
      nivel1Type: '',
      nivel2Type: '',
      nivel3Type: '',
      nivel6Type: '',
      nivel1Value: '',
      nivel2Value: '',
      nivel3Value: '',
      nivel4Type: '',
      nivel4Value: '',
      nivel5Type: '',
      nivel5Value: '',
      nivel6Value: '',
    }],
    alternateGeographicAddress: [{
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
    }],
    plateTypeIt: '',
    plateValueIt: '',
  }],
};
