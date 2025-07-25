/**
 * Clase que se implementa para realizar las respectivas operaciones de estructuras de direcciones
 * @author Juan David Marin
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import GeneralUtil from '../../../common/utils/generalUtil';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { IStructuresService } from '../structure.service';
import { StructuresDTO } from '../../../controller/dto/structures/structures.dto';
import { IOrchStructuresUc } from '../../../core/use-case/procedures/structures.uc';
import { ILvlFuncionalitiesUc } from '../../../core/use-case/resource/lvl-funcionalities.resource.uc';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import Logging from 'src/common/lib/logging';

@Injectable()
export class Structures implements IStructuresService {
  private readonly logger = new Logging(Structures.name);
  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _structuresUc: IOrchStructuresUc,
    public readonly _lvlFuncionalities: ILvlFuncionalitiesUc,
  ) {}

  /**
   * Metodo que realiza la consulta del filtro de las estructuras, por los tipos de dirección enviada. para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel canal ingresado por el usuario en el header
   * @param {StructuresDTO} structuresDTO informacion de direccion
   * @returns una promesa
   */
  async consultStructures(structuresDTO: StructuresDTO, channel: string) {
    try {
      this._validateChannel.validateChannel(channel);
      let consultStructures = await this._structuresUc.initialFunction(structuresDTO);

      if (typeof consultStructures === 'object') {
        consultStructures = Object.values(consultStructures);
      }
      let array_geographicAddress = [];

      let conglomerateAlternate = this._lvlFuncionalities.segmentationByType(consultStructures, 'AlternateGeographicAddress');
      let conglomerateComp = this._lvlFuncionalities.segmentationByType(consultStructures, 'Complement');

      let v = consultStructures.length - 1;

      let mapping1 = this.map1(consultStructures, v, conglomerateAlternate, conglomerateComp);
      let mapping2 = this.map2(consultStructures, v);

      let geographicAddress = {
        id: mapping1.id,
        alternateGeographicAddress: mapping1.alternateGeographicAddress,
        complements: mapping1.complements,
        plateTypeIt: mapping1.plateTypeIt,
        plateValueIt: mapping2.plateValueIt,
        detailId: mapping2.detailId,
        strata: mapping2.strata,
        textAddress: mapping2.textAddress,
      };
      array_geographicAddress.push(geographicAddress);

      const response = {
        geographicAddressList: {
          geographicAddress: array_geographicAddress,
        },
      };
      return new ResponseService(true, EmessageMapping.DEFAULT, HttpStatus.OK, [response]);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_STRUCTURES, ETaskDesc.CONSULT_STRUCTURES);
      throw error;
    }
  }

  /**
   * Primer metodo utilizado para mapear la respuesta al usuario
   * @param {any} consultStructures informacion a mapear
   * @param {any} v informacion a mapear
   * @param {any} conglomerateAlternate informacion a mapear
   * @param {any} conglomerateComp informacion a mapear
   */
  map1(consultStructures: any, v: any, conglomerateAlternate: any, conglomerateComp: any) {
    return {
      id: consultStructures[v].PPO_DIRECCION_ID || '',
      alternateGeographicAddress: conglomerateAlternate ? conglomerateAlternate : '',
      complements: conglomerateComp ? conglomerateComp : '',
      plateTypeIt: consultStructures[v].PPO_IT_TIPO_PLACA || consultStructures[v][24] ? consultStructures[v].PPO_IT_TIPO_PLACA || consultStructures[v][24] : '',
    };
  }

  /**
   * Segundo metodo utilizado para mapear la respuesta al usuario
   * @param {any} consultStructures informacion a mapear
   * @param {any} v informacion a mapear
   */
  map2(consultStructures: any, v: any) {
    return {
      plateValueIt:
        consultStructures[v].PPO_IT_TIPO_VALOR_PLACA || consultStructures[v][25]
          ? consultStructures[v].PPO_IT_TIPO_VALOR_PLACA || consultStructures[v][25]
          : '',
      detailId:
        consultStructures[v].PPO_DIRECCION_DETALLADA_ID || consultStructures[v][26]
          ? consultStructures[v].PPO_DIRECCION_DETALLADA_ID || consultStructures[v][26]
          : '',
      strata: consultStructures[v].PPO_ESTRATO || consultStructures[v][27] ? consultStructures[v].PPO_ESTRATO || consultStructures[v][27] : '',
      textAddress:
        consultStructures[v].PPO_DIRECCION_TEXTO || consultStructures[v][28] ? consultStructures[v].PPO_DIRECCION_TEXTO || consultStructures[v][28] : '',
    };
  }
}
