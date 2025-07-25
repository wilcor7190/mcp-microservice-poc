/**
 * Se define la configuracion del modelo de la coleccion COLPRTEquipment (Prices)
 * @author Santiago Vargas
 */

import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { PriceListTecModel } from './price-tec.model';

@Schema()
export class PriceListEquModel extends PriceListTecModel {

}
export const PriceListEquSchema = SchemaFactory.createForClass(PriceListEquModel);