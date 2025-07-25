export interface IParam {
	id_param: string;
	description: string;
	status?: boolean;
	createdUser: string;
	updatedUser: string;
	createdAt: string;
	updatedAt: string;
	values: IListNamesByFamily[];
}
export interface IListNamesByFamily {
	status: boolean;
	listNames: IListNames[];
	family: string;
}
export interface IListNames {
	name: string;
	id: string;
	priceBefore: boolean;
	popType: string;
	status: boolean;
}