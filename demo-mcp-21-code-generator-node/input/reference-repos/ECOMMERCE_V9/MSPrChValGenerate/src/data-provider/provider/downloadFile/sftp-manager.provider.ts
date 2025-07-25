/**
 * clase abstracta donde se establece el Sftp manager
 * @author Gabriel Garzon
 */

import { Injectable } from "@nestjs/common";
import { IDownload } from "../../../core/entity/downloadsftp/download.entity";


@Injectable()
export abstract class ISftpManagerProvider {

    abstract download(paramsDownload : IDownload): Promise<void>;

    abstract downloadMovHom(remotePath: string, localPath: string, loadTime: Date, nameFile: string): Promise<boolean>;

    abstract writeFile(putPath: string, localPath: string,dateTimeNowCarac?:string): Promise<boolean>;
}