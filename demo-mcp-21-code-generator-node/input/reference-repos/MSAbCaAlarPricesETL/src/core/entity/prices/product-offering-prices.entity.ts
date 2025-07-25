/**
 * Se define las entidades de la respuesta del servicio Product Offering
 * @author Daniel C Rubiano R
 */

import { PopTypeEnum } from '../../../common/utils/enums/prices.enum';

export interface Price {
  amount: any;
}

export interface Version2 {
  popType: PopTypeEnum;
  price: Price;
}

export interface ProductOfferingPrice {
  id: string;
  versions: Version2[];
}

export interface Version {
  productOfferingPrices: ProductOfferingPrice[];
  family: string;
}

export interface GetProductOfferingResponse {
  versions: Version[];
  id: string;
}

export interface Data {
  getProductOfferingResponse: GetProductOfferingResponse[];
}

export interface Params {
  family: string;
  type: string;
  page: number;
}

export interface Page {
  params: Params;
  data: Data;
}

export interface LastPrices {
  CatentryPartNumber: string;
  extendedSitesCatalogAssetStore: string;
  extendedSitesCatalogAssetStoreList: string;
  family: string;
}
export interface PriceByPopType {
  precioVentaOneTimeCop: number;
  precioBaseOneTimeCop: number;
  ivaCop: number;
  priceBaseWithoutDiscountCop: number;
  salesPriceWithoutDiscountCop: number;
  IVAWithoutDiscountCop: number;
}
