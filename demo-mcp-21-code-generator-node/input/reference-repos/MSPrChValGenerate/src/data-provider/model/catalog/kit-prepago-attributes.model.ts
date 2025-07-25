/**
 * Se define la configuracion del modelo de la coleccion COLPRTKITPREPAIDPRICES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class KitPrepagoAttributesModel extends Document {
  @Prop()
  APLICACION: string;

  @Prop()
  TECNOLOGIA: string;

  @Prop()
  DURACION: string;

  @Prop()
  VOZ_COMERCIAL: string;

  @Prop()
  UNIDADES_DE_DATOS_MOVIL: string;

  @Prop()
  DATOS_COMERCIAL: string;

  @Prop()
  TETHERING_COMERCIAL: string;

  @Prop()
  CANTIDAD_A_MOVIL_ON_NET: string;

  @Prop()
  UNIDADES_DE_VOZXLLAMADA: string;

  @Prop()
  ELEGIDO_VOZ_COMERCIAL: string;

  @Prop()
  AMIGO_VOZ_COMERCIAL: string;

  @Prop()
  UNIDADES_DE_ELEGIDOS_SMS: string;

  @Prop()
  ELEGIDO_SMS_COMERCIAL: string;

  @Prop()
  CANTIDAD_TOTAL: string;

  @Prop()
  CANTIDAD_MAXIMA_MOVILES_TODO_DESTINO: string;

  @Prop()
  CANTIDAD_MAXIMA_MOVIL_PREPAGO_CLARO: string;

  @Prop()
  CANTIDAD_MAXIMA_FIJO_CLARO: string;

  @Prop()
  UNIDADES_DE_APPS: string;

  @Prop()
  APPS_ELEGIBLE_COMERCIAL: string;

  @Prop()
  APPS_GRUPO_COMERCIAL: string;

  @Prop()
  UNIDADES_DE_SMS_TODO_DESTINO: string;

  @Prop()
  SMS_COMERCIAL: string;

  @Prop()
  TIPO_DE_UNIDAD_VOZ_LD: string;

  @Prop()
  ZONA1_LDI: string;

  @Prop()
  ZONA2_LDI: string;

  @Prop()
  ZONA3_LDI: string;

  @Prop()
  ZONA_SATELITAL: string;

  @Prop()
  ZONA_A_LDI: string;

  @Prop()
  UNIDADES_ZONA_A_LDI_EN_MINUTOS: string;

  @Prop()
  LDI_COMERCIAL: string;

  @Prop()
  ZONA1_ROAMING: string;

  @Prop()
  ZONA2_ROAMING: string;

  @Prop()
  ZONA3_ROAMING: string;

  @Prop()
  ZONA4_ROAMING: string;

  @Prop()
  ZONA5_ROAMING: string;

  @Prop()
  ROAMING_COMERCIAL: string;

  @Prop()
  NODO: string;

  @Prop()
  REGION: string;

  @Prop()
  DEPARTAMENTO: string;

  @Prop()
  CIUDAD: string;

  @Prop()
  PUNTO_DE_VENTA: string;

  @Prop()
  PROCESOS: string;

  @Prop()
  CUSTID: string;

  @Prop()
  ANTIGUEEDAD_CLIENTE: string;

  @Prop()
  ESTRATO: string;

  @Prop()
  CONVENIO: string;

  @Prop()
  COMPORTAMIENTO_DE_PAGO: string;

  @Prop()
  CALIFICACION_DE_CREDITO: string;

  @Prop()
  TRAMITE: string;

  @Prop()
  PERFIL_DE_VENDEDOR: string;

  @Prop()
  TIPO_SERVICIO: string;

  @Prop()
  OFERTA_ID: string;

  @Prop()
  OFERTA_PO: string;

  @Prop()
  FAMILIA: string;

  @Prop()
  SEGMENTO_TARIFARIO: string;

  @Prop()
  TIPO_OFERTA: string;

  @Prop()
  SUBTIPO_OFERTA: string;

  @Prop()
  SEGMENTO: string;

  @Prop()
  NOMBRE_OFERTA: string;

  @Prop()
  DESCRIPCION_OFERTA: string;

  @Prop()
  DESCRIPCION_LARGA: string;

  @Prop()
  TIPO_DE_UNIDAD_VOZ_MOVIL: string;

  @Prop()
  UNIDADES_TODO_DESTINO: string;

  @Prop()
  TIPO_DE_UNIDAD_DATOS_MOVIL: string;

  @Prop()
  TIPO_DE_UNIDAD_ELEGIDOS_VOZ: string;

  @Prop()
  CANTIDAD_A_TODO_DESTINO: string;

  @Prop()
  TIPO_DE_UNIDAD_AMIGOS_VOZ: string;

  @Prop()
  TIPO_DE_UNIDAD_VOZ_FAMILIA_Y_AMIGOS: string;

  @Prop()
  FAMILIA_Y_AMIGOS_COMERCIAL: string;

  @Prop()
  SUSCRITO_A_DATOS_COMPARTIDOS: string;

  @Prop()
  DESCUENTA_DE_LAS_UNIDADES_DE_DATOS: string;

  @Prop()
  TIPO_DE_UNIDAD_DATOS_APPS: string;

  @Prop()
  APPS_COMERCIALES: string;

  @Prop()
  URL_TWITTER: string;

  @Prop()
  URL_FACEBOOK: string;

  @Prop()
  URL_WHATSAPP: string;

  @Prop()
  MARKET: string;
}

export const KitPrepagoAttributesSchema = SchemaFactory.createForClass(
  KitPrepagoAttributesModel,
);
