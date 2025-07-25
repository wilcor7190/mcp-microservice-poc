import { ApiProperty } from '@nestjs/swagger';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { MessageService } from '../service/impl/message.service.impl';

/**
 * Clase base para el manejo de respuesta de todos los metodos que se exponen por el controlador
 */
export class ResponseService<T = any> {

    @ApiProperty({
        description: 'Indicador de éxito o fallo del consumo del MS'
    })
    public success: boolean;
    
    @ApiProperty({
        description: 'Código HTTP con el que se da respuesta'
    })
    public status: number;

    @ApiProperty({
        description: 'Objeto en el cual se retorna información asociada al proceso ejecutado.',
        nullable: true
    })
    public reason?: T;

    @ApiProperty({
        description: 'PATH con el cual se invoca el miscroservicio'
    })
    public referenceError?: string;

    @ApiProperty({
        description: 'Mensaje enviado'
    })
    public message: string;

    @ApiProperty({
        description: 'Identificador único de trasacción'
    })
    public readonly process?: string;

    @ApiProperty({
        description: 'Tiempo de respuesta'
    })
    public responseTime?: number;

    @ApiProperty({
        description: 'Fecha y hora en la que se hace el request'
    })
    public requestTime?: Date | string;


    @ApiProperty({
        description: 'Valid for'
    })
    public validFor?: T;

    @ApiProperty({
        description: 'Metodo HTTP a través del cual se hace el llamado'
    })
    public method?: string;
    
    @ApiProperty({
        description: 'Código de error'
    })
    public code?: string;
    

    constructor(
        success: boolean = true,
        message: EmessageMapping | string = EmessageMapping.DEFAULT,
        status: number = 200,
        reason?: T,
        validFor?:T,
        code?:  string
    ) {
       // this.process = utils.getCorrelationalId;
       // this.success = success;
        this.status = status;
        //this.requestTime= new Date(),
        this.reason = reason
        this.validFor=validFor;
        this.message = MessageService.mappingMessage(EmessageMapping[message]) || message;
        this.code = code;

    }


}