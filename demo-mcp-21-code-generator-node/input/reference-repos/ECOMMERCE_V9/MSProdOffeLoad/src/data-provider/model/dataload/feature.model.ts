/**
 * Se define la configuracion del modelo para las caracteristicas
 * @author Santiago Vargas
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FeatureModel extends Document {
    @Prop()
    name: string;

    @Prop()
    value: string;
}

export const FeatureSchema = SchemaFactory.createForClass(FeatureModel);