/**
 * Obtiene la configuracion y construción principal del modulo común 
 * @author alexisterzer
 */

import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [],
    exports: [],
})
export class CommonModule { }
