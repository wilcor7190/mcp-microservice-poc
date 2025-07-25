/**c
 * Clase para resolver el path
 * @author Jose Daniel Orellana
 */

const path = require("path");
const FS = require("fs");

export default class UtilConfig {

    public static getCsv = name => {
        return path.resolve(`${__dirname}/${name}.csv`);
        
    };
    
    public static getJson = name => {
        return path.resolve(`${__dirname}/${name}.json`);
        
    };
}