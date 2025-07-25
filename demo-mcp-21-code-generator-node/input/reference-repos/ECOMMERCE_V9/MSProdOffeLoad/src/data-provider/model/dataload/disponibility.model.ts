/**
 * Se define la configuracion del modelo de la coleccion COLPRTDisponibility (Disponibility)
 * @author Santiago Vargas
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DisponibilityPartNumberModel extends Document {

  @Prop()
  sku: string;

  @Prop()
  description: string;

}

@Schema()
export class DisponibilityModel extends Document {

  @Prop()
  parentPartNumber: string;

  @Prop()
  partNumber: DisponibilityPartNumberModel[];

  @Prop()
  stockDisponibility: string;

}

export const DisponibilityPartNumberSchema = SchemaFactory.createForClass(DisponibilityPartNumberModel);
export const DisponibilitySchema = SchemaFactory.createForClass(DisponibilityModel);