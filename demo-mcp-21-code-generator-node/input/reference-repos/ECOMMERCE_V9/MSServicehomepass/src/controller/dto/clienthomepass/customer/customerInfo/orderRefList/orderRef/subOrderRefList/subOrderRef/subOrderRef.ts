import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { EProcSales, ETypeDelivery, ETypePlan, ETypeProduct, ETypeSales } from '../../../../../../../../../common/utils/enums/params.enum';
import { AccountRefDto } from './accountRef/accountRef.dto';
import { PaymentMethodRefDto } from './paymentMethodRef/paymentMethodRef.dto';
import { ProductRefListDto } from './productRefList/productRefList.dto';
import { ShippingRefDto } from './shippingRef/ shippingRef.dto';

export class SubOrderRefDto {
  @Type(() => SubOrderRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Identificador suborden eCommerce' })
  id: string;

  @Type(() => SubOrderRefDto)
  @IsEnum(EProcSales)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Permite identificar el proceso de venta, posibles valores: TER: Terminales libres  KIT: KIT Prepago TEC: Tecnología HOG: Hogares',
  })
  salesProcess: EProcSales;

  @Type(() => SubOrderRefDto)
  @ApiProperty({ type: 'string', description: 'Identifica el tipo de producto (Default Claro) Claro: Producto Claro ClaroShop: Producto ClaroShop (Sellers)' })
  @IsNotEmpty()
  @IsEnum(ETypeProduct)
  productType: ETypeProduct;

  @Type(() => SubOrderRefDto)
  @IsEnum(ETypePlan)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Permite identificar el tipo de plan, posibles valores: POS: Postpago PRE: Prepago' })
  planType: ETypePlan;

  @Type(() => SubOrderRefDto)
  @IsEnum(ETypeSales)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Permite identificar el tipo de venta, posibles valores: ACT: Activación POR: Portabilidad REPO: Reposición' })
  salesType: ETypeSales;

  @Type(() => SubOrderRefDto)
  @IsEnum(ETypeDelivery)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Tipo de entrega, posibles valores: PV: Recoger en tienda D: Domicilio SIM: SIM Unificada ID: Instalación Domicilio',
  })
  deliveryType: ETypeDelivery;

  @Type((type) => PaymentMethodRefDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: PaymentMethodRefDto, description: 'ubicacion' })
  paymentMethodRef: PaymentMethodRefDto;

  @Type((type) => ShippingRefDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: ShippingRefDto, description: 'ubicacion' })
  shippingRef: ShippingRefDto;

  @Type((type) => AccountRefDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: AccountRefDto, description: 'ubicacion' })
  accountRef: AccountRefDto;

  @Type((type) => ProductRefListDto)
  @ValidateNested()
  @ApiProperty({ type: ProductRefListDto, description: 'ubicacion' })
  productRefList: ProductRefListDto;
}
