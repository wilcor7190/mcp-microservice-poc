/**
 * Clase con metodos utilizados para buscar archivos locales
 * @author Santiago Vargas
 */

const path = require("path");

export default class UtilConfig {

  /**
   * Consulta archivos csv locales 
   * @param {String} name Nombre del archivo
   * @returns {String} Archivo csv
   */
  public static getCsv = (name: string) => path.resolve(`${__dirname}/${name}.csv`);
}