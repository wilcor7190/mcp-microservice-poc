/**
 * Se define la configuracion del modelo de la coleccion COLPRTHOMEPRICES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class HomePricesModel extends Document {
  @Prop()
  OFERTA_ID: string;

  @Prop()
  TIPO_OFERTA: string;

  @Prop()
  TIPO_BUNDLE: string;

  @Prop()
  PO_INTERNET: string;

  @Prop()
  OFERTA_INTERNET: string;

  @Prop()
  PO_TV: string;

  @Prop()
  OFERTA_TV: string;

  @Prop()
  PO_TELEFONIA: string;

  @Prop()
  OFERTA_TELEFONIA: string;

  @Prop()
  ESTRATO: string;

  @Prop()
  PRECIO_PLAN_INTERNET_S_I: string;

  @Prop()
  PRECIO_PLAN_TV_S_I: string;

  @Prop()
  PRECIO_PLAN_TELEFONIA_S_I: string;
}

export const HomePricesSchema = SchemaFactory.createForClass(HomePricesModel);
