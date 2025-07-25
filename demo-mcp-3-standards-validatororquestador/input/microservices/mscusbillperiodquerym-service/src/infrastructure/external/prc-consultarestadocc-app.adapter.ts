import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface PrcConsultarestadoccAppRequest {
  Input : any;
}

export interface PrcConsultarestadoccAppResponse {
  output: any;
}

@Injectable()
export class PrcConsultarestadoccAppAdapter {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('NODE_ENV') === 'production' 
      ? 'undefined' 
      : 'BSCSQA = (DESCRIPTION = (ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 132.147.170.98)(PORT = 1750)))(CONNECT_DATA = (SERVICE_NAME = BSCSQA)))';
  }

  async callPrcConsultarestadoccApp(
    request: PrcConsultarestadoccAppRequest
  ): Promise<PrcConsultarestadoccAppResponse> {
    try {
      console.log(`Calling prc_consultarestadocc_app with request:`, request);

      const response = await firstValueFrom(
        this.httpService.post<PrcConsultarestadoccAppResponse>(
          `${this.baseUrl}/prc_consultarestadocc_app`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            timeout: 30000,
          }
        )
      );

      console.log(`prc_consultarestadocc_app response:`, response.data);
      return response.data;

    } catch (error: any) {
      console.error(`Error calling prc_consultarestadocc_app:`, error);
      
      if (error.response) {
        throw new HttpException(
          `prc_consultarestadocc_app service error: ${error.response.data?.message || error.message}`,
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          `prc_consultarestadocc_app service unavailable: ${error.message}`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }
  }
}