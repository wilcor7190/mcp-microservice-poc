/**
 * Se define la configuracion del modelo de la coleccion COLPRTPRODUCTOFFERING
 * @author Daniel C Rubiano R
 */

import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class PriceModel extends Document {
  @Prop()
  amount: string;
}

@Schema()
class VersionPricesModel extends Document {
  @Prop()
  popType: string;

  @Prop()
  price: PriceModel;
}

@Schema()
class ProductOfferingPricesModel extends Document {
  @Prop()
  id: string;

  @Prop()
  versions: VersionPricesModel[];
}

@Schema()
class VersionModel extends Document {
  @Prop()
  family: string;

  @Prop()
  productOfferingPrices: ProductOfferingPricesModel[];
}

@Schema()
class ProductOfferingResponseModel extends Document {
  @Prop()
  id: string;

  @Prop()
  versions: VersionModel[];
}

@Schema()
export class DataModel extends Document {
  @Prop()
  getProductOfferingResponse: ProductOfferingResponseModel[];
}
