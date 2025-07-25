/**
 * Se define la configuracion del modelo de la coleccion COLPRTKITPREPAIDPRICES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class KitPrepagoPricesModel extends Document {
  @Prop()
  Equipo: string;

  @Prop()
  Descrip_Comercial: string;

  @Prop()
  Material_Padre: string;
}

export const KitPrepagoPricesSchema = SchemaFactory.createForClass(
  KitPrepagoPricesModel,
);
