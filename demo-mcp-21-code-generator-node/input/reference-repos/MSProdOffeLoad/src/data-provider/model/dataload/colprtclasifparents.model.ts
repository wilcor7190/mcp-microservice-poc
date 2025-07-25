/**
 * Se define la configuracion del modelo de la coleccion COLPRTCLASIFPARENTS (Offeload)
 * @author Santiago Vargas
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed } from 'mongoose';

@Schema()
export class ParentsChildsModel extends Document {
  @Prop({ type: 'Mixed' })
  parentPartNumber: Mixed;
}

export const ParentsChildsSchmea = SchemaFactory.createForClass(ParentsChildsModel);