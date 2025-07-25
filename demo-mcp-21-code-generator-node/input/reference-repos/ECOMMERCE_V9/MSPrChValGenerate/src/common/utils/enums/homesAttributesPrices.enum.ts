/**
 * Enumera las tareas que se realizan en el microservicio
 * @author Oscar Robayo
 */
export enum EhomesAttributesPrices {
    HOGARES = 'Hogares',
    CHARACTERISTICS = 'characteristics',
    PRODUCTOFFERINGPRICES = 'productOfferingPrices',
    NOMBRECORTONAME = 'Nombre Corto',
    NOMBRECORTOID = 'NombreCorto',
}

export const EHomesCharacteristics = { 
    NombreCorto: {
        id: 'NombreCorto', 
        name: 'Nombre Corto', 
        value: 'NOMBRE_OFERTA' },
    FAMILIA: {
        id: 'Familia', 
        name: 'FAMILIA', 
        value: 'FAMILIA' },
    SEGMENTOTARIFARIO: {
        id: 'SEGMENTO_TARIFARIO', 
        name: 'SEGMENTO TARIFARIO', 
        value: 'SEGMENTO_TARIFARIO' },
    TECNOLOGIA: {
        id: 'Tecnologia', 
        name: 'TECNOLOGIA', 
        value: 'TECNOLOGIA' },
    PERIODICIDAD: {
        id: 'PERIODICIDAD', 
        name: 'PERIODICIDAD', 
        value: 'PERIODICIDAD' },
    DESCRIPCIONOFERTA: {
        id: 'DESCRIPCION_OFERTA', 
        name: 'DESCRIPCION OFERTA', 
        value: 'DESCRIPCION_OFERTA' },
    TIPODEUNIDADINTERNET: {
        id: 'TIPO_DE_UNIDAD_INTERNET', 
        name: 'TIPO DE UNIDAD INTERNET', 
        value: 'TIPO_DE_UNIDAD_INTERNET' },
    VELOCIDADBAJADA: {
        id: 'velocidadBajada', 
        name: 'VELOCIDAD BAJADA', 
        value: 'VELOCIDAD_BAJADA' },
    VELOCIDADSUBIDA: {
        id: 'velocidadSubida', 
        name: 'VELOCIDAD SUBIDA', 
        value: 'VELOCIDAD_SUBIDA' },
    MAXIMOCUENTACORREO: {
        id: 'MAXIMO_CUENTA_CORREO', 
        name: 'MAXIMO CUENTA CORREO', 
        value: 'MAXIMO_CUENTA_CORREO' },
    INTERNET_FIJO_COMERCIAL: {
        id: 'IntFijoComercial', 
        name: 'INTERNET FIJO COMERCIAL', 
        value: 'INTERNET_FIJO_COMERCIAL' },
    TIPO_DE_UNIDAD_DATOS: {
        id: 'TIPO_DE_UNIDAD_DATOS', 
        name: 'TIPO DE UNIDAD DATOS', 
        value: 'TIPO_DE_UNIDAD_DATOS' },
    UNIDADES_DE_DATOS: {
        id: 'UNIDADES_DE_DATOS', 
        name: 'UNIDADES DE DATOS', 
        value: 'UNIDADES_DE_DATOS' },
    DATOSCOMERCIAL: {
        id: 'DATOS_COMERCIAL', 
        name: 'DATOS COMERCIAL', 
        value: 'DATOS_COMERCIAL' },
    TIPODEUNIDADTV: {
        id: 'TIPO_DE_UNIDAD_TV', 
        name: 'TIPO DE UNIDAD TV', 
        value: 'TIPO_DE_UNIDAD_TV' },
    RETROCEDER: {
        id: 'RETROCEDER', 
        name: 'RETROCEDER', 
        value: 'RETROCEDER' },
    GRABACIONPVR: {
        id: 'GRABACION_PVR', 
        name: 'GRABACION PVR', 
        value: 'GRABACION_PVR' },
    TIPODEUNIDADVOZFIJA: {
        id: 'TIPO_DE_UNIDAD_VOZ_FIJA', 
        name: 'TIPO DE UNIDAD VOZ FIJA', 
        value: 'TIPO_DE_UNIDAD_VOZ_FIJA' },
    UNIDADESAFIJOSLOCALES: {
        id: 'UNIDADES_A_FIJOS_LOCALES', 
        name: 'UNIDADES A FIJOS LOCALES', 
        value: 'UNIDADES_A_FIJOS_LOCALES' },
    UNIDADESACOMUNIDADFIJOCLARO: {
        id: 'UNIDADES_A_COMUNIDAD_FIJO_CLARO', 
        name: 'UNIDADES A COMUNIDAD FIJO CLARO', 
        value: 'UNIDADES_A_COMUNIDAD_FIJO_CLARO' },
    TELEFONIAFIJOCOMERCIAL: {
        id: 'TelFijoComercial', 
        name: 'TELEFONIA FIJO COMERCIAL', 
        value: 'TELEFONIA_FIJO_COMERCIAL' },
    TIPODEUNIDADVOZLDI: {
        id: 'TIPO_DE_UNIDAD_VOZ_LDI', 
        name: 'TIPO DE UNIDAD VOZ LDI', 
        value: 'TIPO_DE_UNIDAD_VOZ_LDI' },
    UNIDADES_A_ZONA_LDI_MD: {
        id: 'UNIDADES_A_ZONA_LDI_MD', 
        name: 'UNIDADES A ZONA LDI MD', 
        value: 'UNIDADES_A_ZONA_LDI_MD' },
    LDI_COMERCIAL: {
        id: 'LDIComercial', 
        name: 'LDI Comercial', 
        value: 'LDI_COMERCIAL' },
    ELEGIDOVOZCOMERCIAL: {
        id: 'ElegidoVozComercial', 
        name: 'ELEGIDO VOZ COMERCIAL', 
        value: 'ELEGIDO_VOZ_COMERCIAL' },
    EQUIPODOCSIS2: {
        id: 'EQUIPO_DOCSIS_2', 
        name: 'EQUIPO DOCSIS 2', 
        value: 'EQUIPO_DOCSIS_2' },
    EQUIPODOCSIS3: {
        id: 'EQUIPO_DOCSIS_3', 
        name: 'EQUIPO DOCSIS 3', 
        value: 'EQUIPO_DOCSIS_3' },
    EQUIPODUALBAND: {
        id: 'EQUIPO_DUAL_BAND', 
        name: 'EQUIPO DUAL BAND', 
        value: 'EQUIPO_DUAL_BAND' },
    EQUIPOONTFTTH: {
        id: 'EQUIPO_ONT_FTTH', 
        name: 'EQUIPO ONT FTTH', 
        value: 'EQUIPO_ONT_FTTH' },
    EQUIPOROUTERWTTH: {
        id: 'EQUIPO_ROUTER_WTTH', 
        name: 'EQUIPO ONT FTTH', 
        value: 'EQUIPO_ROUTER_WTTH' },
    MODEMADICIONAL: {
        id: 'MODEM_ADICIONAL', 
        name: 'MODEM ADICIONAL', 
        value: 'MODEM_ADICIONAL' },
    ACCESOHFC: {
        id: 'ACCESO_HFC', 
        name: 'ACCESO HFC', 
        value: 'ACCESO_HFC' },
    ACCESOFTTH: {
        id: 'ACCESO_FTTH', 
        name: 'ACCESO FTTH', 
        value: 'ACCESO_FTTH' },
    ACCESOWTTH: {
        id: 'ACCESO_WTTH', 
        name: 'ACCESO WTTH', 
        value: 'ACCESO_WTTH' },
    ACCESODTH: {
        id: 'ACCESO_DTH', 
        name: 'ACCESO DTH', 
        value: 'ACCESO_DTH' },
    PUNTOCABLEADOINCLUIDO: {
        id: 'PuntoCableadoIncluido', 
        name: 'PUNTO CABLEADO INCLUIDO', 
        value: 'PUNTO_CABLEADO_INCLUIDO' },
    SERVCUENTACORREO: {
        id: 'SERV_CUENTA_CORREO', 
        name: 'SERV CUENTA CORREO', 
        value: 'SERV_CUENTA_CORREO' },
    SUSCHBOBROADBAND: {
        id: 'SUSC_HBO_BROADBAND', 
        name: 'SUSC HBO BROADBAND', 
        value: 'SUSC_HBO_BROADBAND' },
    SUSCIPFIJA: {
        id: 'SUSC_IP_FIJA', 
        name: 'SUSC IP FIJA', 
        value: 'SUSC_IP_FIJA' },
    SUSCULTRAWIFI: {
        id: 'SUSC_ULTRA_WIFI', 
        name: 'SUSC ULTRA WIFI', 
        value: 'SUSC_ULTRA_WIFI' },
    PUNTOCABLEADOADICIONAL: {
        id: 'PUNTO_CABLEADO_ADICIONAL', 
        name: 'PUNTO CABLEADO ADICIONAL', 
        value: 'PUNTO_CABLEADO_ADICIONAL' },
    ALIANZACLAROVIDEO: {
        id: 'ALIANZA_CLARO_VIDEO', 
        name: 'ALIANZA CLARO VIDEO', 
        value: 'ALIANZA_CLARO_VIDEO' },
    ALIANZAFEELSAFE: {
        id: 'ALIANZA_FEEL_SAFE', 
        name: 'ALIANZA FEEL SAFE', 
        value: 'ALIANZA_FEEL_SAFE' },
    ALIANZAMCAFEE: {
        id: 'ALIANZA_MC_AFEE', 
        name: 'ALIANZA MC AFEE', 
        value: 'ALIANZA_MC_AFEE' },
    ALIANZAREVISTA15MINUTOS: {
        id: 'ALIANZA_REVISTA_15_MINUTOS', 
        name: 'ALIANZA REVISTA 15 MINUTOS', 
        value: 'ALIANZA_REVISTA_15_MINUTOS' },
    ALIANZATSOLUCIONA: {
        id: 'ALIANZA_T_SOLUCIONA', 
        name: 'ALIANZA T SOLUCIONA', 
        value: 'ALIANZA_T_SOLUCIONA' },
    ALIANZATVPLAYER: {
        id: 'ALIANZA_TV_PLAYER', 
        name: 'ALIANZA TV PLAYER', 
        value: 'ALIANZA_TV_PLAYER' },
    ALIANZAHASTEGAMING: {
        id: 'ALIANZA_HASTE_GAMING', 
        name: 'ALIANZA HASTE GAMING', 
        value: 'ALIANZA_HASTE_GAMING' },
    ALIANZATRESUELVEBRONCE: {
        id: 'ALIANZA_TRESUELVE_BRONCE', 
        name: 'ALIANZA TRESUELVE BRONCE', 
        value: 'ALIANZA_TRESUELVE_BRONCE' },
    ALIANZATRESUELVEORO: {
        id: 'ALIANZA_TRESUELVE_ORO', 
        name: 'ALIANZA TRESUELVE ORO', 
        value: 'ALIANZA_TRESUELVE_ORO' },
    ALIANZATRESUELVEPLATA: {
        id: 'ALIANZA_TRESUELVE_PLATA', 
        name: 'ALIANZA TRESUELVE PLATA', 
        value: 'ALIANZA_TRESUELVE_PLATA' },
    DECOPOSTPAGODTH: {
        id: 'DECO_POSTPAGO_DTH', 
        name: 'DECO POSTPAGO DTH', 
        value: 'DECO_POSTPAGO_DTH' },
    DECOPOSTPAGOFTTHHD: {
        id: 'DecoPostpagoFTTHHD', 
        name: 'DECO POSTPAGO FTTH HD', 
        value: 'DECO_POSTPAGO_FTTH_HD' },
    DECOPOSTPAGOFTTHNT: {
        id: 'DECO_POSTPAGO_FTTH_NT', 
        name: 'DECO POSTPAGO FTTH NT', 
        value: 'DECO_POSTPAGO_FTTH_NT' },
    DECOPOSTPAGOHFCHD: {
        id: 'DecoPostpagoHFCHD', 
        name: 'DECO POSTPAGO HFC HD', 
        value: 'DECO_POSTPAGO_HFC_HD' },
    DECOPOSTPAGOHFCNT: {
        id: 'DECO_POSTPAGO_HFC_NT', 
        name: 'DECO POSTPAGO HFC NT', 
        value: 'DECO_POSTPAGO_HFC_NT' },
    DECOPOSTPAGOHFCSD: {
        id: 'DECO_POSTPAGO_HFC_SD', 
        name: 'DECO POSTPAGO HFC SD', 
        value: 'DECO_POSTPAGO_HFC_SD' },
    DECOPOSTPAGOCLAROBOXTV: {
        id: 'DECO_POSTPAGO_CLARO_BOX_TV', 
        name: 'DECO POSTPAGO HFC SD', 
        value: 'DECO_POSTPAGO_CLARO_BOX_TV' },
    DECOPOSTPAGODTH1: {
        id: 'DECO_POSTPAGO_DTH1', 
        name: 'DECO POSTPAGO DTH1', 
        value: 'DECO_POSTPAGO_DTH1' },
    DECOPOSTPAGOFTTHHD1: {
        id: 'DECO_POSTPAGO_FTTH_HD1', 
        name: 'DECO POSTPAGO FTTH HD1', 
        value: 'DECO_POSTPAGO_FTTH_HD1' },
    DECOPOSTPAGOFTTHNT1: {
        id: 'DECO_POSTPAGO_FTTH_HD1', 
        name: 'DECO POSTPAGO FTTH HD1', 
        value: 'DECO_POSTPAGO_FTTH_HD1' },
    DECOPOSTPAGOHFCHD1: {
        id: 'DECO_POSTPAGO_HFC_HD1', 
        name: 'DECO POSTPAGO HFC HD1', 
        value: 'DECO_POSTPAGO_HFC_HD1' },
    DECOPOSTPAGOHFCNT1: {
        id: 'DECO_POSTPAGO_HFC_NT1', 
        name: 'DECO POSTPAGO HFC NT1', 
        value: 'DECO_POSTPAGO_HFC_NT1' },
    DECOPOSTPAGOHFCSD1: {
        id: 'DECO_POSTPAGO_HFC_SD1', 
        name: 'DECO POSTPAGO HFC SD1', 
        value: 'DECO_POSTPAGO_HFC_SD1' },
    DECOPOSTPAGOKAONTV: {
        id: 'DECO_POSTPAGO_KAON_TV', 
        name: 'DECO POSTPAGO KAON TV', 
        value: 'DECO_POSTPAGO_KAON_TV' },
    EQUIPOSMARTSPEAKER: {
        id: 'EQUIPO_SMART_SPEAKER', 
        name: 'EQUIPO SMART SPEAKER', 
        value: 'EQUIPO_SMART_SPEAKER' },
    EQUIPOSMARTSPEAKERFTTH: {
        id: 'EQUIPO_SMART_SPEAKER_FTTH', 
        name: 'EQUIPO SMART SPEAKER FTTH', 
        value: 'EQUIPO_SMART_SPEAKER_FTTH' },
    FUNCPREBLOQUEOCONTENIDO: {
        id: 'FUNC_PRE_BLOQUEO_CONTENIDO', 
        name: 'FUNC PRE BLOQUEO CONTENIDO', 
        value: 'FUNC_PRE_BLOQUEO_CONTENIDO' },
    FUNCTVPPV: {
        id: 'FUNC_TV_PPV', 
        name: 'FUNC TV PPV', 
        value: 'FUNC_TV_PPV' },
    CANALESTVDTH: {
        id: 'CANALES_TV_DTH', 
        name: 'CANALES TV DTH', 
        value: 'CANALES_TV_DTH' },
    CANALESTVFTTH: {
        id: 'CanalesTVFTTH', 
        name: 'CANALES TV FTTH', 
        value: 'CANALES_TV_FTTH' },
    CANALESTVHFC: {
        id: 'CanalesTVHFC', 
        name: 'Canales TV HFC', 
        value: 'CANALES_TV_HFC' },
    PUNTOADICIONALTV: {
        id: 'PUNTO_ADICIONAL_TV', 
        name: 'PUNTO ADICIONAL TV', 
        value: 'PUNTO_ADICIONAL_TV' },
    ELEGIDOS4X5MIN: {
        id: 'ELEGIDOS_4_X_5_MIN', 
        name: 'ELEGIDOS 4X5 MIN', 
        value: 'ELEGIDOS_4_X_5_MIN' },
    ELEGIDOSTELEFONIAFIJA: {
        id: 'ELEGIDOS_TELEFONIA_FIJA', 
        name: 'ELEGIDOS TELEFONIA FIJA', 
        value: 'ELEGIDOS_TELEFONIA_FIJA' },
    FUNCTELDEFAULT: {
        id: 'FUNC_TEL_DEFAULT', 
        name: 'FUNC TEL DEFAULT', 
        value: 'FUNC_TEL_DEFAULT' },   
    FUNCPOSPRIORIZACIONMINTIC: {
        id: 'FUNC_POS_PRIORIZACION_MINTIC', 
        name: 'FUNC POS PRIORIZACION MINTIC', 
        value: 'FUNC_POS_PRIORIZACION_MINTIC' },
    PUNTOINCLUIDOTEL: {
        id: 'PUNTO_INCLUIDO_TEL', 
        name: 'PUNTO INCLUIDO TEL', 
        value: 'PUNTO_INCLUIDO_TEL' }, 
    PUNTOADICIONALTEL: {
        id: 'PUNTO_ADICIONAL_TEL', 
        name: 'PUNTO ADICIONAL TEL', 
        value: 'PUNTO_ADICIONAL_TEL' }, 
    SUSCLDI: {
        id: 'SUSC_LDI', 
        name: 'SUSC LDI', 
        value: 'SUSC_LDI' },
    SUSCLDILDN: {
        id: 'SUSC_LDI_LDN', 
        name: 'SUSC LDI', 
        value: 'SUSC_LDI_LDN' },
    SUSCLDILDN30MIN: {
        id: 'SUSC_LDI_LDN_30_MIN', 
        name: 'SUSC LDI LDN 30 MIN', 
        value: 'SUSC_LDI_LDN_30_MIN' },
    SUBTIPOOFERTA: {
        id: 'Sub_Tipo_Oferta', 
        name: 'Sub Tipo Oferta', 
        value: 'SUBTIPO_OFERTA' },
    NODO: {
        id: 'NODO', 
        name: 'NODO', 
        value: 'NODO' },
    REGION: {
        id: 'REGION', 
        name: 'REGION', 
        value: 'REGION' },
    DEPARTAMENTO: {
        id: 'DEPARTAMENTO', 
        name: 'DEPARTAMENTO', 
        value: 'DEPARTAMENTO' },
    CIUDAD: {
        id: 'CIUDAD', 
        name: 'CIUDAD', 
        value: 'CIUDAD' },
    PUNTO_DE_VENTA: {
        id: 'PUNTO_DE_VENTA', 
        name: 'PUNTO DE VENTA', 
        value: 'PUNTO_DE_VENTA' },
    PROCESOS: {
        id: 'PROCESOS', 
        name: 'PROCESOS', 
        value: 'PROCESOS' },
    CUSTID: {
        id: 'CUSTID', 
        name: 'CUSTID', 
        value: 'CUSTID' },
    ANTIGUEEDADCLIENTE: {
        id: 'ANTIGUEEDAD_CLIENTE', 
        name: 'ANTIGUEEDAD CLIENTE', 
        value: 'ANTIGUEEDAD_CLIENTE' },
    ESTRATO: {
        id: 'Estrato', 
        name: 'ESTRATO', 
        value: 'ESTRATO' },
    CONVENIO: {
        id: 'CONVENIO', 
        name: 'CONVENIO', 
        value: 'CONVENIO' },
    SEGMENTO: {
        id: 'SEGMENTO', 
        name: 'SEGMENTO', 
        value: 'SEGMENTO' },
    COMPORTAMIENTODEPAGO: {
        id: 'COMPORTAMIENTO_DE_PAGO', 
        name: 'COMPORTAMIENTO DE PAGO', 
        value: 'COMPORTAMIENTO_DE_PAGO' },
    CALIFICACIONDECREDITO: {
        id: 'CALIFICACION_DE_CREDITO', 
        name: 'CALIFICACION DE CREDITO', 
        value: 'CALIFICACION_DE_CREDITO' },
    TRAMITE: {
        id: 'TRAMITE', 
        name: 'TRAMITE', 
        value: 'TRAMITE' },
    PERFILDEVENDEDOR: {
        id: 'PERFIL_DE_VENDEDOR', 
        name: 'PERFIL DE VENDEDOR', 
        value: 'PERFIL_DE_VENDEDOR' },
    IVAPORPRODUCTO: {
        id: 'Iva', 
        name: 'Iva', 
        value: 'ESTRATO'  },
    PRODUCTONUEVO: {
        id: 'PRODUCTO_NUEVO', 
        name: 'PRODUCTO NUEVO', 
        value: 'PRODUCTO_NUEVO' },
    TIPOOFERTA: {
        id: 'TipoOferta', 
        name: 'Tipo Oferta', 
        value: 'TIPO_OFERTA' },
    CANALESTVSD: {
        id: 'CanalesTVSD', 
        name: 'Canales TV SD', 
        value: 'CANALES_TV_SD' },
    TVFIJOCOMERCIAL: {
        id: 'TvFijoComercial', 
        name: 'TV Fijo Comercial', 
        value: 'TV_FIJO_COMERCIAL' },
}

export const EHomesPrices = {
    POINTERNET: {
        id: 'PO_INTERNET',
        versions: [{
            popType: 'PO_INTERNET',
            price: {
                amount: 'PO_INTERNET'
            },
        }],             
    },
    POTV: {
        id: 'PO_TV',
        versions: [{
            popType: 'PO_TV',
            price: {
                amount: 'PO_TV'
            },
        }],               
    },
    POTELEFONIA: {
        id: 'PO_TELEFONIA',
        versions: [{
            popType: 'PO_TELEFONIA',
            price: {
                amount: 'PO_TELEFONIA'
            },
        }],               
    },
}

export const EFilterPrices = [
        {
            $lookup:
            {
                from: "COLPRTHOMEATTRIBUTES",
                localField: "PO_INTERNET",
                foreignField: "OFERTA_ID",
                as: "RESULTADOINT"
            }
        },
        {
            $lookup:
            {
                from: "COLPRTHOMEATTRIBUTES",
                localField: "PO_TV",
                foreignField: "OFERTA_ID",
                as: "RESULTADOTV"
            }
        },
        {
            $lookup:
            {
                from: "COLPRTHOMEATTRIBUTES",
                localField: "PO_TELEFONIA",
                foreignField: "OFERTA_ID",
                as: "RESULTADOTEL"
            }
        },
        {
            $match: {
                $or: [
                    {
                        $and: [
                            {
                                PO_INTERNET: { $ne: "N/A" }, PO_TV: { $eq: "N/A" }, PO_TELEFONIA: { $eq: "N/A" }
                            },
                            {
                                "RESULTADOINT.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $eq: "N/A" }, PO_TV: { $ne: "N/A" }, PO_TELEFONIA: { $eq: "N/A" }
                            },
                            {
                                "RESULTADOTV.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $eq: "N/A" }, PO_TV: { $eq: "N/A" }, PO_TELEFONIA: { $ne: "N/A" }
                            },
                            {
                                "RESULTADOTEL.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $ne: "N/A" }, PO_TV: { $ne: "N/A" }, PO_TELEFONIA: { $eq: "N/A" }
                            },
                            {
                                "RESULTADOINT.OFERTA_ID": { $exists: true }, "RESULTADOTV.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $eq: "N/A" }, PO_TV: { $ne: "N/A" }, PO_TELEFONIA: { $ne: "N/A" }
                            },
                            {
                                "RESULTADOTV.OFERTA_ID": { $exists: true }, "RESULTADOTEL.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $ne: "N/A" }, PO_TV: { $eq: "N/A" }, PO_TELEFONIA: { $ne: "N/A" }
                            },
                            {
                                "RESULTADOINT.OFERTA_ID": { $exists: true }, "RESULTADOTEL.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $eq: "N/A" }, PO_TV: { $eq: "N/A" }, PO_TELEFONIA: { $eq: "N/A" }
                            },
                            {
                                "RESULTADOINT.OFERTA_ID": { $exists: false }, "RESULTADOTV.OFERTA_ID": { $exists: false }, "RESULTADOTEL.OFERTA_ID": { $exists: false }
                            }
    
                        ]
                    },
                    {
                        $and: [
                            {
                                PO_INTERNET: { $ne: "N/A" }, PO_TV: { $ne: "N/A" }, PO_TELEFONIA: { $ne: "N/A" }
                            },
                            {
                                "RESULTADOINT.OFERTA_ID": { $exists: true }, "RESULTADOTV.OFERTA_ID": { $exists: true }, "RESULTADOTEL.OFERTA_ID": { $exists: true }
                            }
    
                        ]
                    }
                ]
            }
        }
    ]




