
export interface	UserModel
{
	"isLoggedIn": boolean,
	"username": string,
	"bearerToken": string,
	"rememberMe": boolean
}

export	interface	RegistrationProcessModel
{
	"startedRegister": boolean,
	"step": number,
	"codeOauthFT": string,
	"abortRequested": boolean,
}

export interface	ControllerModel
{
	"activeView": string,
	"themeMode": string,
	"user": UserModel
	"registration": RegistrationProcessModel
}
