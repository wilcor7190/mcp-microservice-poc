/**
 * Se define la configuracion del modelo de la coleccion COLPRTEquipment (Prices)
 * @author Santiago Vargas
 */

import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { PriceListTecModel } from './price-tec.model';

@Schema()
export class PriceListPosModel extends PriceListTecModel {

}
export const PriceListPosSchema = SchemaFactory.createForClass(PriceListPosModel);