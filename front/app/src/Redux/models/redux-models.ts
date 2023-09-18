
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
	"error": boolean;
	"errorStatusCode": number,
	"errorMessage": string
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

export interface	Dimension
{
	width: number,
	height: number
}

export interface	Position
{
	x: number,
	y: number
}

export interface	GameEngineModel
{
	server:
	{
		dimension: Dimension,
		scaleServer: Dimension,
		frameNumber: number,
		numberOfUser: number,
		readyPlayerCount: number,
	},
	board:
	{
		dimension: Dimension,
		ball:
		{
			position: Position,
		},
		playerOne:
		{
			position: Position,
		}
		playerTwo:
		{
			position: Position
		}
		plOneSocket: string,
		plTwoSocket: string,
		plOneScore: number,
		plTwoScore:number
	}
}
