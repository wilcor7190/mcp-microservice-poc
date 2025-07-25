export interface ICapacity {
  isMigratedUser: boolean;
  transactionId: string;
  system: string;
  user: string;
  password: string;
  requestDate: string;
  ipApplication: string;
  orderId: string;
  documentId: string;
  addressId: string;
  apptNumber: string;
  dateList: DateList;
  locationList: LocationList;
}

export interface DateList {
  date: [value: string];
}

export interface LocationList {
  location: [id: string];
}

export interface ActivityList {
  field: [attributeName: string, attributeValue: string];
}
