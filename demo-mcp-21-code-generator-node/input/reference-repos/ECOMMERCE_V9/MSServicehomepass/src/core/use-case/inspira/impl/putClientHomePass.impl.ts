/**
 * Clase que se implementa para orquestar las operaciones que es posible realizar por medio del servicio
 * @author Juan David Marin
 */

import { Injectable } from '@nestjs/common';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import generalConfig from '../../../../common/configuration/general.config';
import { IPutClientHomePass } from '../putClientHomePass';
import { ICusRequestHomePassProvider } from '../../../../data-provider/cusRequestHomePass.provider';
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';
import { Echannel, EstateTransaction } from '../../../../common/utils/enums/params.enum';
import { CLienthomepassDto } from '../../../../controller/dto/clienthomepass/clienthomepass.dto';
import Logging from '../../../../common/lib/logging';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/task.enum';
import GeneralUtil from 'src/common/utils/generalUtil';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class PutClientHomePassimpl implements IPutClientHomePass {
  private readonly logger = new Logging(PutClientHomePassimpl.name);
  constructor(
    public readonly _mappingLegados: IMappingLegadosUc,
    public readonly _cusRequestHomePassProvider: ICusRequestHomePassProvider,
  ) {}

  /**
   * Metodo que se utiliza para solicitar la informacion de cobertura de red de la dirección de un cliente directo a BD
   * @param {CLienthomepassDto} cLienthomepassDto
   * @returns una promesa
   */
  async putClientHomePass(clienthomepass: CLienthomepassDto) {
    this.logger.write('putClientHomePass()', Etask.CONSULT_PUT_CLIENT_HOMEPASS, ELevelsErrors.INFO, clienthomepass);
    try {
      const dataUpdateCmtRequestCrearSolicitud = {
        updateAt: new Date(),
        cmtRequestCrearSolicitud: [clienthomepass],
      };
      const updateDb = await this._cusRequestHomePassProvider.updateCusRequestHomePass(
        { idCaseTcrm: clienthomepass.customer.customerInfo.mediumCharacteristic.idCaseTcrm },
        dataUpdateCmtRequestCrearSolicitud,
      );
      if (!updateDb) return { Response: EmessageMapping.NO_DATA_FOUND, idCaseTcrm: clienthomepass.customer.customerInfo.mediumCharacteristic.idCaseTcrm };
      let bodyCrearSolicitudInspira = {
        headerRequest: {
          requestDate: clienthomepass.customer.requestDate,
        },
        user: clienthomepass.customer.user,
        cmtRequestCrearSolicitudInspira: {
          observaciones: 'prueba crear solicitud diferente de DTH',
          contacto: clienthomepass.customer.customerInfo.firstname + clienthomepass.customer.customerInfo.lastname,
          telefonoContacto: clienthomepass.customer.customerInfo.mediumCharacteristic.phoneNumber,
          canalVentas: Echannel.EC9_B2C,
          drDireccion: {
            barrio: updateDb.address[0].geographicAddressList.geographicAddress[0].neighborhood,
            barrioTxtBM: updateDb.address[0].geographicAddressList.geographicAddress[0].neighborhood,
            bisViaGeneradora: updateDb.address[0].geographicAddressList.geographicAddress[0].streetBisGenerator,
            bisViaPrincipal: updateDb.address[0].geographicAddressList.geographicAddress[0].streetBis,
            cpTipoNivel1: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel1Type,
            cpTipoNivel2: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel2Type,
            cpTipoNivel3: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel3Type,
            cpTipoNivel4: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel4Type,
            cpTipoNivel5: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel5Type,
            cpTipoNivel6: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel6Type,
            cpValorNivel1: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel1Value,
            cpValorNivel2: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel2Value,
            cpValorNivel3: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel3Value,
            cpValorNivel4: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel4Value,
            cpValorNivel5: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel5Value,
            cpValorNivel6: updateDb.address[0].geographicAddressList.geographicAddress[0].complements.nivel6Value,
            cuadViaGeneradora: updateDb.address[0].geographicAddressList.geographicAddress[0].streetBlockGenerator,
            cuadViaPrincipal: updateDb.address[0].geographicAddressList.geographicAddress[0].streetBlock,
            dirEstado: updateDb.stateHHPP,
            dirPrincAlt: updateDb.address[0].geographicAddressList.geographicAddress[0].streetAlt,
            estadoDirGeo: updateDb.address[0].geographicAddressList.geographicAddress[0].geoState,
            estadoRegistro: 0,
            estrato: clienthomepass.customer.customerInfo.orderRefList.map((x) =>
              x.orderRef.subOrderRefList.map((y) => y.subOrderRef.shippingRef.strata),
            )[0][0],
            fechaCreacion: '',
            fechaEdicion: '',
            id: updateDb.idAddress,
            idDirCatastro: updateDb.address[0].geographicAddressList.geographicAddress[0].cadastreId,
            idSolicitud: '',
            idTipoDireccion: updateDb.address[0].geographicAddressList.geographicAddress[0].type,
            itTipoPlaca: updateDb.address[0].geographicAddressList.geographicAddress[0].plateTypeLt,
            itValorPlaca: updateDb.address[0].geographicAddressList.geographicAddress[0].plateValueLt,
            letra3G: updateDb.address[0].geographicAddressList.geographicAddress[0]['3GWord'],
            ltViaGeneradora: updateDb.address[0].geographicAddressList.geographicAddress[0].streetLtGenerator,
            ltViaPrincipal: updateDb.address[0].geographicAddressList.geographicAddress[0].streetLt,
            mzTipoNivel1: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel1Type,
            mzTipoNivel2: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel2Type,
            mzTipoNivel3: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel3Type,
            mzTipoNivel4: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel4Type,
            mzTipoNivel5: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel5Type,
            mzTipoNivel6: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel6Type,
            mzValorNivel1: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel1Value,
            mzValorNivel2: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel2Value,
            mzValorNivel3: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel3Value,
            mzValorNivel4: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel4Value,
            mzValorNivel5: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel5Value,
            mzValorNivel6: updateDb.address[0].geographicAddressList.geographicAddress[0].alternateGeographicAddress.nivel6Value,
            nlPostViaG: updateDb.address[0].geographicAddressList.geographicAddress[0].streetNlPostViaG,
            nlPostViaP: updateDb.address[0].geographicAddressList.geographicAddress[0].streetNlPostViaP,
            numViaGeneradora: updateDb.address[0].geographicAddressList.geographicAddress[0].streetNrGenerator,
            numViaPrincipal: updateDb.address[0].geographicAddressList.geographicAddress[0].streetNr,
            perfilCreacion: '',
            perfilEdicion: '',
            placaDireccion: updateDb.address[0].geographicAddressList.geographicAddress[0].plate,
            tipoViaGeneradora: updateDb.address[0].geographicAddressList.geographicAddress[0].streetTypeGenerator,
            tipoViaPrincipal: updateDb.address[0].geographicAddressList.geographicAddress[0].streetType,
            usuarioCreacion: '',
            usuarioEdicion: '',
          },
          cmtCityEntityDto: {
            estratoDir: clienthomepass.customer.customerInfo.orderRefList.map((x) =>
              x.orderRef.subOrderRefList.map((y) => y.subOrderRef.shippingRef.strata),
            )[0][0],
            estadoDir: updateDb.stateHHPP,
          },
        },
        tipoTecnologia: clienthomepass.customer.customerInfo.orderRefList.map((x) =>
          x.orderRef.subOrderRefList.map((y) => y.subOrderRef.shippingRef.technology),
        )[0][0],
        codigoDane: clienthomepass.customer.customerInfo.orderRefList.map((x) =>
          x.orderRef.subOrderRefList.map((y) => y.subOrderRef.shippingRef.daneCodeCity),
        )[0][0],
        idCasoTcrm: clienthomepass.customer.customerInfo.mediumCharacteristic.idCaseTcrm,
      };

      this.logger.write('Request crearSolicitudInspira', Etask.CONSULTANDO_ADDRESS_CREARSOLICITUDINSPIRA, ELevelsErrors.INFO, bodyCrearSolicitudInspira);
      const consultAddress = await this._mappingLegados.consumerLegadoRest(bodyCrearSolicitudInspira, generalConfig.apiAddressCrearSolicitudInspira);

      if (!consultAddress.executed) {
        return { ...consultAddress, Response: EmessageMapping.LEGADO_ERROR };
      } else {
        //pendite modificar cuando retorne exitoso
        if (consultAddress.message === 'OK') {
          if (parseInt(consultAddress.data.idSolicitud) < 1 || consultAddress.data.idSolicitud === undefined)
            return { ...consultAddress.data, Response: EmessageMapping.LEGADO_ERROR };
          const updateStateTransaction = {
            updateAt: new Date(),
            response: [consultAddress.data],
            stateTransaction: EstateTransaction.PENDIENTE,
          };
          const updateDbafterRequestLegado = await this._cusRequestHomePassProvider.updateCusRequestHomePass(
            { idCaseTcrm: clienthomepass.customer.customerInfo.mediumCharacteristic.idCaseTcrm },
            updateStateTransaction,
          );
          if (!updateDbafterRequestLegado)
            return { Response: EmessageMapping.NO_DATA_FOUND, idCaseTcrm: clienthomepass.customer.customerInfo.mediumCharacteristic.idCaseTcrm };
          return { ...consultAddress, Response: EmessageMapping.DEFAULT };
        }
        return { ...consultAddress.data, Response: EmessageMapping.LEGADO_ERROR, consultAddress };
      }
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.CONSULT_PUT_CLIENT_HOMEPASS, ETaskDesc.CONSULT_PUT_CLIENT_HOMEPASS);
      throw error;
    }
  }
}
