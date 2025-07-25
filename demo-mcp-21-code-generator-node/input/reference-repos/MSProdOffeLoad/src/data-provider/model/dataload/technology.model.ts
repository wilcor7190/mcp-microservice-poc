/**
 * Se define la configuracion del modelo de la coleccion COLPRTTechnology (Features)
 * @author Santiago Vargas
 */

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { FeatureModel } from "./feature.model";

@Schema()
export class TechnologyModel extends Document {

  @Prop()
  partNumber: string;

  @Prop()
  features: FeatureModel[];

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  id: string;

  @Prop()
  thumbnail: string;

  @Prop()
  fullImage: string;

}

export const TechnologySchema = SchemaFactory.createForClass(TechnologyModel);