import { IPricesJobFijaPricesTemporal, IPricesJobMovilPricesTemporal, IPricesTemporal } from './pricesTemporal.entity';

describe('IPrices', () => {
  it('should have properties ', () => {
    const message: IPricesTemporal = {
        Equipo: 123,
        Descrip_Comercial: 'test',
        Material_Padre: 123,
        Prec_sin_IVA_sin_SIMZP07: 'test',
        Precio_sin_IVAZP06: 123,
        Precio_IVA_FinalRedZP05: 123,
        Menos_SimcardZD23: 'test',
        IVA_SIM: 123,
        Pr_Equipo_sin_IVAZC01: 123,
        Prec_Equipo_con_IVAZP09: 123,
        IVA_FINAL: 123,
        family: 'test'
    };

    expect(message).toHaveProperty('Equipo');
    expect(message).toHaveProperty('Descrip_Comercial');
    expect(message).toHaveProperty('Material_Padre');
    expect(message).toHaveProperty('Prec_sin_IVA_sin_SIMZP07');
    expect(message).toHaveProperty('Precio_sin_IVAZP06');
    expect(message).toHaveProperty('Precio_IVA_FinalRedZP05');
    expect(message).toHaveProperty('Menos_SimcardZD23');
    expect(message).toHaveProperty('IVA_SIM');
    expect(message).toHaveProperty('Pr_Equipo_sin_IVAZC01');
    expect(message).toHaveProperty('Prec_Equipo_con_IVAZP09');
    expect(message).toHaveProperty('IVA_FINAL');
    expect(message).toHaveProperty('family');
  });
});

describe('IPricesMovil', () => {
    it('should have properties ', () => {
      const message: IPricesJobMovilPricesTemporal = {
        OFERTA_ID: 'test',
        OFERTA: 'test',
        PRECIO_VOZ_SIN_IMPUESTO: 123,
        PRECIO_DATOS_SIN_IMPUESTO: 132,
        PRECIO_DE_VENTA_CON_IMPUESTO: 123,
        IMPUESTO_IVA: 123,
        IMPUESTO_CONSUMO: 123,
      };
  
      expect(message).toHaveProperty('OFERTA_ID');
      expect(message).toHaveProperty('OFERTA');
      expect(message).toHaveProperty('PRECIO_VOZ_SIN_IMPUESTO');
      expect(message).toHaveProperty('PRECIO_DATOS_SIN_IMPUESTO');
      expect(message).toHaveProperty('PRECIO_DE_VENTA_CON_IMPUESTO');
      expect(message).toHaveProperty('IMPUESTO_IVA');
      expect(message).toHaveProperty('IMPUESTO_CONSUMO');
    });
  });

  describe('IPricesJobFija', () => {
    it('should have properties ', () => {
      const message: IPricesJobFijaPricesTemporal = {
        OFERTA_ID: 'test',
        TIPO_OFERTA: 'test',
        TIPO_BUNDLE: 'test',
        PO_INTERNET: 'test',
        OFERTA_INTERNET: 'test',
        PO_TV: 'test',
        OFERTA_TV: 'test',
        PO_TELEFONIA: 'test',
        OFERTA_TELEFONIA: 'test',
        ESTRATO: 123,
        PRECIO_PLAN_INTERNET_S_I: 'test',
        PRECIO_PLAN_TV_S_I: 'test',
        PRECIO_PLAN_TELEFONIA_S_I: 'test',
      };
  
      expect(message).toHaveProperty('OFERTA_ID');
      expect(message).toHaveProperty('TIPO_OFERTA');
      expect(message).toHaveProperty('TIPO_BUNDLE');
      expect(message).toHaveProperty('PO_INTERNET');
      expect(message).toHaveProperty('OFERTA_INTERNET');
      expect(message).toHaveProperty('PO_TV');
      expect(message).toHaveProperty('OFERTA_TV');
      expect(message).toHaveProperty('PO_TELEFONIA');
      expect(message).toHaveProperty('OFERTA_TELEFONIA');
      expect(message).toHaveProperty('ESTRATO');
      expect(message).toHaveProperty('PRECIO_PLAN_INTERNET_S_I');
      expect(message).toHaveProperty('PRECIO_PLAN_TV_S_I');
      expect(message).toHaveProperty('PRECIO_PLAN_TELEFONIA_S_I');
      
    });
  });