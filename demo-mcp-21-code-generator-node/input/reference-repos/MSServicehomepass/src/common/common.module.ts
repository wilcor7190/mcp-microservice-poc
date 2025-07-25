/**
 * Obtiene la configuracion y construción principal del modulo común
 * @author Fredy Santiago Martinez
 */
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class CommonModule {}
