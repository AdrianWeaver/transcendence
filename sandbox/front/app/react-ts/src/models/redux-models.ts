
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
	"connexionEnabled" : boolean,
}

export interface	ControllerModel
{
	"activeView": string,
	"themeMode": string,
	"server": ServerModel,
	"anonymousUser": AnonymouseUserModel,
	"user": UserModel,
	"isFetching": boolean,
	"registration": RegistrationProcessModel
}
