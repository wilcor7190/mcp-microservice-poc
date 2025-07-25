import { EBilling, EtypeDocument } from '../../common/utils/enums/params.enum';

export interface IScheduleCapacity {
  isMigratedUser?: boolean;
  typeDocument: EtypeDocument;
  document: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalPhone?: string;
  expeditionDateDoc?: Date;
  expeditionCodeDaneDoc?: string;
  expeditionCityDoc?: string;
  eBilling: EBilling;
  scID?: string;
  quoteID?: string;
  transactionIdentity?: string;
}
