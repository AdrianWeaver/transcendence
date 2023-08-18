export interface AnonymousUserModel
{
	uuid: string;
	password: string;
	token: string;
	lastConnection: number | "never connected";
	userCreatedAt: string;
	revokeConnectionRequest: boolean;
	isRegistredAsRegularUser: boolean;
}

export interface AnonymousUserAdminDisplayableModel
{
	uuid: string;
	// password: string;
	token: string;
	lastConnection: number | "never connected";
	userCreatedAt: string;
	revokeConnectionRequest: boolean;
	isRegistredAsRegularUser: boolean;
}

export interface AnonymousAdminResponseModel
{
	numberOfClient: number;
	array : Array<AnonymousUserModel>
}

export interface CustomRequest extends Request
{
	user: AnonymousUserModel
}

export interface AnonymousUserRegisterResponseModel
{
	message: string;
	uuid: string;
	password: string;
	creationDate: string;
	statusCode: number;
}

export interface AnonymousUserLoginResponseModel
{
	message: string;
	token: string;
	exprireAt: number;
}

export interface AnonymousUserVerifyTokenResModel
{
	message: string;
	statusCode: number;
}

export interface AnonymousJWTDecoded
{
	uuid?: string;
	isAnonymous?: boolean;
	iat?: number;
	exp?: number;
}

export interface AuthorizationGuardSignatureModel
{
	validTokenSignature: boolean;
	uuid?: string;
	isAnonymous?: boolean;
	iat?: number;
	exp?: number;
	token?: string;
}
