/**
 * @author Damian Duarte
 */

export interface ResponseDB<T> {
  po_codigo: number;
  po_descripcion: string;
  po_data: T[];
}
