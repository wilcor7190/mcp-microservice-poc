/**
 * Se define la configuracion del modelo de la coleccion COLPRTEquipment (Prices)
 * @author Santiago Vargas
 */

import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { PriceListTecModel } from './price-tec.model';

@Schema()
export class PriceListHomeModel extends PriceListTecModel {

}
export const PriceListHomeSchema = SchemaFactory.createForClass(PriceListHomeModel);