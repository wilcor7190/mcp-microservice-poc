/**
 * Clase para construcción logica de negocio metodo creación dataload attachments-data
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import Traceability from '../../../../common/lib/traceability';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ECategoriesDataload } from '../../../../common/utils/enums/categories-dataload.enum';
import {
  USAGE_FULLIMAGE,
  USAGE_THUMBNAIL,
} from '../../../../common/utils/enums/dataload-const.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { IAttachmentsData } from '../../../../core/entity/catalog/attachments-data.entity';
import {
  ECategory,
  ICatalog,
} from '../../../../core/entity/catalog/catalog.entity';
import { IImagesAttachments } from '../../../../core/entity/catalog/images-attachments.entity';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IAttachmentsDataUC } from '../attachments-data.uc';

@Injectable()
export class AttachmentsDataUC implements IAttachmentsDataUC {
  constructor(
    private sftpProvider: ISftpProvider,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  private readonly logger = new Logging(AttachmentsDataUC.name);

  /**
   * Operación que consulta las imagenes y envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */
  async dataLoadConfiguration(data: ECategory, pathAttachmentsData: string, pathAttachmentsDataB2b: string) {
    try {
      let jsonData = [];

      this.logger.write(
        'dataLoadConfiguration() - AttachamentsDataUc',
        Etask.CREATE_ATTACHMENT_DATA,
      );

      for (const category of Object.values(ECategoriesDataload)) {
        this.logger.write(
          `dataLoadConfiguration() | ${category}`,
          Etask.CREATE_ATTACHMENT_DATA,
        );
        if (
          category == ECategoriesDataload.EQUIPMENT ||
          category == ECategoriesDataload.TECHNOLOGY
        ) {
          const IMAGES_FULLIMAGE = await this.sftpProvider.readFileImg(
            `${generalConfig.sftpReadFileImgPath}${generalConfig.sizeFullImage}`,
          );
          const IMAGES_THUMBNAIL = await this.sftpProvider.readFileImg(
            `${generalConfig.sftpReadFileImgPath}${generalConfig.sizeThumbnail}`,
          );

          if (
            (!IMAGES_FULLIMAGE || IMAGES_FULLIMAGE.length <= 0) &&
            (!IMAGES_THUMBNAIL || IMAGES_THUMBNAIL.length <= 0)
          ) {
            this.logger.write(
              `dataLoadConfiguration() | ${ETaskDesc.INVALID_IMAGES}`,
              Etask.GET_IMAGES,
            );

            let traceability = new Traceability({
              task: Etask.GET_IMAGES,
              description: ETaskDesc.INVALID_IMAGES,
            });
            traceability.setRequest(category);
            await this._serviceTracing.createServiceTracing(
              traceability.getTraceability(),
            );
          } else {
            let dataJson = await this.generateRows(
              data[category],
              IMAGES_FULLIMAGE,
              IMAGES_THUMBNAIL,
              category,
            );
            jsonData = jsonData.concat(dataJson);
          }
        } else {
          this.logger.write(
            'dataLoadConfiguration() - Sin imágenes para esta categoría',
            Etask.CREATE_ATTACHMENT_DATA,
          );
        }
      }

      const HEADERS = [
        { id: 'PartNumber', title: 'PartNumber' },
        { id: 'Sequence', title: 'Sequence' },
        { id: 'Usage', title: 'Usage' },
        { id: 'AssetPath', title: 'AssetPath' },
        { id: 'AssetUrl', title: 'AssetUrl' },
        { id: 'Name', title: 'Name' },
        { id: 'ShortDescription', title: 'ShortDescription' },
        { id: 'LongDescription', title: 'LongDescription' },
        { id: 'LanguageId', title: 'LanguageId' },
        { id: 'Delete', title: 'Delete' },
      ];

      const CSV_ROOT_FILE = find.getCsv(generalConfig.attachmentsData);
      await CreateCsv.createCsv(
        jsonData,
        CSV_ROOT_FILE,
        HEADERS,
        'CatalogEntryAsset',
        'attachment_data_0',
      );
      await CreateCsv.unificateFiles('attachment_data_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, pathAttachmentsData);
    } catch (error) {
      this.logger.write(
        `dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`,
        Etask.CREATE_ATTACHMENT_DATA,
      );

    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {IImagesAttachments[]} fullImages Imagenes obtenidas de la carpeta fullimage
   * @param {IImagesAttachments[]} thumbnailImages Imagenes obtenidas de la carpeta thumnail
   * @returns {IAttachmentsData[]} Arreglo con las filas para el archivo csv
   */
  private async generateRows(
    data: ICatalog[],
    fullImages: IImagesAttachments[],
    thumbnailImages: IImagesAttachments[],
    category: string,
  ): Promise<IAttachmentsData[]> {
    try {
      let rows: IAttachmentsData[] = [];

      let hash = {};
      const PRODUCTS = data.filter((product) => {
        let exists = !hash[product.partNumber];
        hash[product.partNumber] = true;
        return exists;
      });

      for (const product of PRODUCTS) {
        const FULL_IMAGE = await this.endPointImages(
          fullImages,
          product,
          USAGE_FULLIMAGE,
          generalConfig.sizeFullImage,
          category,
        );
        FULL_IMAGE.length > 0 && rows.push(...FULL_IMAGE);

        const THUMBNAIL = await this.endPointImages(
          thumbnailImages,
          product,
          USAGE_THUMBNAIL,
          generalConfig.sizeThumbnail,
          category,
        );
        THUMBNAIL.length > 0 && rows.push(...THUMBNAIL);
      }

      return rows;
    } catch (error) {
      this.logger.write(
        `generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`,
        Etask.CREATE_ATTACHMENT_DATA,
      );

    }
  }

  /**
   * Operación para crear el endpoint de las imagenes
   * @param {IImagesAttachments[]} images Imagenes obtenidas de la consulta
   * @param {ICatalog} product Producto para mapear
   * @param {String} usage Campo usage para el csv
   * @param {String} size Tamaño de la imagen para el mapeo
   * @returns {IAttachmentsData[]} Arreglo con las filas por producto
   */
  private async endPointImages(
    images: IImagesAttachments[],
    product: ICatalog,
    usage: string,
    size: string,
    category: string,
  ): Promise<IAttachmentsData[]> {
    try {
      let rows: IAttachmentsData[] = [];
      const REGEX = /(\d+)/g;
      const IMAGES: IImagesAttachments[] = images.filter((image) => {
        let imageName = image.name.split('_')[0].split('.')[0];
        return imageName == product.partNumber.match(REGEX)[0];
      });

      if (IMAGES.length > 0) {
        IMAGES.forEach((image) => {
          
          let nameProduct = '';

          switch (category) {
            case ECategoriesDataload.EQUIPMENT:
            case ECategoriesDataload.TECHNOLOGY:
              nameProduct = product.name;
              break;
          }

          let sku = image.name.split('.')[0];
          const lengthImageName = image.name.length;
          const shouldSequence = image.name.substring(lengthImageName - 6);

          let sequence = shouldSequence[1];

          if (!image.name.includes('_')) {
            sequence = '1';
          }

          rows.push({
            PartNumber: product.partNumber,
            Sequence:  sequence == "0" ? "10": sequence,
            Usage: usage,
            AssetPath: '',
            AssetUrl: `${generalConfig.endPointImage}${size}${sku}.${
              image.name.split('.')[1]
            }`,
            Name: nameProduct.replace(/_/g, " "),
            ShortDescription: nameProduct.replace(/_/g, " "),
            LongDescription: nameProduct.replace(/_/g, " "),
            LanguageId: generalConfig.languageId,
            Delete: '0',
          });
        });
      }

      rows.sort((a, b) => {
        return parseInt(a.Sequence, 10) - parseInt(b.Sequence, 10);
      });

      return rows;
    } catch (error) {
      this.logger.write(
        `endPointImages() | ${ETaskDesc.ERROR_GENERATE_ROWS}`,
        Etask.CREATE_ATTACHMENT_DATA,
      );

    }
  }

}
