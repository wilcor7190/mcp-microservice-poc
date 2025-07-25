/**
 * Se define las configuraciones generales del los modelos
 * @author Alexis Strezer
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FamilyParams, TypeParams } from 'src/common/utils/enums/params.enum';

class ParamsModel {
    family: FamilyParams;
    type: TypeParams;
    Page?: number;
}

class DataModel {
    getProductOfferingResponse: any[]

    family?: string | null;
}

@Schema({ versionKey: false })
export class GeneralModel extends Document {
    @Prop({ required: true })
    params: ParamsModel;

    @Prop({required: true, type:DataModel})
    data: object;
}

export const GeneralSchema = SchemaFactory.createForClass(GeneralModel);