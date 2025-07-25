/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author Fredy Santiago Martinez
 */
import { AddressComplementimpl } from './use-case/procedures/impl/addressComplement.uc.impl';
import { CacheModule } from '@nestjs/cache-manager';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { DetailAdderessimpl } from './use-case/procedures/impl/detailAddress.uc.impl';
import { HomepassOperacion } from './use-case/operation/impl/homepassOperacion.impl';
import { HomePassRetryUcimpl } from './use-case/impl/homepass-retry.uc.impl';
import { HomePassUc } from './use-case/inspira/impl/homePass.uc.impl';
import { IAddressComplementUc } from './use-case/procedures/addressComplment.uc';
import { IDetailAddressUc } from './use-case/procedures/detailAddress.uc';
import { IHomepassOperacion } from './use-case/operation/homepassOperacion';
import { IHomePassRetryUc } from './use-case/homepass-retry.uc';
import { IHomePassUc } from './use-case/inspira/homePass.uc';
import { ILvlFuncionalitiesUc } from './use-case/resource/lvl-funcionalities.resource.uc';
import { IMappingLegadosUc } from './use-case/resource/mapping-legaos.resource.uc';
import { IMessageUc } from './use-case/message.uc';
import { INeighborhoodbydaneUc } from './use-case/procedures/neighborhoodbydane.uc';
import { IOrchHomepassUc } from './use-case/orchHomepass.uc';
import { IOrchPutClientHomePassUc } from './use-case/orchPutClienHomePass.uc';
import { IOrchStructuresUc } from './use-case/procedures/structures.uc';
import { IParamUc } from './use-case/resource/param.resource.uc';
import { IPutClientHomePass } from './use-case/inspira/putClientHomePass';
import { IPutClientHomePassOperacion } from './use-case/operation/PutClientHomePassOperacion';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { LvlFuncionalitiesUcimpl } from './use-case/resource/impl/lvl-funcionalities.resource.uc.impl';
import { MappingLegadosUcimpl } from './use-case/resource/impl/mapping-legaos.resource.uc.impl';
import { MessageUcimpl } from './use-case/impl/message.uc.impl';
import { Module } from '@nestjs/common';
import { NeighborhoodbydaneUcimpl } from './use-case/procedures/impl/neighborhoodbydane.uc.impl';
import { OrchHomePassUcimpl } from './use-case/impl/orchHomepass.uc.impl';
import { OrchPutClientHomePassUcimpl } from './use-case/impl/orchPutClientHomePass.uc.impl';
import { ParamUcimpl } from './use-case/resource/impl/param.resource.uc.impl';
import { PutClientHomePassimpl } from './use-case/inspira/impl/putClientHomePass.impl';
import { PutClientHomePassOperacionimpl } from './use-case/operation/impl/putClientHomePassOperacion.impl';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { StructuresUc } from './use-case/procedures/impl/structures.uc.impl';

@Module({
  imports: [DataProviderModule, CacheModule.register()],
  providers: [
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: IParamUc, useClass: ParamUcimpl },
    { provide: IOrchHomepassUc, useClass: OrchHomePassUcimpl },
    { provide: IHomePassUc, useClass: HomePassUc },
    { provide: IHomepassOperacion, useClass: HomepassOperacion },
    { provide: IMappingLegadosUc, useClass: MappingLegadosUcimpl },
    { provide: IOrchPutClientHomePassUc, useClass: OrchPutClientHomePassUcimpl },
    { provide: IPutClientHomePass, useClass: PutClientHomePassimpl },
    { provide: IPutClientHomePassOperacion, useClass: PutClientHomePassOperacionimpl },
    { provide: IDetailAddressUc, useClass: DetailAdderessimpl },
    { provide: IMappingLegadosUc, useClass: MappingLegadosUcimpl },
    { provide: IAddressComplementUc, useClass: AddressComplementimpl },
    { provide: ILvlFuncionalitiesUc, useClass: LvlFuncionalitiesUcimpl },
    { provide: IOrchStructuresUc, useClass: StructuresUc },
    { provide: INeighborhoodbydaneUc, useClass: NeighborhoodbydaneUcimpl },
    { provide: IHomePassRetryUc, useClass: HomePassRetryUcimpl },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    {
      provide: 'VerifyMessages',
      useFactory: async (messageUC: IMessageUc) => {
        await messageUC.loadMessages();
      },
      inject: [IMessageUc],
    },
    {
      provide: 'VerifyParams',
      useFactory: async (paramUC: IParamUc) => {
        await paramUC.loadParams();
      },
      inject: [IParamUc],
    },
  ],
  exports: [
    IMessageUc,
    IParamUc,
    IServiceErrorUc,
    IServiceTracingUc,
    IOrchPutClientHomePassUc,
    IDetailAddressUc,
    IOrchHomepassUc,
    IAddressComplementUc,
    ILvlFuncionalitiesUc,
    IOrchStructuresUc,
    INeighborhoodbydaneUc,
    IHomePassRetryUc,
  ],
})
export class CoreModule {}
