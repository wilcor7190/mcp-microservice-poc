/**
 * Se define la configuracion del modelo de la coleccion caracteristicas
 * @author Juan Gabriel Garzon
 */import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class FeaturesOriginalModel extends Document{ 

    @Prop()
    id: string;
    @Prop()
    href: string;
    @Prop()
    versions: object[];

}

export const FeaturesOriginalSchema = SchemaFactory.createForClass(FeaturesOriginalModel);