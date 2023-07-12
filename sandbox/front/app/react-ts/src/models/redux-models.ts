
export interface UserModel
{
	"isLoggedIn": boolean,
}

export interface ControllerModel
{
	"activeView": string,
	"themeMode": string,
	"user": UserModel
}
