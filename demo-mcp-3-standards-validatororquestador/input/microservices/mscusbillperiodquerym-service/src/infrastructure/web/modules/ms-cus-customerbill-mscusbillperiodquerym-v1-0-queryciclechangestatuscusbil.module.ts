import { Module } from '@nestjs/common';
import { MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilController } from '../controllers/ms-cus-customerbill-mscusbillperiodquerym-v1-0-queryciclechangestatuscusbil.controller';
import { MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilUseCase } from '../../../domain/use-cases/ms-cus-customerbill-mscusbillperiodquerym-v1-0-queryciclechangestatuscusbil.use-case';

@Module({
  controllers: [MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilController],
  providers: [MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilUseCase],
  exports: [MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilUseCase],
})
export class MsCusCustomerbillMscusbillperiodquerymV10QueryciclechangestatuscusbilModule {}