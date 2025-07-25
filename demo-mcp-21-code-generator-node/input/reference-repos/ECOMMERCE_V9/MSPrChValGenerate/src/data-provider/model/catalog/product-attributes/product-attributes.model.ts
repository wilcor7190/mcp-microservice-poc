/**
 * Se define la configuracion del modelo de la coleccion COLPRTTTATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { VersionsModel } from './versions.model';

@Schema()
export class ProductAttributesModel extends Document {
  @Prop()
  id: string;

  @Prop()
  href: string;

  @Prop()
  versions: VersionsModel[];
}

export const ProductAttributesSchema = SchemaFactory.createForClass(
    ProductAttributesModel,
);
