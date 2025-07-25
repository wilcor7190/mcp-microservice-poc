/**
 * Se define la configuracion del modelo de la coleccion COLPRTTTATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CharacteristicsVersionModel extends Document {
  @Prop()
  value: string;

  @Prop()
  changeState: string;

  @Prop()
  valueTypeSpecification: ValueTypeSpecificationModel;
}

@Schema()
export class ValueTypeSpecificationModel extends Document {
  @Prop()
  id: string;
}
