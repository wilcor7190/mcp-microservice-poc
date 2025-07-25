import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class CusRequestHomePassModel extends Document {
  @Prop()
  user: string;

  @Prop()
  sourceAplication: string;

  @Prop()
  message: string;

  @Prop()
  destinationAplication: string;

  @Prop()
  daneCode: string;

  @Prop()
  idCaseTcrm: string;

  @Prop()
  idRequest: string;

  @Prop()
  cmtRequestCrearSolicitud: any[];

  @Prop()
  idAddress: string;

  @Prop()
  address: any[];

  @Prop()
  request_state: string;

  @Prop()
  response: any[];

  @Prop()
  stateHHPP: string;

  @Prop()
  stateTransaction: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;

  @Prop()
  isMigratedUser: boolean;
}

export const CusRequestHomePassSchema = SchemaFactory.createForClass(CusRequestHomePassModel);
