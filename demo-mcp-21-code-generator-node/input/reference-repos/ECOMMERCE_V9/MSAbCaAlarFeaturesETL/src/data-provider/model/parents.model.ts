/**
 * Se define la configuracion del modelo de la coleccion de padres temporal
 * @author Oscar Robayo
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EFamily } from '../../common/utils/enums/categories.enum';

class FeaturesModel {
    id: EFamily;
    name: string;
    value: string;
}

@Schema({ versionKey: false })
export class ParentsTemporaryModel extends Document {
    @Prop({ required: true })
    parentPartNumber: string;

    @Prop({required: true})
    family: string;

    @Prop({required: true, type:FeaturesModel})
    features: object;
}

export const ParentsTemporarySchema = SchemaFactory.createForClass(ParentsTemporaryModel);
