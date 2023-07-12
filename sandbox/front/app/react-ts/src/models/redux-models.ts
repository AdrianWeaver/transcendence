
export interface UserModel
{
	"isLoggedIn": boolean,
	"username": string,
	"bearerToken": string,
	"rememberMe": boolean
}

export interface ControllerModel
{
	"activeView": string,
	"themeMode": string,
	"user": UserModel
}
