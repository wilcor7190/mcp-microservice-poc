/**
 * Se define la configuracion del modelo de la coleccion COLPRTFREEEQUIPPRICES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EquipmentPricesModel extends Document {
  @Prop()
  Equipo: string;

  @Prop()
  Descrip_Comercial: string;

  @Prop()
  Material_Padre: string;
}

export const EquipmentPricesSchema =
  SchemaFactory.createForClass(EquipmentPricesModel);
