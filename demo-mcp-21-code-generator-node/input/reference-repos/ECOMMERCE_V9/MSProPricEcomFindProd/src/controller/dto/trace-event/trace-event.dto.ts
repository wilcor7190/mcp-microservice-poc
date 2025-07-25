import { ApiProperty } from '@nestjs/swagger';
import { ETraceStatus } from 'src/common/utils/enums/tracing.enum';

export class TraceEvent {
  @ApiProperty({
    description: 'Identificador único del evento.'
  })
  public eventId: string;

  @ApiProperty({
    description: 'Fecha y hora del evento.'
  })
  public eventTime: Date;

  @ApiProperty({
    description: 'Tipo de evento ().'
  })
  public eventType: string;

  @ApiProperty({
    description: 'Objeto con la información del evento.'
  })
  public event: EventDetail;

  constructor() {}
}

export class EventDetail {
  @ApiProperty({
    description: 'Identificación del http request que genera la trazabilidad.'
  })
  public transactionId: string;

  @ApiProperty({
    description: 'Estado de la transacción (INFO, SUCCESSFUL, FAILED)'
  })
  public traceabilityStatus: ETraceStatus;

  @ApiProperty({
    description: 'Tarea que se esta ejecutando al almacenar la traza.'
  })
  public task: string;

  @ApiProperty({
    description: 'Descripción de la tarea de la transacción.'
  })
  public description: string;

  @ApiProperty({
    description: 'PATH de la ejecución.'
  })
  public origen: string;

  @ApiProperty({
    description: 'Objeto que recibe el request de la petición.'
  })
  public request: any;

  @ApiProperty({
    description: 'Objeto que recibe el response de la petición.'
  })
  public response: any;

  @ApiProperty({
    description: 'Objeto que recibe información adicional.'
  })
  public additional?: any;

  @ApiProperty({
    description: 'Tiempo de respuesta de la petición (milisegundos).'
  })
  public processingTime?: number;

  @ApiProperty({
    description: 'Nombre de la colección destino de la base de datos de trazabilidad.'
  })
  public collectionName: string;
}
