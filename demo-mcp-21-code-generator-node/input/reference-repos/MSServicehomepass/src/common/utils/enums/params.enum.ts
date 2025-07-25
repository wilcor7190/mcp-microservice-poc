/**
 * Enumeraciones usadas internamente en la lógica de negocio del microservicio
 * @author Oscar Avila
 */
export enum EIdParam {
  CHANNEL = 'CHANNEL',
}


export enum EstateTransaction {
  PENDIENTE = 'PENDIENTE',
  INICIADO = 'INICIADO',
  FINALIZADO = 'FINALIZADO',
}

export enum StateHHPP {
  HHPP_CREADO = 'HHPP CREADO',
}

export enum EtypeDocument {
  CC = 'CC',
  CE = 'CE',
}

export enum Echannel {
  EC9_B2C = 'EC9_B2C',
  // EC9_B2B = 'EC9_B2B'
}

export enum ValueConsult {
  ECOMMERCE = 'Ecommerce',
}

export enum ETypeProductPackage {
  ECOMMERCE = 'ECOMMERCE',
}

export enum EBilling {
  S = 'S',
  N = 'N',
}

export enum EProcSales {
  TER = 'TER',
  KIT = 'KIT',
  HOG = 'HOG',
  TEC = 'TEC',
  DEFAULT = '',
}

export enum ETypePlan {
  POS = 'POS',
  PRE = 'PRE',
  DEFAULT = '',
}

export enum ETypeProduct {
  Claro = 'Claro',
  ClaroShop = 'ClaroShop',
}

export enum ETypeSales {
  ACT = 'ACT',
  POR = 'POR',
  REPO = 'REPO',
  DEFAULT = '',
}

export enum ETypeDelivery {
  PV = 'PV',
  D = 'D',
  SIM = 'SIM',
  ID = 'ID',
}

export enum ETypePayment {
  CON = 'CON',
  FIN = 'FIN',
  MIX = 'MIX',
}

export enum ETypePaymentLegaos {
  CON = 'CONTADO',
  FIN = 'FINANCIADO',
  MIX = 'PAGOMIXTO',
}

export enum ETypeSalesLegaos {
  ACT = 'VTA',
}

export enum ETypePlanLegaos {
  POS = 'Postpago',
  PRE = 'Prepago',
  INS = 'Inspira',
}

export enum ETypeDeliveryLegaos {
  D = 'Domicilio',
}

export enum EAccountType {
  M = 'M',
  F = 'F',
}

export enum ECategory {
  SIM = 'SIM',
  TV0001 = 'TV0001',
  TV0002 = 'TV0002',
  TV0003 = 'TV0003',
}

export enum ECategoryPlan {
  S = 'S',
  I = 'I',
}

export enum EClassPlan {
  A = 'A',
  I = 'I',
  C = 'C',
}

export enum EIndTax {
  OTT02 = 'OTT02',
  OTT01 = 'OTT01',
  OTT03 = 'OTT03',
}

export enum EMessageOrder {
  ORDER_CREATED = 'Orden creada',
  ORDER_EXISTS = 'La orden ya existe',
  ORDER_ERROR = 'La orden no fue procesada exitosamente',
}

export enum EMessageOrderProduct {
  PRODUCT_NOTEXIST = 'El producto de venta no existe',
}

export enum ESaleProductStatus {
  SP_PENDING = 'PENDING',
  SP_COMPLETED = 'COMPLETED',
  SP_SUCCESS = 'RESERVED',
  SP_FAILED = 'RESERVATION_FAILED',
  SP_PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SP_PAYMENT_SUCCESS = 'PAYMENT_CONFIRMATION_SUCCESSFULL',
  SP_PAYMENT_FAILED = 'PAYMENT_CONFIRMATION_FAILED',
  SP_PAYMENT_CONCILIATION_FAILED = 'PAYMENT_CONCILIATION_FAILED',
  SP_PAYMENT_CONCILIATION_SUCCESS = 'PAYMENT_CONCILIATION_SUCCESSFULL',
  SP_PAYMENT_NOT_SUPPORTED = 'SALES_PRODUCT_NOT_SUPPORTED',
  SP_GENERATE_CONTRACT_FAILED = 'CONTRACT_GENERATION_FAILED',
  SP_LEGALIZE_CONTRACT_FAILED = 'CONTRACT_LEGALIZE_FAILED',
  SP_PAYMENT_UPDATE_BILL_FAILED = 'UPDATE_BILL_MEDIUM_FAILED',
  SP_SHOPPING_CART_ACCEPT_FAILED = 'SHOPPING_CART_ACCEPT_FAILED',
  SP_SHOPPING_CART_CONFIRM_FAILED = 'SHOPPING_CART_CONFIRM_FAILED',
  SP_NUMBER_RESERVE_FAILED = 'NUMBER_RESERVE_FAILED',
  SP_PAYMENT_NUMBER_CONFIRM_FAILED = 'NUMBER_CONFIRM_FAILED',
  SP_HOMOLOGATES_FAILED = 'HOMOLOGATES_FAILED',
}

export enum ECurrentTask {
  RESERVE = 'RESERVE',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
}

export enum EFlag {
  TRANSITION = 'T',
  TOBE = 'TB',
  NA = 'N/A',
  FLAG_NOT_FOUND = 'El producto de venta no existe',
}

export enum EPathValidate {
  INITIAL_PATH = 'orders/salesProducts/',
  INITIAL_CLIENT_PATH = 'client/',
}

export enum EConsecutive {
  NUM_SUB_ORDEN_TMP = 'numSubOrdenTmp',
}

export enum EOracleConnectionStatus {
  CONNECTION = 'conexion',
  RECONNECTION = 'reconexión',
  PING = 'ping'
}

export enum EProcessStatus {
  START = 'START',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}