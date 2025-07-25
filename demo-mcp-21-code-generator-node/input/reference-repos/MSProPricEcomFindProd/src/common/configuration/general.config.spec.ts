import * as config from '../configuration/general.config';

describe('General Config should have correct values', () => {

    it('correct values apiMapping', () => {
        expect(config.default.apiMapping).toContain('/RSProPricEcomFindProd');
    });

    it('correct values controller Message', () => {
        expect(config.default.controllerMessage).toBeDefined();
    });
}); 