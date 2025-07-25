import { ApiProperty } from '@nestjs/swagger';
import { ResponsereportDTO } from './response-report.dto';

export class ResponseAppoimentDTO<T = any> {
  @ApiProperty({
    description: 'External id',
  })
  public externalId: string | Date;

  @ApiProperty({
    description: 'Franja en la cual el tenico realizara la visita',
  })
  public timeSlot: string;

  @ApiProperty({
    description: 'Dia que se programo',
  })
  public date: string | Date;

  @ApiProperty({
    description: 'Numero de orden de trabajo',
  })
  public apptNumber: string;

  @ApiProperty({
    description: 'Numero del cliente claro ',
  })
  public customerNumber: string;

  @ApiProperty({
    description: 'Nombres y Apellidos del cliente',
  })
  public fullName: string;

  @ApiProperty({
    description: 'Identificador interno de OFSC',
  })
  public aid: string;

  @ApiProperty({
    description: 'Object report',
  })
  public report: object;

  constructor(externalId: string, timeSlot: string, date: string, apptNumber: string, customerNumber: string, fullName: string, aid: string) {
    this.externalId = externalId;
    this.timeSlot = timeSlot;
    this.date = date;
    this.apptNumber = apptNumber;
    this.customerNumber = customerNumber;
    this.fullName = fullName;
    this.aid = aid;
    this.report = ResponsereportDTO;
  }
}
