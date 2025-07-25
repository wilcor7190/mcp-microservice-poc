/**
 * Se define la configuracion del modelo de la coleccion COLPRTPRODUCTOFFERING
 * @author Daniel C Rubiano R
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DataModel } from './data.model';

@Schema()
class ParamsModel extends Document {
  @Prop()
  family: string;

  @Prop()
  type: string;

  @Prop()
  page: number;
}

@Schema({ versionKey: false })
export class ProductOfferingModel extends Document {
  @Prop()
  params: ParamsModel;

  @Prop()
  data: DataModel;
}

export const ProductOfferingSchema =
  SchemaFactory.createForClass(ProductOfferingModel);
