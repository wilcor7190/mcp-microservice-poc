/**
 * Obtiene el mapeo para el temporal de precios
 * @author alexisterzer
 */
export interface IPricesTemporal {
    Equipo: number;
    Descrip_Comercial: string;
    Material_Padre: number;
    Prec_sin_IVA_sin_SIMZP07: string;
    Precio_sin_IVAZP06: number;
    Precio_IVA_FinalRedZP05: number;
    Menos_SimcardZD23: string;
    IVA_SIM: number;
    Pr_Equipo_sin_IVAZC01?: number;
    Prec_Equipo_con_IVAZP09?: number;
    IVA_FINAL: number;
    family: string
}

export interface IPricesJobMovilPricesTemporal {
    OFERTA_ID: string;
    OFERTA: string;
    PRECIO_VOZ_SIN_IMPUESTO: number;
    PRECIO_DATOS_SIN_IMPUESTO: number;
    PRECIO_DE_VENTA_CON_IMPUESTO: number;
    IMPUESTO_IVA: number;
    IMPUESTO_CONSUMO: number;
    
}

export interface IPricesJobFijaPricesTemporal {
    OFERTA_ID: string;
    TIPO_OFERTA: string;
    TIPO_BUNDLE: string;
    PO_INTERNET: string;
    OFERTA_INTERNET: string;
    PO_TV: string;
    OFERTA_TV: string;
    PO_TELEFONIA: string;
    OFERTA_TELEFONIA: string;
    ESTRATO: number;
    PRECIO_PLAN_INTERNET_S_I: string;
    PRECIO_PLAN_TV_S_I: string;
    PRECIO_PLAN_TELEFONIA_S_I: string;
    
}

