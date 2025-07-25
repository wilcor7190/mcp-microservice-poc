import { EmessageMapping } from "../utils/enums/message.enum";
import { Etask } from "../utils/enums/taks.enum";

/**
 * Clases para el manejo de excepciones
 * @author Marlyn Tatiana Quiroz
 */
export class BusinessException {

  constructor(
    public readonly code: number,
    public readonly description: string,
    public readonly details?: IoptionalDetails,
    public readonly referenceError?: string
  ) { }

}

export class ErrorLegacyException {

  constructor(
    public readonly status: number,
    public readonly description: string,
    public readonly reason?: string,
    public readonly referenceError?: string,
    public readonly code?: string, 
    public readonly response?: any,
  ) { }

}

export interface IoptionalDetails {
  readonly codMessage?: EmessageMapping;
  readonly context?: string;
  readonly task?: Etask;
  readonly document?: any;
}

export class SuccessfulBusinessException {

  constructor(
    public readonly Email: string,
    public readonly id: string,
    public readonly type: string,
    public readonly codMessage: EmessageMapping
  ) { }

}

export class LegacyException {

  constructor(
    public readonly code: string,
    public readonly reason: string,
    public readonly codMessage: EmessageMapping,
    public readonly response: any
  ) { }

}

export class InternalServerException {

  constructor(
    public readonly status: number,
    public readonly description: string,
    public readonly details?: IoptionalDetails,
    public readonly referenceError?: string
  ) { }

}