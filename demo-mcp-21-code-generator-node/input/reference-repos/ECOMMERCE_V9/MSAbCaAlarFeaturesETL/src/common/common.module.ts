import { Global, Module } from '@nestjs/common';

/**
 * Obtiene la configuracion y construción principal del modulo común 
 * @author Santiago Vargas
 */
@Global()
@Module({
    providers: [],
    exports: [],
})
export class CommonModule { }
