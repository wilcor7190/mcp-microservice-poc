import { EAccountType, EBilling, EIndTax, EProcSales, ETypeDelivery, ETypePayment, ETypePlan, ETypeProduct, ETypeSales, EtypeDocument } from "../../common/utils/enums/params.enum";
import { CLienthomepassDto } from "../../controller/dto/clienthomepass/clienthomepass.dto";
import { ItemRefDto } from "../../controller/dto/clienthomepass/customer/customerInfo/orderRefList/orderRef/subOrderRefList/subOrderRef/productRefList/productRef/itemRefList/itemRef/itemRef.dto";
import { ItemRefListDto } from "../../controller/dto/clienthomepass/customer/customerInfo/orderRefList/orderRef/subOrderRefList/subOrderRef/productRefList/productRef/itemRefList/itemRefList.dto";
import { ProductRefDto } from "../../controller/dto/clienthomepass/customer/customerInfo/orderRefList/orderRef/subOrderRefList/subOrderRef/productRefList/productRef/productRef.dto";
import { ProductRefListDto } from "../../controller/dto/clienthomepass/customer/customerInfo/orderRefList/orderRef/subOrderRefList/subOrderRef/productRefList/productRefList.dto";

export const Client_200 = {
  process: '57acef90-2f94-11ed-87ac-c386524ea093',
  success: false,
  status: 503,
  documents: {
    code: 50000,
    message: 'Ya existe una solicitud en curso que se encuentra PENDIENTE. de barrio abierto.',
    source: 'AddressV2.1 - crearSolicitudInspira',
  },
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar',
  requestTime: '2022-09-08T16:36:09+00:00',
  responseTime: 8618,
  method: 'POST',
  origen: '/RSServicehomepass/v1/Coverage/PutClientHomepass',
};

export const PutClient_201 = {
  process: '28324c50-f5c9-11ed-bf5a-1b56fd041de8',
  success: true,
  status: 201,
  message: 'Cliente Operación no Soportado',
  requestTime: '2023-05-18T22:13:02+00:00',
  responseTime: 10,
  method: 'POST',
  origen: '/RSServicehomepass/v1/coverage/putClientHomepass',
};

export const Client_400 = {
  process: '2f9f8b10-f5c9-11ed-bf5a-1b56fd041de8',
  success: false,
  status: 400,
  documents: {
    code: 50000,
    message: 'No se encontraron datos en la Base de datos con el idCaseTcrm ECOM-2020294800',
  },
  message: 'No se encontraron datos en la Base de datos con el idCaseTcrm',
  requestTime: '2023-05-18T22:13:15+00:00',
  responseTime: 14,
  method: 'POST',
  origen: '/RSServicehomepass/v1/coverage/putClientHomepass',
};

export const PutClient_400_DataValidation = {
  process: 'c0566d20-92a6-11ee-88d2-870d91d38186',
  success: false,
  status: 400,
  documents: [
    'customer.customerInfo.mediumCharacteristic.idCaseTcrm must be a string',
    'customer.customerInfo.mediumCharacteristic.idCaseTcrm should not be empty',
  ],
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar.',
  requestTime: '2023-12-04T08:12:18-05:00',
  method: 'POST',
  origen: '/MSServicehomepass/v1/coverage/putClientHomepass',
};

export const PutClient_400_channelValidation = {
  process: 'a5114430-92a7-11ee-8d7a-7d547711df5f',
  success: true,
  status: 400,
  message: 'El canal recibido no es soportado por el servicio.',
  requestTime: '2023-12-04T08:18:44-05:00',
  method: 'POST',
  origen: '/MSServicehomepass/v1/coverage/putClientHomepass',
};

export const Client_500 = {
  process: '6bcfe5b0-f5c6-11ed-bf5a-1b56fd041de8',
  success: false,
  status: 500,
  message:
    '!Ups¡, parece que algo salió mal, inténtalo nuevamente o si prefieres comunícate con nosotros a la línea en Bogotá 7457466 o déjanos tus datos dando clic en Aceptar.',
  requestTime: '2023-05-18T21:53:28+00:00',
  method: 'GET',
};

const itemRefMock:ItemRefDto[] = [
  {
    id: 'PO_IntPosPlanFtthA100',
    parentId: 'PO_IntPosPlanFtthA100',
    serviceName: 'PO_IntPosPlanFtthA100',
  }
]
const itemRefListMock:ItemRefListDto = {
  itemRef: itemRefMock
}
const productRefMock:ProductRefDto[] = [
 {
      planId: 'PO_IntPosPlanFtthA100',
      planDescription: 'Internet 100 MB FTTH',
      price: '6000',
      nonTaxPrice: '1200',
      totalPrice: '4000',
      taxInd: EIndTax.OTT01,
      itemRefList: itemRefListMock,
    },
]
const productRefListMock:ProductRefListDto = {
  productRef: productRefMock
}

export const BodyExampleMigratedUser : CLienthomepassDto = {
  customer: {
    isMigratedUser: true,
    user: 'hectorg',
    ip: '191.25.01.172',
    requestDate: new Date('2008-09-28T20:49:45'),
    customerInfo: {
      id: '1029818201',
      idType: EtypeDocument.CC,
      firstname: 'Ana',
      lastname: 'Fernandez Clower',
      mediumCharacteristic: {
        emailAddress: 'Lpinzon@gmail.com.co',
        phoneNumber: '3002323232',
        idCaseTcrm: 'ECOM-4888576818',
      },
      scId: '102910',
      transactionIdentity: '109219810',
      profileCustomerId: '109219810',
      agreementRef: {
        eBilling: EBilling.S,
      },
      orderRefList: [
        {
          orderRef: {
            id: '0',
            date: new Date('8/4/2020'),
            subOrderRefList: [
              {
                subOrderRef: {
                  id: '0',
                  salesProcess: EProcSales.HOG,
                  productType: ETypeProduct.Claro,
                  planType: ETypePlan.POS,
                  salesType: ETypeSales.ACT,
                  deliveryType: ETypeDelivery.ID,
                  paymentMethodRef: {
                    id: ETypePayment.CON,
                  },
                  accountRef: {
                    id: '102919201012',
                    type: EAccountType.M,
                  },
                  productRefList: productRefListMock,
                  shippingRef: {
                    daneCodeCity: '73001000',
                    city: 'BOGOTA',
                    daneCodeProvince: '21',
                    province: 'CUNDINAMARCA',
                    villageCenterDaneCode: '21000100',
                    villageCenter: 'Suba',
                    neighborhood: 'Subachoque',
                    address: 'Calle 112 # 23-12',
                    region: 'Norte',
                    addressId: '21',
                    strata: '4',
                    technology: 'MOV',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export const BodyExampleNotMigratedUser:CLienthomepassDto = {
  customer: {
    isMigratedUser: false,
    user: 'hectorg',
    ip: '191.25.01.172',
    requestDate: new Date('2008-09-28T20:49:45'),
    customerInfo: {
      id: '1029818201',
      idType: EtypeDocument.CC,
      firstname: 'Ana',
      lastname: 'Fernandez Clower',
      mediumCharacteristic: {
        emailAddress: 'Lpinzon@gmail.com.co',
        phoneNumber: '3002323232',
        idCaseTcrm: 'ECOM-4888576818',
      },
      scId: '102910',
      transactionIdentity: '109219810',
      profileCustomerId: '109219810',
      agreementRef: {
        eBilling: EBilling.S,
      },
      orderRefList: [
        {
          orderRef: {
            id: '0',
            date: new Date('8/4/2020'),
            subOrderRefList: [
              {
                subOrderRef: {
                  id: '0',
                  salesProcess: EProcSales.HOG,
                  productType: ETypeProduct.Claro,
                  planType: ETypePlan.POS,
                  salesType: ETypeSales.ACT,
                  deliveryType: ETypeDelivery.ID,
                  paymentMethodRef: {
                    id: ETypePayment.CON,
                  },
                  accountRef: {
                    id: '102919201012',
                    type: EAccountType.M,
                  },
                  productRefList: productRefListMock,
                  shippingRef: {
                    daneCodeCity: '73001000',
                    city: 'BOGOTA',
                    daneCodeProvince: '21',
                    province: 'CUNDINAMARCA',
                    villageCenterDaneCode: '21000100',
                    villageCenter: 'Suba',
                    neighborhood: 'Subachoque',
                    address: 'Calle 112 # 23-12',
                    region: 'Norte',
                    addressId: '21',
                    strata: '4',
                    technology: 'MOV',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export const BodyFakeDataValidation:CLienthomepassDto = {
  customer: {
    isMigratedUser: false,
    user: 'hectorg',
    ip: '191.25.01.172',
    requestDate: new Date('2008-09-28T20:49:45'),
    customerInfo: {
      id: '1029818201',
      idType: EtypeDocument.CC,
      firstname: 'Ana',
      lastname: 'Fernandez Clower',
      mediumCharacteristic: {
        emailAddress: 'Lpinzon@gmail.com.co',
        phoneNumber: '3002323232',
        idCaseTcrm: null
      },
      scId: '102910',
      transactionIdentity: '109219810',
      profileCustomerId: '109219810',
      agreementRef: {
        eBilling: EBilling.S,
      },
      orderRefList: [
        {
          orderRef: {
            id: '0',
            date: new Date('8/4/2020'),
            subOrderRefList: [
              {
                subOrderRef: {
                  id: '0',
                  salesProcess: EProcSales.HOG,
                  productType: ETypeProduct.Claro,
                  planType: ETypePlan.POS,
                  salesType: ETypeSales.ACT,
                  deliveryType: ETypeDelivery.ID,
                  paymentMethodRef: {
                    id: ETypePayment.CON,
                  },
                  accountRef: {
                    id: '102919201012',
                    type: EAccountType.M,
                  },
                  productRefList: productRefListMock,
                  shippingRef: {
                    daneCodeCity: '73001000',
                    city: 'BOGOTA',
                    daneCodeProvince: '21',
                    province: 'CUNDINAMARCA',
                    villageCenterDaneCode: '21000100',
                    villageCenter: 'Suba',
                    neighborhood: 'Subachoque',
                    address: 'Calle 112 # 23-12',
                    region: 'Norte',
                    addressId: '21',
                    strata: '4',
                    technology: 'MOV',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export const BodyFakeIdNotFound:CLienthomepassDto = {
  customer: {
    isMigratedUser: false,
    user: 'hectorg',
    ip: '191.25.01.172',
    requestDate: new Date('2008-09-28T20:49:45'),
    customerInfo: {
      id: '1029818201',
      idType: EtypeDocument.CC,
      firstname: 'Ana',
      lastname: 'Fernandez Clower',
      mediumCharacteristic: {
        emailAddress: 'Lpinzon@gmail.com.co',
        phoneNumber: '3002323232',
        idCaseTcrm: 'ECOM-331404',
      },
      scId: '102910',
      transactionIdentity: '109219810',
      profileCustomerId: '109219810',
      agreementRef: {
        eBilling: EBilling.S,
      },
      orderRefList: [
        {
          orderRef: {
            id: '0',
            date: new Date('8/4/2020'),
            subOrderRefList: [
              {
                subOrderRef: {
                  id: '0',
                  salesProcess: EProcSales.HOG,
                  productType: ETypeProduct.Claro,
                  planType: ETypePlan.POS,
                  salesType: ETypeSales.ACT,
                  deliveryType: ETypeDelivery.ID,
                  paymentMethodRef: {
                    id: ETypePayment.CON,
                  },
                  accountRef: {
                    id: '102919201012',
                    type: EAccountType.M,
                  },
                  productRefList: productRefListMock,
                  shippingRef: {
                    daneCodeCity: '73001000',
                    city: 'BOGOTA',
                    daneCodeProvince: '21',
                    province: 'CUNDINAMARCA',
                    villageCenterDaneCode: '21000100',
                    villageCenter: 'Suba',
                    neighborhood: 'Subachoque',
                    address: 'Calle 112 # 23-12',
                    region: 'Norte',
                    addressId: '21',
                    strata: '4',
                    technology: 'MOV',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};
