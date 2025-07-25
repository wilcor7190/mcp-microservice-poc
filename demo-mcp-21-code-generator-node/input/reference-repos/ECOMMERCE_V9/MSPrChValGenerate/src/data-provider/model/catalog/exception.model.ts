/**
 * Se define la configuracion del modelo de la coleccion COLPRTEXCEPTIONS
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ExceptionModel extends Document {
  @Prop()
  SKU: string;
}

export const ExceptionSchema = SchemaFactory.createForClass(ExceptionModel);
