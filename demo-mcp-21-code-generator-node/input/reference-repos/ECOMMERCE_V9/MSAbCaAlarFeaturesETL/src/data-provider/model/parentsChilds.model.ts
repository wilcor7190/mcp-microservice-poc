/**
 * Se define la configuracion del modelo de la coleccion COLPRTCLASIFPARENTS (Offeload)
 * @author Santiago Vargas
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class parentPartNumberModel {
  parentPartNumber: object[]
}

@Schema()
export class ParentsChildsModel extends Document {
  
  @Prop({ type: parentPartNumberModel })
  parentPartNumber: object;

  @Prop()
  family: string;
}


export const ParentsChildsSchmea = SchemaFactory.createForClass(ParentsChildsModel);