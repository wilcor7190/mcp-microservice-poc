import Client = require('ssh2-sftp-client');
import generalConfig from '../configuration/general.config';
import Logging from 'src/common/lib/logging';
import { ELevelsErros } from './enums/logging.enum';
import { Etask } from './enums/taks.enum';


export default class SftpConnector {
  private readonly logger = new Logging(SftpConnector.name);

  private static instance: SftpConnector;
  private sftp: Client;

  private constructor() {
    this.sftp = new Client();
  }

  public static async getInstance(): Promise<SftpConnector> {
    if (!SftpConnector.instance) {
      SftpConnector.instance = new SftpConnector();
      await SftpConnector.instance.connect();
    }
    return SftpConnector.instance;
  }

  private async connect(): Promise<void> {
    try {
      await this.sftp.connect({
        host: generalConfig.sftpModuleHost,
        port: Number(generalConfig.sftpModulePort),
        username: generalConfig.sftpModuleUsername,
        password: generalConfig.sftpModulePassword,
      });
      this.logger.write('Connected to SFTP server', Etask.CONEXION_SFTP, ELevelsErros.INFO);
    } catch (error) {
      this.logger.write('Error connecting to SFTP server:' + error, Etask.CONEXION_SFTP, ELevelsErros.ERROR);
      throw error;
    }
  }

  public async exists(remotePath: string): Promise<boolean> {
    try {
      await this.sftp.stat(remotePath);
      return true;
    } catch (error) {
      if (error.code === 2) {
        // Error code 2 means file does not exist
        return false;
      } else {
        throw error;
      }
    }
  }

  public async list(remotePath: string): Promise<any> {
    try {
      return await this.sftp.list(remotePath);
    } catch (error) {
      this.logger.write('Error listing files:' + error, Etask.CONEXION_SFTP, ELevelsErros.ERROR);
      throw error;
    }
  }

  public async stat(remotePath: string): Promise<any> {
    try {
      return await this.sftp.stat(remotePath);
    } catch (error) {
      this.logger.write('Error getting file info:' + error, Etask.CONEXION_SFTP, ELevelsErros.ERROR);
      throw error;
    }
  }

  public async fastGet(
    remoteFilePath: string,
    localFilePath: string,
    options?: any,
  ): Promise<void> {
    try {
      await this.sftp.fastGet(remoteFilePath, localFilePath, options);
    } catch (error) {
      this.logger.write('Error downloading file:' + error, Etask.CONEXION_SFTP, ELevelsErros.ERROR);
      throw error;
    }
  }
}
