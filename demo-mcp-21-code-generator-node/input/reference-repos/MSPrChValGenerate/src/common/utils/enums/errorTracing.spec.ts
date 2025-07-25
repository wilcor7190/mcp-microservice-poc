import { EMessageErrorGeneral } from "./errorTracing";


describe('CollectionsNames should have correct values', () => {

    it('READ_JSON should --> "READ_JSON"', () => {
        expect(EMessageErrorGeneral.READ_JSON).toBe('ERROR EN LA TRANSAFORMACION DE LINEA DEL JSON DE FEATURES');
    });

    it('DOWNLOAD_PRICES should --> "DOWNLOAD_PRICES"', () => {
        expect(EMessageErrorGeneral.DOWNLOAD_PRICES).toBe('ERROR EN LA DESCARGA Y TRANSAFORMACION ');
    });

    it('SAVE_FILE_DB should --> "SAVE_FILE_DB"', () => {
        expect(EMessageErrorGeneral.SAVE_FILE_DB).toBe('ERROR EN EL GUARDADO DE DATA EN LA BASE DE DATOS');
    });

    it('TRANFORM_PRICES should --> "TRANFORM_PRICES"', () => {
        expect(EMessageErrorGeneral.TRANFORM_PRICES).toBe('ERROR EN LA TRANSFORMACION DE DATOS');
    });

    it('TRANFORM_PRICES_TECHNOLOOGY should --> "TRANFORM_PRICES_TECHNOLOOGY"', () => {
        expect(EMessageErrorGeneral.TRANFORM_PRICES_TECHNOLOOGY).toBe('ERROR EN LA TRANSFORMACION DE PRECIOS - TECNOLOGIA');
    });

    it('DOWNLOAD_FILE should --> "DOWNLOAD_FILE"', () => {
        expect(EMessageErrorGeneral.DOWNLOAD_FILE).toBe('ERROR EN LA DESCARGA POR MEDIO DEL SFTP');
    });

    it('DOWNLOAD_DATA_MOVIL should --> "DOWNLOAD_DATA_MOVIL"', () => {
        expect(EMessageErrorGeneral.DOWNLOAD_DATA_MOVIL).toBe('ERROR EN LA DESCARGA DE INFORMACION');
    });

    it('TRANFORM_PRICES_MOVIL should --> "TRANFORM_PRICES_MOVIL"', () => {
        expect(EMessageErrorGeneral.TRANFORM_PRICES_MOVIL).toBe('ERROR EN LA TRANSFORMACION DE PRECIOS - MOVIL');
    });
    
    it('TRANFORM_FEATURES_MOVIL should --> "TRANFORM_FEATURES_MOVIL"', () => {
        expect(EMessageErrorGeneral.TRANFORM_FEATURES_MOVIL).toBe('ERROR EN LA TRANSFORMACION DE CARACTERISTICAS - MOVIL');
    });

    it('CONEXION_ERROR_DB_SP should --> "CONEXION_ERROR_DB_SP"', () => {
        expect(EMessageErrorGeneral.CONEXION_ERROR_DB_SP).toBe('ERROR DE CONEXION A LA BASE DE DATOS');
    });

    it('total eneums', () => {
        expect(Object.keys(EMessageErrorGeneral).length).toBe(13);
    });
});