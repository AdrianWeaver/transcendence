/* eslint-disable no-label-var */
/* eslint-disable no-unused-labels */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException
} from "@nestjs/common";
import
{
	AdminResponseModel,
	BackUserModel,
	UserLoginResponseModel,
	UserModel,
	UserPublicResponseModel,
	UserRegisterResponseModel,
} from "./user.interface";
import { v4 as uuidv4 } from "uuid";
import User from "src/chat/Objects/User";

import { randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";
import { ThisMonthInstance } from "twilio/lib/rest/api/v2010/account/usage/record/thisMonth";
import * as bcrypt from "bcrypt";

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

	public getAllUserRaw () : Array<UserModel>
	{
		return (this.user);
	}

	public	getUuidInstance(): string
	{
		return (this.uuidInstance);
	}

	public	getUserArray(): Array<UserModel>
	{
		return (this.user);
	}

	public	getBackUserModelArray(): BackUserModel[]
	{
		const	users: BackUserModel[] = [];
		let i: number;

		i = 0;
		const	searchUser = this.user.find((elem) =>
		{
			users[i] = {
				id: elem.id,
				email: elem.email,
				username: elem.username,
				firstName: elem.firstName,
				lastName: elem.lastName,
				avatar: elem.avatar,
				location: elem.location,

			};
			i++;
		});
		return (users);
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
		// const	secretToken = randomBytes(64).toString("hex");
		const newUser : UserModel= {
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
			},
			password: data.password
			// tokenSecret: secretToken
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

	public	getUserExpById(id: any)
	: number
	{
		const searchUser = this.user.find((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		if (searchUser === undefined)
			return (-1);
		return (searchUser.authService.expAt);
	}

	public	revokeUserTokenExpById(id: any)
	{
		const searchIndex = this.user.findIndex((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		if (searchIndex === -1)
			return ;
		this.user[searchIndex].authService.expAt = Date.now();
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

	public	getUsernameByProfileId(profileId: string)
	{
		const searchUser = this.user.find((element) =>
		{
			return (element.id === profileId);
		});
		console.error(searchUser);
		return (searchUser?.username);
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

	public	codeValidated(code: string, id: string, valid: boolean)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			searchUser.authService.doubleAuth.validationCode = code;
			searchUser.authService.doubleAuth.valid = valid;
			searchUser.registrationProcessEnded = valid;
		}
		return (valid);
	}

	public	hashPassword(password: string, id: any)
	{
		const	saltRounds = 10;
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id.toString() === id.toString());
		});
		if (searchUser === undefined)
			return ("User not found");
		bcrypt.hash(password, saltRounds)
		.then((hash) =>
		{
			console.log(hash);
			searchUser.password = hash;
		})
		.catch((err) =>
		{
			console.log(err);
			return ("error");
		});
		return (searchUser.password);
	}

	async	decodePassword(password: string, id: any, email: any)
	{
		const	index = this.user.findIndex((elem) =>
		{
			return (elem.id.toString() === id.toString() && elem.email === email);
		});
		if (index === -1)
			return ("User not found");
		console.log(password, " ", this.user[index].password);
		const	valid = await bcrypt.compare(password, this.user[index].password)
		.then(() =>
		{
			const ret =	{
				token: "Bearer " + jwt.sign(
				{
					id: id,
					email: email
				},
				this.getSecret(),
				{
					expiresIn: "1d"
				}),
				expAt: Date.now() + (1000 * 60 * 60 * 24),
				index: index
			};
			if (ret === undefined)
				return ("error");
			return (ret);
		})
		.catch((err) =>
		{
			console.log(err);
			return ("error");
		});
		return (valid);
	}

	public	changeInfos(data: any, id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			if (data.info?.length)
				if (data.field === "username" && data.info !== searchUser.username)
					searchUser.username = data.info;
				else if (data.field === "email" && data.info !== searchUser.email)
					searchUser.email = data.info;
				else if (data.field === "phoneNumber" && data.info !== searchUser.authService.doubleAuth.phoneNumber)
					searchUser.authService.doubleAuth.phoneNumber = data.info;
				else if (data.field === "password")
					this.decodePassword(data.info, id, searchUser.email);

			console.log(searchUser);
			return ("okay");
		}
		return ("user doesnt exist");
	}
	public	addUserAsFriend(friendId: string, id: string)
	{
		const	searchFriend = this.user.find((elem) =>
		{
			return (elem.id === friendId);
		});
		const	searchUserIndex = this.user.findIndex((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUserIndex !== -1)
			return ("User doesnt exist");
		if (searchFriend === undefined)
			return ("This new friend doesnt exist");
		// this.user[searchUserIndex].friends.push(searchFriend);
		return (searchFriend.username + " added as friend");
	}

}
