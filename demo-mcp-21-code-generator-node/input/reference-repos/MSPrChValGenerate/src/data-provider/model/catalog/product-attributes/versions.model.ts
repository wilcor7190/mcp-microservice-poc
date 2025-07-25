/**
 * Se define la configuracion del modelo de la coleccion COLPRTTTATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ValidForModel } from './valid-for.model';
import { CharacteristicsModel } from './charecteristics.model';

@Schema()
export class VersionsModel extends Document {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  state: string;

  @Prop()
  description: string;

  @Prop()
  validFor: ValidForModel;

  @Prop()
  baseEntityId: string;

  @Prop()
  specificationType: string;

  @Prop()
  sellIndicator: string;

  @Prop()
  characteristics: CharacteristicsModel[];
}
