import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ETaskDesc } from '../../../common/utils/enums/taks.enum';

export class IDataloadDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn(
    [
      'Product-Data',
      'Attributes-Products',
      'Attributes-Dictionary',
      'Attachments-Data',
      'Product-Inventory',
      'Price-List'
    ],
    { message: ETaskDesc.INVALID_DATALOAD }
  )
  @ApiProperty({ description: 'Name of dataload' })
  dataload: string;
}
