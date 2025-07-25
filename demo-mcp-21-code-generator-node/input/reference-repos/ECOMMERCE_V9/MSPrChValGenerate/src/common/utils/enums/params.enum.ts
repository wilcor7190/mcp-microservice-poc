/**
 * Enumeraciones usadas internamente en la lógica de negocio del microservicio
 * @author alexisterzer
 */

export enum EtypeDocument {
    CC = 'CC',
    CE = 'CE'
}

export enum Echannel {
    EC9_B2C = 'EC9_B2C',
    //EC9_B2B = 'EC9_B2B'
}

export enum TypeParams {
    price = 'productOfferingPrices',
    feature = 'characteristics'
}

export enum FamilyParams {
    equipment = 'Terminales', 
    kitprepago = 'KitPrepago', 
    TerLibres = 'TerminalesLibres',
    technology = 'Tecnologia',
    posPlaDat = 'PosPlaDat',
    posPlaMov = 'PosPlaMov',
    prePla = 'PrePla',
    prepagoCharacteristics = 'Prepago',
    postPagoCharacteristics = 'Pospago',
}

export enum NameCollectionDataBase{
    DATA_MOBILE_ATTRIBUTES= "COLPRTPREPOATTRIBUTES",    
    DATA_MOBILE_PRICES= "COLPRTPREPOPRICES",
    DATA_HOME_ATTRIBUTES= "COLPRTHOMEATTRIBUTES",
    DATA_HOME_PRICES= "COLPRTHOMEPRICES",
}

export enum ValuesParams{
    MOBILE_PRICES = "job_mobile_prices", 
    HOME_PRICES = "job_home_prices",
    HOME_ATTRIBUTES = "job_Home_Attributes",
    MOBILE_ATTRIBUTES = "job_mobile_Attributes",
    TERTEC_ATRTIBUTES = "load_features",
    TERTEC_PRICES = "load_prices", 
    EXCEPTION = "load_exception",
    TERMCOND = "load_tyc",
    PRICESEQU = "pricesEqu",
    PRICESTEC = "pricesTech",
}