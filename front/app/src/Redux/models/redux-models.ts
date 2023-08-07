
export interface	UserModel
{
	"isLoggedIn": boolean,
	"username": string,
	"bearerToken": string,
	"rememberMe": boolean
}

export interface	AnonymouseUserModel
{
	"uuid": string,
}

export	interface	RegistrationProcessModel
{
	"startedRegister": boolean,
	"step": number,
	"codeOauthFT": string,
	"abortRequested": boolean,
}

export interface	ServerModel
{
	"isFetching": boolean,
	"connexionEnabled": boolean,
	"connexionAttempt": number,
	"error": boolean,
	"message": string
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
	"anonymousUser": AnonymouseUserModel,
	"user": UserModel,
	"registration": RegistrationProcessModel,
	"canvas": CanvasModel
}
