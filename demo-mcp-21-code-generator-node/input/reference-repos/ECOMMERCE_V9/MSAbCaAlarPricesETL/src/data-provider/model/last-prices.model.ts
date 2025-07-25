import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class GeneralLastPrices extends Document {
  @Prop()
  CatentryPartNumber: string;

  @Prop()
  extendedSitesCatalogAssetStore: string;

  @Prop()
  extendedSitesCatalogAssetStoreList: string;
  
  @Prop()
  family: string;
}

export const GeneralSchemaLastPrices =
  SchemaFactory.createForClass(GeneralLastPrices);
