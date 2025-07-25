import { EmessageMapping } from '../utils/enums/message.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionManager } from './exceptions-manager.filter';
import { ResponseService } from '../../controller/dto/response-service.dto';
import { HttpStatus } from '@nestjs/common';


describe('ExceptionManager Class', () => {
    it('should compile the module', async () => {
        let module: TestingModule;
        module = await Test.createTestingModule({
            providers: [ExceptionManager],
        }).compile();

        const result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        expect(result).toBeDefined();
        expect(result.status).toBe(500);
        expect(result.message).toContain(EmessageMapping.DEFAULT_ERROR)
    });
});