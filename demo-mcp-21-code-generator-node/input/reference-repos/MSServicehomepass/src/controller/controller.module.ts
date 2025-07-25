/**
 * Obtiene la configuracion y construción principal de los controladores
 * @author  JAVIER ALEXANDER HERNANDEZ LEON
 */
import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { TerminusModule } from '@nestjs/terminus';
import { IGlobalValidateService } from './service/resources/globalValidate.service';
import { GlobalValidateService } from './service/resources/impl/globalValidate.service.impl';
import { IDetailAddress } from './service/detailAddress.service';
import { DetailAddress } from './service/impl/detail-address.service.impl';
import { DetailAddressController } from './detailAddress.controller';
import { NeighborhoodbydaneController } from './neighborhoodbydane.controller';
import { INeighborhoodbydane } from './service/neighborhoodbydane.service';
import { Neighborhoodbydane } from './service/impl/neighborhoodbydane.service.impl';
import { IAddressComplement } from './service/address-complement.service';
import { AddressComplementController } from './addressComplement.controller';
import { StructuresController } from './structures.controller';
import { IStructuresService } from './service/structure.service';
import { Structures } from './service/impl/structures.service.impl';
import { PutClientHomepassController } from './putClientHomepass.controller';
import { IPutClientHomepass } from './service/putClientHomepass.service';
import { HomepassController } from './homepass.controller';
import { IHomePassService } from './service/homepass.service';
import { HomePass } from './service/impl/homepass.service.impl';
import { JobController } from './job.controller';
import { IJobService } from './service/get-state-homepass.service';
import { JobService } from './service/impl/get-state-homepass.service.impl';
import { TasksService } from './jobs/get-state-homepass.job';
import { AddressComplement } from './service/impl/addressComplement.service.impl';
import { PutClientHomepass } from './service/impl/putClientHomepass.service.impl';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    DetailAddressController,
    NeighborhoodbydaneController,
    AddressComplementController,
    StructuresController,
    PutClientHomepassController,
    HomepassController,
    JobController,
  ],
  providers: [
    TasksService,
    { provide: IDetailAddress, useClass: DetailAddress },
    { provide: IGlobalValidateService, useClass: GlobalValidateService },
    { provide: INeighborhoodbydane, useClass: Neighborhoodbydane },
    { provide: IAddressComplement, useClass: AddressComplement },
    { provide: IStructuresService, useClass: Structures },
    { provide: IPutClientHomepass, useClass: PutClientHomepass },
    { provide: IHomePassService, useClass: HomePass },
    { provide: IJobService, useClass: JobService },
  ],
})
export class ControllerModule {}
