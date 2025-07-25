export const elementEstadoIniciado = {
  stateHHPP: '',
  cmtRequestCrearSolicitud: [
    {
      customer: {
        requestDate: new Date(),
        user: 'user',
        customerInfo: {
          firstname: 'name',
          lastname: 'lastname',
          mediumCharacteristic: { phoneNumber: '123' },
          orderRefList: [{ orderRef: { subOrderRefList: [{ subOrderRef: { shippingRef: { daneCodeCity: '', strata: '' } } }], date: new Date() } }],
        },
      },
    },
  ],
  address: [
    {
      geographicAddressList: {
        geographicAddress: [
          {
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
            streetBlockGenerator: '',
            streetBlock: '',
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
          },
        ],
      },
    },
  ],
};

export const argForGetCusRequestHomepassError = [
  {
    cmtRequestCrearSolicitud: elementEstadoIniciado.cmtRequestCrearSolicitud,
    sourceAplication: 'EC9_B2C',
    response: [{idSolicitud: '123'}],
    idCaseTcrm: '123'
  },
];
