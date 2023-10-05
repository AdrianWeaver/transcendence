export interface UserModel
{
	uuid: string;
	password: string;
	token: string;
	lastConnection: number | "never connected";
	userCreatedAt: string;
	revokeConnectionRequest: boolean;
}

export interface AdminResponseModel
{
	numberOfClient: number;
	array : Array<UserModel>
}

export interface UserRegisterResponseModel
{
	message: string;
	uuid: string;
	password: string;
	creationDate: string;
	statusCode: number;
}
