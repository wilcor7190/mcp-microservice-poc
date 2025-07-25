import { GeographicAddressListDTO } from "../../controller/dto/hompass/geographicAddressList.dto";
import { HomePassDTO } from "../../controller/dto/hompass/hompass.dto";
import { GeographicAddressDTO } from "../../controller/dto/hompass/geographicAddress.dto";
import { ComplementsDto } from "../../controller/dto/hompass/complements.dto";
import { AlternateGeographicAddressDTO } from "../../controller/dto/hompass/alternateGeographicAddress.dto";
const complementsMock : ComplementsDto[] = [{
  nivel1Type: '',
  nivel2Type: '',
  nivel3Type: '',
  nivel4Type: '',
  nivel5Type: 'CASA',
  nivel6Type: '',
  nivel1Value: '',
  nivel2Value: '',
  nivel3Value: '',
  nivel4Value: '',
  nivel5Value: '',
  nivel6Value: '',
}]
const alternateGeographicAddressMock:AlternateGeographicAddressDTO[] = [{
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
}]
const geographicAddresMock : GeographicAddressDTO = {
    type: 'CK',
    streetType: 'CALLE',
    streetNr: '75',
    streetSuffix: '',
    streetName: '',
    streetNrGenerator: '12',
    streetLtGenerator: '',
    streetBisGenerator: '',
    streetBlockGenerator: '',
    plate: '70',
    streetAlt: '',
    neighborhood: '',
    streetLt: '',
    streetNlPostViaP: '',
    streetBis: '',
    streetBlock: '',
    streetNlPostViaG: '',
    complements: complementsMock ,
    alternateGeographicAddress: alternateGeographicAddressMock,
    cadastreId: 'd2079',
    plateValueLt: '',
    plateTypeLt: '',
    geoState: 'D',
    idDetailAddress: '',
    '3GWord':''
}
const geographicAddresListMock :GeographicAddressListDTO[] = [
  {geographicAddress:[geographicAddresMock]} 
]
const aip = '0'
export const BodyExampleMigratedUser:HomePassDTO = {
  isMigratedUser: true,
  transactionId: '18327983',
  ip: aip,
  daneCode: '11001000',
  address: 'CL 75 12 70',
  isDth: 'true',
  managementNode: 'node',
  user: 'user258',
  strata: '1',
  geographicAddressList: geographicAddresListMock
};

export const BodyExampleNotMigratedUser:HomePassDTO = {
  isMigratedUser: false,
  transactionId: '18327983',
  ip: aip,
  daneCode: '11001000',
  address: 'CL 75 12 70',
  isDth: 'true',
  managementNode: 'node',
  user: 'user258',
  strata: '1',
  geographicAddressList: geographicAddresListMock,
};

export const BodyFakeDataValidation:HomePassDTO = {
  isMigratedUser: false,
  transactionId: '18327983',
  ip: aip,
  daneCode: '11001000',
  address: 'CL 75 12 70',
  isDth: 'true',
  managementNode: 'node',
  user: 'user258',
  strata: '1',
  geographicAddressList: geographicAddresListMock,
};

export const VALIDACION_DE_CAMPOS = 'daneCode should not be empty';

export const HomePass_200 = {
  process: '6cb76740-8fdc-11ee-be44-a1992fed8d36',
  success: true,
  status: 200,
  documents: {
    geographicAddress: {
      igacAddress: 'CL 75 12 70',
      latitudeCoordinate: '4.66131837',
      lengthCoordinate: '-74.05870882',
      strata: '1',
      splitAddress: {
        type: 'CK',
        streetAlt: 'P',
        neighborhood: null,
        streetType: 'CALLE',
        streetNr: '75',
        streetSuffix: null,
        streetNlPostViaP: null,
        streetBis: null,
        streetBlockGenerator: null,
        streetTypeGenerator: null,
        streetNrGenerator: '12',
        streetLtGenerator: null,
        streetNlPostViaG: null,
        streetBisGenerator: null,
        streetName: null,
        addressPlate: '70',
        complement: {
          nivel1Type: null,
          nivel2Type: null,
          nivel3Type: null,
          nivel4Type: null,
          nivel5Type: 'CASA',
          nivel6Type: null,
          nivel1Value: null,
          nivel2Value: null,
          nivel3Value: null,
          nivel4Value: null,
          nivel5Value: null,
          nivel6Value: null,
        },
        alternateGeographicAddress: {
          nivel1Type: null,
          nivel2Type: null,
          nivel3Type: null,
          nivel4Type: null,
          nivel5Type: null,
          nivel6Type: null,
          nivel1Value: null,
          nivel2Value: null,
          nivel3Value: null,
          nivel4Value: null,
          nivel5Value: null,
          nivel6Value: null,
        },
        plateTypeLt: null,
        plateValueLt: null,
        cadastreId: 'd2079',
        geoState: 'D',
      },
      listCover: [
        {
          technology: 'BI',
          node: '3B4023',
          state: 'ACT',
          qualificationDate: '2018/12/04',
        },
        {
          technology: 'FOG',
          node: 'GPON 15706',
          state: '',
          qualificationDate: '',
        },
        {
          technology: 'DTH',
          node: 'HCHICB',
          state: 'ACT',
          qualificationDate: '2018/12/04',
        },
        {
          technology: 'MOV',
          node: 'BOG.Sergio Arboleda',
          state: '',
          qualificationDate: '',
        },
        {
          technology: 'LTE',
          node: 'Viable_LTE',
          state: '',
          qualificationDate: '',
        },
      ],
      listHhpps: [
        {
          id: 2079,
          idQualificationTechnologyType: '',
          rushCblType: 'CAJA RELIANCE',
          state: 'CS',
          technology: 'BI',
          nodes: {
            node: {
              nodeId: '',
              state: 'ACT',
              qualificationDate: '2018/12/04',
              nodeName: 'UNIVERSIDAD 6                ',
              technology: 'BI',
            },
          },
        },
      ],
    },
  },
  message: 'En la dirección ingresada se encuentra instalado un servicio Claro.',
  requestTime: '2023-11-30T18:58:57-05:00',
  responseTime: 2223,
  method: 'POST',
  origen: '/MSServicehomepass/v1/coverage/homepass',
};

export const HomePass_201 = {
  process: '61b5e8c0-8fdd-11ee-8520-91d5cd36285e',
  success: true,
  status: 201,
  message: 'Cliente Operación no Soportado',
  requestTime: '2023-11-30T19:05:48-05:00',
  responseTime: 5,
  method: 'POST',
  origen: '/MSServicehomepass/v1/coverage/homepass',
};

export const HomePass_400 = {
  process: '3d27e2e0-f5c5-11ed-bf5a-1b56fd041de8',
  success: false,
  status: 400,
  documents: ['daneCode must be a string', 'daneCode should not be empty'],
  message: 'Error validación de campos obligatorios.',
  requestTime: '2023-05-18T21:45:00+00:00',
  method: 'POST',
};

export const HomePass_500 = {
  process: '6bcfe5b0-f5c6-11ed-bf5a-1b56fd041de8',
  success: false,
  status: 500,
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar.',
  requestTime: '2023-05-18T21:53:28+00:00',
  method: 'POST',
};
