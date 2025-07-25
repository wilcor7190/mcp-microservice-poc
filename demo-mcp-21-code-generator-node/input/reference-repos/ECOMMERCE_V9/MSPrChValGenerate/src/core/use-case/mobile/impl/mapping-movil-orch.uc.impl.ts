/**
 * clase que maneja el orquestrador de movil
 * @author Uriel Esguerra
 */

import { Injectable } from "@nestjs/common";
import Logging from "src/common/lib/logging";
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { IServiceErrorUc } from "../../resource/service-error.resource.uc";
import { IMappingMovilOrchUC } from "../mapping-movil-orch.uc";
import { ItransformMovilFeatures } from "../transform-movil-features.uc";
import { ItransformMovilPrices } from "../transform-movil-prices.uc";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';

@Injectable()
export class MappingMovilOrchUCImpl implements IMappingMovilOrchUC {

  constructor(
    private readonly tansformMovilFeatures: ItransformMovilFeatures,
    private readonly transformMovilPrices: ItransformMovilPrices,
    public readonly _serviceError: IServiceErrorUc) { }
    private readonly logger = new Logging(MappingMovilOrchUCImpl.name);

    /**
     * Metodo que transforma los datos originales para cargar las caracteristicas y precios
     * @param arrayPrice 
     * @param arrayFeatures 
     */

  async mappingMovilOrch(arrayPrice, arrayFeatures): Promise<any> {    
    this.logger.write('mappingMovilOrch() inicia proceso mapeo', Etask.START_PROCESS, ELevelsErros.INFO)
    try {
      await this.tansformMovilFeatures.transformOriginalData(arrayFeatures)
      await this.transformMovilPrices.transformOriginalData(arrayPrice);

    } catch (error) {
      utils.assignTaskError(error, Etask.DOWNLOAD_FILE, ETaskDesc.DOWNLOAD_FILE);
            throw error;
    }

  }
}