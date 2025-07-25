/**
 * Se define la configuracion del modelo de la coleccion coll_service_error
 * @author Fredy Santiago Martinez
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ versionKey: false, timestamps: true })
export class ServiceErrorModel extends Document {
    @Prop()
    origen: string;

    @Prop()
    message: string;

    @Prop()
    stack: string;

    @Prop()
    channel: string;

    @Prop({ type: Object, default: {} })
    request: any;
}

export const ServiceErrorSchema =  SchemaFactory.createForClass(ServiceErrorModel);
