import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EFamily, ETypeParams } from '../../common/utils/enums/categories.enum';

class ParamsModel {
    family: EFamily;
    type: ETypeParams;
    Page?: number;
}

class DataModel {
    getProductOfferingResponse: any[]
}

/**
 * Se define la configuracion del modelo de la coleccion COLPRTPRODUCTOFFERING
 * @author Santiago Vargas
 */
@Schema({ versionKey: false })
export class ContingencyModel extends Document {
    @Prop({ required: true })
    params: ParamsModel;

    @Prop({required: true, type:DataModel})
    data: object;
}

export const ContingencySchema = SchemaFactory.createForClass(ContingencyModel);