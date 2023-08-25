
export interface	UserModel
{
	"isLoggedIn": boolean,
	"username": string,
	"bearerToken": string,
	"rememberMe": boolean
}

export interface	AnonymousUserModel
{
	"registrationStep": string,
	"uuid": string,
	"creationDate": string,
	"password": string,
	"message": string,
	"token": string,
	"expireAt": number
}

export interface	AnonymousUserRegisterResponseModel
{
	statusCode?: number,
	creationDate?: string,
	message?: string,
	password?: string,
	uuid?: string
}

export interface	AnonymousUserLoginResponseModel
{
	statusCode?: number,
	message?: string,
	token?: string,
	expireAt?: number,
}

export	interface	RegistrationProcessModel
{
	"startedRegister": boolean,
	"step": number,
	"codeOauthFT": string,
	"abortRequested": boolean,
	// line bellow is here to reproduce link behaviour
	// On Copyright signup
	// server can know user leave the connection
	"requestHomeLink" : boolean
}

export interface	ServerModel
{
	"isFetching": boolean,
	"connexionEnabled": boolean,
	"serverActiveSince": string,
	"connexionAttempt": number,
	"error": boolean,
	"message": string,
}

export interface	CanvasModel
{
	"height": number,
	"width": number
}

export interface	ControllerModel
{
	"activeView": string,
	"previousPage": string,
	"themeMode": string,
	"user": UserModel,
	"registration": RegistrationProcessModel,
	"canvas": CanvasModel
}
