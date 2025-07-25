export interface ICusRequestHomePass {
  stateHHPP: string;
  idAddress: string;
  idRequest: string;
  address: Array<any>;
  user: string;
  sourceAplication?: string;
  destinationAplication?: string;
  daneCode: string;
  idCaseTcrm: string;
  message: string;
  cmtRequestCrearSolicitud?: Array<any>;
  response?: Array<any>;
  request_state?: string;
  proccess_result?: string;
  createdAt: Date;
  updateAt?: Date;
  isMigratedUser: boolean;
}
