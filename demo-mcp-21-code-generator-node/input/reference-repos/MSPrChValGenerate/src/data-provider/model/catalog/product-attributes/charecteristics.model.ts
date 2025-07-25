/**
 * Se define la configuracion del modelo de la coleccion COLPRTTTATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CharacteristicsVersionModel } from './charecteristics-versions.model';

@Schema()
export class CharacteristicsModel extends Document {
  @Prop()
  id: string;

  @Prop()
  versions: CharacteristicsVersionModel[];
}
