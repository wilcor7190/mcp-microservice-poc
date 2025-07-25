/**
 * clase abstracta donde se define el FileManager
 * * @author Jose Daniel Orellana
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IFileManagerProvider {
    abstract deleteFile(csvRoot : string): Promise<any>;
    abstract getDataCsv(fileRoot: string, headers: string[], delimiter: string): Promise<any>;
    abstract getDataCsvHeader(fileRoot: string, delimiter: string): Promise<any>;
    abstract saveDataTemporalCollection(nameCollection: string, content: any): Promise<void>;
    abstract saveDataTemporalCollectionHomes(nameCollection: string, content: any): Promise<void>;
}