/**
 * Se define la configuracion del modelo de la coleccion COLPRTHOMEATTRIBUTES
 * @author Daniel C Rubiano R
 */
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class HomeAttributesModel extends Document {
  @Prop()
  OFERTA_ID: string;

  @Prop()
  FAMILIA: string;

  @Prop()
  SEGMENTO_TARIFARIO: string;

  @Prop()
  TIPO_OFERTA: string;

  @Prop()
  SUBTIPO_OFERTA: string;

  @Prop()
  TECNOLOGIA: string;

  @Prop()
  PERIODICIDAD: string;

  @Prop()
  NOMBRE_OFERTA: string;

  @Prop()
  DESCRIPCION_OFERTA: string;

  @Prop()
  VELOCIDAD_BAJADA: string;

  @Prop()
  VELOCIDAD_SUBIDA: string;

  @Prop()
  TIPO_DE_UNIDAD_INTERNET: string;

  @Prop()
  MAXIMO_CUENTA_CORREO: string;

  @Prop()
  INTERNET_FIJO_COMERCIAL: string;

  @Prop()
  TIPO_DE_UNIDAD_DATOS: string;

  @Prop()
  UNIDADES_DE_DATOS: string;

  @Prop()
  DATOS_COMERCIAL: string;

  @Prop()
  TIPO_DE_UNIDAD_TV: string;

  @Prop()
  RETROCEDER: string;

  @Prop()
  GRABACION_PVR: string;

  @Prop()
  TIPO_DE_UNIDAD_VOZ_FIJA: string;

  @Prop()
  UNIDADES_A_FIJOS_LOCALES: string;

  @Prop()
  UNIDADES_A_COMUNIDAD_FIJO_CLARO: string;

  @Prop()
  TELEFONIA_FIJO_COMERCIAL: string;

  @Prop()
  TIPO_DE_UNIDAD_VOZ_LDI: string;

  @Prop()
  UNIDADES_A_ZONA_LDI_MD: string;

  @Prop()
  LDI_COMERCIAL: string;

  @Prop()
  ELEGIDO_VOZ_COMERCIAL: string;

  @Prop()
  EQUIPO_DOCSIS_2: string;

  @Prop()
  EQUIPO_DOCSIS_3: string;

  @Prop()
  EQUIPO_DUAL_BAND: string;

  @Prop()
  EQUIPO_ONT_FTTH: string;

  @Prop()
  EQUIPO_ROUTER_WTTH: string;

  @Prop()
  MODEM_ADICIONAL: string;

  @Prop()
  ACCESO_HFC: string;

  @Prop()
  ACCESO_FTTH: string;

  @Prop()
  ACCESO_WTTH: string;

  @Prop()
  ACCESO_DTH: string;

  @Prop()
  PUNTO_CABLEADO_INCLUIDO: string;

  @Prop()
  SERV_CUENTA_CORREO: string;

  @Prop()
  SUSC_HBO_BROADBAND: string;

  @Prop()
  SUSC_IP_FIJA: string;

  @Prop()
  SUSC_ULTRA_WIFI: string;

  @Prop()
  PUNTO_CABLEADO_ADICIONAL: string;

  @Prop()
  ALIANZA_CLARO_VIDEO: string;

  @Prop()
  ALIANZA_FEEL_SAFE: string;

  @Prop()
  ALIANZA_MC_AFEE: string;

  @Prop()
  ALIANZA_REVISTA_15_MINUTOS: string;

  @Prop()
  ALIANZA_T_SOLUCIONA: string;

  @Prop()
  ALIANZA_TV_PLAYER: string;

  @Prop()
  ALIANZA_HASTE_GAMING: string;

  @Prop()
  ALIANZA_TRESUELVE_BRONCE: string;

  @Prop()
  ALIANZA_TRESUELVE_ORO: string;

  @Prop()
  ALIANZA_TRESUELVE_PLATA: string;

  @Prop()
  DECO_POSTPAGO_DTH: string;

  @Prop()
  DECO_POSTPAGO_FTTH_HD: string;

  @Prop()
  DECO_POSTPAGO_FTTH_NT: string;

  @Prop()
  DECO_POSTPAGO_HFC_HD: string;

  @Prop()
  DECO_POSTPAGO_HFC_NT: string;

  @Prop()
  DECO_POSTPAGO_HFC_SD: string;

  @Prop()
  DECO_POSTPAGO_CLARO_BOX_TV: string;

  @Prop()
  DECO_POSTPAGO_DTH1: string;

  @Prop()
  DECO_POSTPAGO_FTTH_HD1: string;

  @Prop()
  DECO_POSTPAGO_FTTH_NT1: string;

  @Prop()
  DECO_POSTPAGO_HFC_HD1: string;

  @Prop()
  DECO_POSTPAGO_HFC_NT1: string;

  @Prop()
  DECO_POSTPAGO_HFC_SD1: string;

  @Prop()
  DECO_POSTPAGO_KAON_TV: string;

  @Prop()
  EQUIPO_SMART_SPEAKER: string;

  @Prop()
  EQUIPO_SMART_SPEAKER_FTTH: string;

  @Prop()
  FUNC_PRE_BLOQUEO_CONTENIDO: string;

  @Prop()
  FUNC_TV_PPV: string;

  @Prop()
  CANALES_TV_DTH: string;

  @Prop()
  CANALES_TV_FTTH: string;

  @Prop()
  CANALES_TV_HFC: string;

  @Prop()
  PUNTO_ADICIONAL_TV: string;

  @Prop()
  ELEGIDOS_4X5_MIN: string;

  @Prop()
  ELEGIDOS_TELEFONIA_FIJA: string;

  @Prop()
  FUNC_TEL_DEFAULT: string;

  @Prop()
  FUNC_POS_PRIORIZACION_MINTIC: string;

  @Prop()
  PUNTO_INCLUIDO_TEL: string;

  @Prop()
  PUNTO_ADICIONAL_TEL: string;

  @Prop()
  SUSC_LDI: string;

  @Prop()
  SUSC_LDI_LDN: string;

  @Prop()
  SUSC_LDI_LDN_30_MIN: string;

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
  ANTIGUEDAD_CLIENTE: string;

  @Prop()
  CONVENIO: string;

  @Prop()
  SEGMENTO: string;

  @Prop()
  COMPORTAMIENTO_DE_PAGO: string;

  @Prop()
  CALIFICACION_DE_CREDITO: string;

  @Prop()
  TRAMITE: string;

  @Prop()
  PERFIL_DE_VENDEDOR: string;

  @Prop()
  TV_FIJO_COMERCIAL: string;
}

export const HomeAttributesSchema =
  SchemaFactory.createForClass(HomeAttributesModel);
