/**
 * Se define la configuracion del modelo de la coleccion COLPRTTERMS
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TermsModel extends Document {
  @Prop()
  Marca: string;

  @Prop()
  Referencia: string;

  @Prop()
  'Rango de fecha': string;

  @Prop()
  Unidades: string;

  @Prop()
  'T&C': string;
}

export const TermSchema = SchemaFactory.createForClass(TermsModel);
