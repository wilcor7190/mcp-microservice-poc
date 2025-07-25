/**
 * Se define la configuracion del modelo de la coleccion COLPRTEquipment
 * @author Oscar Robayo
 */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class EquipmentModel extends Document {

    @Prop()
    PriceListUniqueId: string;

    @Prop()
    PriceListName: string;

    @Prop()
    CatentryPartNumber: string;

    @Prop()
    CatentryUniqueId: string;

    @Prop()
    Identifier: string;

    @Prop()
    Precedence: string;

    @Prop()
    StartDate: string;

    @Prop()
    EndDate: string;

    @Prop()
    LastUpdate: string;

    @Prop()
    QuantityUnitIdentifier: string;

    @Prop()
    MinimumQuantity: string;

    @Prop()
    Description: string;

    @Prop()
    PriceInCOP: string;

    @Prop()
    PriceInCOPTax: string;

    @Prop()
    PlazosSinImpuestos: string;

    @Prop()
    PlazosConImpuestos: string;

    @Prop()
    Field1: string;

    @Prop()
    Field2: string;

    @Prop()
    Delete: string
}

export const EquipmentSchema = SchemaFactory.createForClass(EquipmentModel);


    
  