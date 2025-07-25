import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { FeatureModel } from "./feature.model";

/**
 * Se define la configuracion del modelo de la coleccion COLPRTEquipment
 * @author Santiago Vargas
 */
@Schema()
export class EquipmentModel extends Document { 
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

    @Prop()
    URLKeyword: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(EquipmentModel);