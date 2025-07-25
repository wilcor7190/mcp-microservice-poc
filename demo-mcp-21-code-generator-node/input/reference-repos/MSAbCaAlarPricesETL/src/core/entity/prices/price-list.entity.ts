/**
 * Se define la entidad Prices y una clase builder para la creación
 * @author Daniel C Rubiano R
 */

export interface Prices {
  PriceListUniqueId: string;
  PriceListName: string;
  CatentryPartNumber: string;
  CatentryUniqueId: string;
  Identifier: string;
  Precedence: string;
  StartDate: string;
  EndDate: string;
  LastUpdate: string;
  QuantityUnitIdentifier: string;
  MinimumQuantity: string;
  Description: string;
  PriceInCOP: string;
  PriceInCOPTax: string;
  PlazosSinImpuestos: string;
  PlazosConImpuestos: string;
  Field1: string;
  Field2: string;
  Delete: string;
}

export class PriceListBuilder {
  private priceList: Prices = {
    PriceListUniqueId: '',
    PriceListName: '',
    CatentryPartNumber: '',
    CatentryUniqueId: '',
    Identifier: '',
    Precedence: '',
    StartDate: '',
    EndDate: '',
    LastUpdate: '',
    QuantityUnitIdentifier: '',
    MinimumQuantity: '',
    Description: '',
    PriceInCOP: '',
    PriceInCOPTax: '',
    PlazosSinImpuestos: '',
    PlazosConImpuestos: '',
    Field1: '',
    Field2: '',
    Delete: '',
  };

  setPriceListName(priceListName: string): PriceListBuilder {
    this.priceList.PriceListName = priceListName;
    return this;
  }

  setCatentryPartNumber(catentryPartNumber: string): PriceListBuilder {
    this.priceList.CatentryPartNumber = catentryPartNumber;
    return this;
  }

  setPriceInCOP(priceInCOP: string): PriceListBuilder {
    this.priceList.PriceInCOP = priceInCOP;
    return this;
  }

  build(): Prices {
    return this.priceList;
  }
}
