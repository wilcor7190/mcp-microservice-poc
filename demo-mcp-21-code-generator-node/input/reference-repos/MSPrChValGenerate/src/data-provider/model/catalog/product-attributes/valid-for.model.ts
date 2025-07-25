/**
 * Se define la configuracion del modelo de la coleccion COLPRTTTATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ValidForModel extends Document {
  @Prop()
  startDateTime: string;

  @Prop()
  enddatetime: string;
}
