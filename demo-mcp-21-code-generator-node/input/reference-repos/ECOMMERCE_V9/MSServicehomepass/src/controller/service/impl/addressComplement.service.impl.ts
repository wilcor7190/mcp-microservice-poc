/**
 * Clase que se implementa para realizar las respectivas operaciones de complementos de direcciones
 * @Author Sebastian Traslaviña
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import { EmessageMapping } from '../../../common/utils/enums/message.enum';
import { GeographicAdDto } from '../../../controller/dto/geographicAddres/geographicAddress.dto';
import { IAddressComplementUc } from '../../../core/use-case/procedures/addressComplment.uc';
import { IAddressComplement } from '../address-complement.service';
import Logging from '../../../common/lib/logging';
import { ETaskDesc, Etask } from '../../../common/utils/enums/task.enum';
import { ILvlFuncionalitiesUc } from '../../../core/use-case/resource/lvl-funcionalities.resource.uc';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';
import { IPoComplemento } from 'src/core/entity/address-complement/po-complementos.entity';
import { IGeographicAddressList } from 'src/core/entity/address-complement/geographic-address-list.entity';
import { ResponseDB } from 'src/core/entity/response-db.entity';

@Injectable()
export class AddressComplement implements IAddressComplement {
  private readonly logger = new Logging(AddressComplement.name);

  constructor(
    public readonly _validateChannel: IGlobalValidateService,
    public readonly _addressComplement: IAddressComplementUc,
    public readonly _lvlFuncionalities: ILvlFuncionalitiesUc,
  ) {}

  /**
   * Metodo utilizado para consultar posibles complementos de direcciones
   * @param {String} channel canal ingresado por el usuario en el header
   * @param {GeographicAdDto} geographicDto informacion relacionada a la direccion ingresada por el cliente
   * @returns {ResponseService} retorna direccion del cliente estandarizada
   */
  async consultAddressComplement(channel: string, geographicDto: GeographicAdDto): Promise<ResponseService<any>> {
    this.logger.write('Inicio consultAddressComplement()', Etask.CONSULT_ADDRESS, ELevelsErrors.INFO, geographicDto);
    try {
      let addressComplments: ResponseDB<IPoComplemento>;
      let poComplement: IPoComplemento;
      this._validateChannel.validateChannel(channel);
      addressComplments = await this._addressComplement.requestAddressComplement(geographicDto);
      if (addressComplments.po_data.length === 1) poComplement = addressComplments.po_data[0];

      let response: IGeographicAddressList = {
        geographicAddress: [
          {
            alternateGeographicAddress: this._lvlFuncionalities.mapAlternateGeographicAddress(addressComplments.po_data),
            complements: this._lvlFuncionalities.mapComplements(addressComplments.po_data),
            plateTypelt: GeneralUtil.repleceWhenUndefined(poComplement?.PO_IT_TIPO_PLACA, ''),
            plateValueIt: GeneralUtil.repleceWhenUndefined(poComplement?.PO_IT_TIPO_VALOR_PLACA, ''),
            detailId: GeneralUtil.repleceWhenUndefined(poComplement?.PO_DIRECCION_DETALLADA_ID, ''),
            textAddress: GeneralUtil.repleceWhenUndefined(poComplement?.PO_DIRECCION_TEXTO, ''),
            subId: GeneralUtil.repleceWhenUndefined(poComplement?.PO_SUB_DIRECCION_ID, ''),
            strata: GeneralUtil.repleceWhenUndefined(poComplement?.PO_ESTRATO, ''),
            streetAlt: GeneralUtil.repleceWhenUndefined(poComplement?.PO_DIRPRINCALT, ''),
            neighborhood: GeneralUtil.repleceWhenUndefined(poComplement?.PO_BARRIO, ''),
            streetType: GeneralUtil.repleceWhenUndefined(poComplement?.PO_TIPOVIAPRINCIPAL, ''),
            streetNr: GeneralUtil.repleceWhenUndefined(poComplement?.PO_NUMVIAPRINCIPAL, ''),
            streetLt: GeneralUtil.repleceWhenUndefined(poComplement?.PO_LTVIAPRINCIPAL, ''),
            way2Word: GeneralUtil.repleceWhenUndefined(poComplement?.PO_NLPOSTVIAP, ''),
            streetBis: GeneralUtil.repleceWhenUndefined(poComplement?.PO_BISVIAPRINCIPAL, ''),
            streetBlock: GeneralUtil.repleceWhenUndefined(poComplement?.PO_CUADVIAPRINCIPAL, ''),
            addressPlate: GeneralUtil.repleceWhenUndefined(poComplement?.PO_PLACA_DIR, ''),
            indications: GeneralUtil.repleceWhenUndefined(poComplement?.PO_INDICACIONES, ''),
            geoState: GeneralUtil.repleceWhenUndefined(poComplement?.PO_ESTADO_DIR_GEO, ''),
            word3G: GeneralUtil.repleceWhenUndefined(poComplement?.PO_LETRA3G, ''),
            addressType: GeneralUtil.repleceWhenUndefined(poComplement?.PO_TIPO_DIR, ''),
            geographicSubAddress: {
              streetType: GeneralUtil.repleceWhenUndefined(poComplement?.PO_TIPOVIAGENERADORA, ''),
              streetNr: GeneralUtil.repleceWhenUndefined(poComplement?.PO_NUMVIAGENERADORA, ''),
              streetLt: GeneralUtil.repleceWhenUndefined(poComplement?.PO_LTVIAGENERADORA, ''),
              way2Word: GeneralUtil.repleceWhenUndefined(poComplement?.PO_NLPOSTVIAG, ''),
              streetBis: GeneralUtil.repleceWhenUndefined(poComplement?.PO_BISVIAGENERADORA, ''),
              streetBlock: GeneralUtil.repleceWhenUndefined(poComplement?.PO_CUADVIAGENERADORA, ''),
            },
          },
        ],
      };
      return new ResponseService(true, EmessageMapping.DEFAULT, HttpStatus.OK, [{ geographicAddressList: response }]);
    } catch (err) {
      GeneralUtil.assignTaskError(err, Etask.CONSULT_ADDRESS, ETaskDesc.CONSULT_ADDRESS);
      throw err;
    }
  }
}
