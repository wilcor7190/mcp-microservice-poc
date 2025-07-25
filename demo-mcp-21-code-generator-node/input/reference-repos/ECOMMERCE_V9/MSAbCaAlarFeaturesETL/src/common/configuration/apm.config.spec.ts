import * as config from '../configuration/apm.config'

describe('APM', () => {

    it('correct values apm', () => {
        expect(config.default.serviceName).toBeDefined();
    });

    it('correct values apm', () => {
        expect(config.default.environment).toBeDefined();
    });
});