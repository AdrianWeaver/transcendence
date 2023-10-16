/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import
{
	AdminResponseModel,
	UserLoginResponseModel,
	UserModel,
	UserPublicResponseModel,
	UserRegisterResponseModel,
} from "./user.interface";
import { v4 as uuidv4 } from "uuid";
import User from "src/chat/Objects/User";

import { randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";

@Injectable()
export class UserService
{
	private	user: Array<UserModel> = [];
	private	secret = randomBytes(64).toString("hex");
	private readonly logger = new Logger("user-service itself");
	private readonly uuidInstance = uuidv4();

	public constructor()
	{
		this.logger.log("Base instance loaded with the instance id: "
			+ this.getUuidInstance());
	}

	public	getUuidInstance(): string
	{
		return (this.uuidInstance);
	}

	public	getUserArray(): Array<UserModel>
	{
		return (this.user);
	}

	public	getAdminArray(): AdminResponseModel
	{
		const	modifiedArray = this.user.map((elem) =>
		{
			return ({
				...elem,
				password: "[hidden information]"
			});
		});
		const	response = {
			numberOfClient: this.user.length,
			array: modifiedArray
		};
		return (response);
	}

	public	getSecret() : string
	{
		return (this.secret);
	}

	public	register(data: UserModel)
		: {res: UserRegisterResponseModel, toDB: UserModel}
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.id === data.id);
		});
		if (searchUser?.registrationProcessEnded === true)
			throw new BadRequestException("Account already created");
		if (searchUser !== undefined)
		{
			const	index = this.user.findIndex((user) =>
			{
				return (user.id === data.id);
			});
			if (index !== -1)
				this.user.splice(index, 1);
		}
		const newUser: UserModel = {
			registrationProcessEnded: false,
			ftApi: data.ftApi,
			retStatus: data.retStatus,
			date: data.date,
			id: data.id,
			email: data.email,
			username: data.username,
			login: data.login,
			firstName: data.firstName,
			lastName: data.lastName,
			url: data.url,
			avatar: data.avatar,
			ftAvatar: data.ftAvatar,
			location: data.location,
			revokedConnectionRequest: data.revokedConnectionRequest,
			authService:
			{
				token: "Bearer " + jwt.sign(
					{
						id: data.id,
						email: data.email
					},
					this.secret,
					{
						expiresIn: "1d"
					}
				),
				expAt: Date.now() + (1000 * 60 * 60 * 24),
				doubleAuth:
				{
					enable: data.authService.doubleAuth.enable,
					lastIpClient: data.authService.doubleAuth.lastIpClient,
					phoneNumber: data.authService.doubleAuth.phoneNumber,
					phoneRegistered: data.authService.doubleAuth.phoneRegistered,
					validationCode: data.authService.doubleAuth.validationCode,
					valid: data.authService.doubleAuth.valid,
				}
			}
		};
		this.user.push(newUser);
		const	response: UserRegisterResponseModel = {
			message: "Your session has been created, you must loggin",
			token: newUser.authService.token,
			id: newUser.id,
			email: newUser.email,
			statusCode: newUser.retStatus,
			username: newUser.username,
			login: newUser.login,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			avatar: newUser.avatar,
			ftAvatar: newUser.ftAvatar
		};
		return (
		{
			res: response,
			toDB: newUser
		});
	}

	public	login(id: any, email:string)
		: UserLoginResponseModel
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString()
				&& user.email === email);
		});
		if (searchUser === undefined)
			throw new ForbiddenException("Invalid credential");
		else

			searchUser.authService.token = "Bearer " + jwt.sign(
				{
					id: searchUser.id,
					email: searchUser.email
				},
				this.secret,
				{
					expiresIn: "1d"
				}
			);

			const	response: UserLoginResponseModel = {
				message:
					"You are successfully connected as " + searchUser.login,
				token: searchUser.authService.token,
				expireAt: searchUser.authService.expAt
			};
			return (response);
	}

	public	userIdentifiedRequestEndOfSession(id: any)
	{
		const	user = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString());
		});
		if (!user)
			throw new InternalServerErrorException();
		if (user.revokedConnectionRequest === false)
			throw new InternalServerErrorException();
		user.authService.token = "no token";
		user.revokedConnectionRequest = false;
		return (false);
	}

	public revokeTokenById(id: any)
	{
		const	user = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString());
		});
		if (!user)
			throw new InternalServerErrorException();
		user.revokedConnectionRequest = true;
	}

	public	getUserById(id: any)
		: UserModel | undefined
	{
		const	response = this.user.find((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		return (response);
	}

	public	verifyToken(token: string)
		: string
	{
		const	searchUser = this.user.findIndex((elem) =>
		{
			return (elem.authService.token === token);
		});
		if (searchUser !== undefined)
			return ("TOKEN OK");
		return ("TOKEN NOT OK");
	}

	public	getMyInfo(id: any)
		: UserPublicResponseModel
	{
		let	myInfo: UserPublicResponseModel;

		myInfo = {
			id: "undefined",
			email: "undefined",
			firstName: "undefined",
			lastName: "undefined",
			login: "undefined",
			username: "undefined"
		};
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)

			myInfo = {
				id: searchUser.id,
				email: searchUser.email,
				firstName: searchUser.firstName,
				lastName: searchUser.lastName,
				login: searchUser.login,
				username: searchUser.username
			};
		return (myInfo);
	}

	public	registerPhoneNumber(numero: string, id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			searchUser.authService.doubleAuth.enable = true;
			searchUser.authService.doubleAuth.phoneNumber = numero;
			searchUser.authService.doubleAuth.phoneRegistered = true;
		}
		return("ok");
	}

	public	getPhoneNumber(id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
			return (searchUser.authService.doubleAuth.phoneNumber);
		return("undefined");
	}
}
