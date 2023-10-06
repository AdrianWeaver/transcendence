export interface ApplicationUserModel
{
	accessToken: string;
	tokenType: string;
	expiresIn: string;
	refreshToken: string;
	scope: string;
	createdAt: string;
	secretValidUntil: string;
}
export interface UserModel
{
	ftApi: ApplicationUserModel;
	retStatus: number;
	date: string;
	id: any;
	email: string;
	login: string;
	firstName: string;
	lastName: string;
	url: string;
	avatar: string | {
		link: string,
		version:
			{
				large: string,
				medium: string,
				small: string,
				mini: string
			}
	}
	location: string;
	uuid: string;
	password: string;
	// token: string;
	// lastConnection: number | "never connected";
	createdAt: string;
	authService:
	{
		token: string;
		expAt: number;
		doubleAuth:
		{
			valid: boolean;
			validationCode: string;
			// model phone number +33621523456
			phoneNumber: string;
			phoneRegistered: boolean;
			lastIpClient: string;
		}
	};
	// revokeConnectionRequest: boolean;
}

export interface AdminResponseModel
{
	numberOfClient: number;
	array : Array<UserModel>
}

export interface UserRegisterResponseModel
{
	message: string;
	token: string;
	// uuid: string;
	// password: string;
	// creationDate: string;
	statusCode: number;
}
