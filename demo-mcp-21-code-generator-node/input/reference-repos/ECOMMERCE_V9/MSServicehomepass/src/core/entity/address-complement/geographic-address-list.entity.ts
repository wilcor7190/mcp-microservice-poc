/**
 * Interface para el objeto de respuesta en AddressComplement
 * @author Damian Leonardo Duarte
 */

export interface IGeographicAddressList {
  geographicAddress: IGeographicAddress[];
}

export interface IGeographicAddress {
  alternateGeographicAddress?: IComplement | {};
  complements?: IComplement[];
  plateTypelt?: string;
  plateValueIt?: string;
  detailId?: string | number;
  textAddress?: string;
  subId?: string | number;
  strata?: string | number;
  streetAlt?: string;
  neighborhood?: string;
  streetType?: string;
  streetNr?: string;
  streetLt?: string;
  way2Word?: string;
  streetBis?: string;
  streetBlock?: string;
  geographicSubAddress?: IGeographicSubAddress;
  addressPlate?: string;
  indications?: string;
  geoState?: string;
  word3G?: string;
  addressType?: string;
  geographicLocation?: string;
}

export interface IComplement {
  nivel1Type?: string;
  nivel1Value?: string;
  nivel2Type?: string;
  nivel2Value?: string;
  nivel3Type?: string;
  nivel3Value?: string;
  nivel4Type?: string;
  nivel4Value?: string;
  nivel5Type?: string;
  nivel5Value?: string;
  nivel6Type?: string;
  nivel6Value?: string;
}

export interface IGeographicSubAddress {
  streetType: string;
  streetNr: string;
  streetLt: string;
  way2Word: string;
  streetBis: string;
  streetBlock: string;
}
