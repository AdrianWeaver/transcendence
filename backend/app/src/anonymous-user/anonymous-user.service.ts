/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	OnModuleInit
}	from "@nestjs/common";
import
{
	AnonymousAdminResponseModel,
	AnonymousUserLoginResponseModel,
	AnonymousUserModel,
	AnonymousUserRegisterResponseModel
}	from "./anonymous-user.interface";
import { v4 as uuidv4 } from "uuid";

import { randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class AnonymousUserService implements OnModuleInit
{
	private	anonymousUser: Array<AnonymousUserModel>;
	private	secret;
	private logger;
	private instanceId;
	public	prisma;

	constructor()
	{
		this.anonymousUser = [];
		this.secret = randomBytes(64).toString("hex");
		this.logger = new Logger("anonymous-user-service");
		this.instanceId = uuidv4();
		this.prisma = new PrismaClient();
	}

	public async populateOnStart() :Promise<AnonymousUserModel[]>
	{
		const	array: Array<AnonymousUserModel> = [];
		try
		{
			const	data = await this.prisma.anonymousUser.findMany();
			data.forEach((obj) =>
			{
				const toStore: AnonymousUserModel = {
					uuid: obj.uuid,
					password: obj.password,
					token: obj.token,
					lastConnection: obj.lastConnection,
					userCreatedAt: obj.userCreatedAt,
					revokeConnectionRequest: obj.revokeConnectionRequest,
					isRegistredAsRegularUser: obj.isRegistredAsRegularUser,
				};
				if (toStore.lastConnection === -1)
					toStore.lastConnection = "never connected";
				this.anonymousUser.push(toStore);
			});
			return (array);
		}
		catch (err: any)
		{
			console.log(err);
		}
		return (array);
	}

	onModuleInit()
	{
		this.logger.debug("The anonymous user service has been instiated with id :", this.instanceId);
		this.populateOnStart()
			.then(() =>
			{
				this.logger
					.debug("We have "
						+ this.anonymousUser.length
						+ " user in memory");
			});
			// .then(() =>
			// {
			// 	this.logger
			// 		.debug("We have "
			// 			+ this.anonymousUser.length
			// 			+ " user in memory");
			// });
			// .then((data) =>
			// {
			// 	// console.log(data);
			// 	data.forEach((obj) =>
			// 	{
			// 		const	toStore: AnonymousUserModel = {
			// 			uuid: obj.uuid,
			// 			password: obj.password,
			// 			token: obj.token,
			// 			lastConnection: obj.lastConnection,
			// 			userCreatedAt: obj.userCreatedAt,
			// 			revokeConnectionRequest: obj.revokeConnectionRequest,
			// 			isRegistredAsRegularUser: obj.isRegistredAsRegularUser,
			// 		};
			// 		if (toStore.lastConnection === -1)
			// 			toStore.lastConnection = "never connected";
			// 		this.anonymousUser.push(toStore);
			// 	});
			// })
			// .catch((error: any) =>
			// {
			// 	this.logger.error("database failure", error);
			// })
			// .finally(() =>
			// {
			// 	// disconnect
			// });
		// this data is empty
	}

	public getInstanceId() : string
	{
		return (this.instanceId);
	}

	public	getAnonymousUserArray(): AnonymousAdminResponseModel
	{
		const modifiedArray = this.anonymousUser.map((elem) =>
		{
			return ({
				...elem,
				password: "[hiddden information]"
			});
		});
		const response = {
			numberOfClient: this.anonymousUser.length,
			array: modifiedArray
		};
		return (response);
	}

	public	getSecret() : string
	{
		return (this.secret);
	}

	public	register(uuid: string)
		: {res:AnonymousUserRegisterResponseModel, toDB: AnonymousUserModel}
	{
		const searchUser = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid);
		});
		if (searchUser === undefined)
		{
			const newAnonymous: AnonymousUserModel = {
				uuid: uuid,
				password: uuidv4(),
				token: "no token",
				lastConnection: "never connected",
				userCreatedAt: Date().toString(),
				isRegistredAsRegularUser: false,
				revokeConnectionRequest: false
			};
			// console.log(newAnonymous);
			this.anonymousUser.push(newAnonymous);
			const	response: AnonymousUserRegisterResponseModel = {
				message: "Your session has been created, you must loggin",
				uuid: newAnonymous.uuid,
				password: newAnonymous.password,
				creationDate: newAnonymous.userCreatedAt,
				statusCode: 200
			};
			return (
			{
				res: response,
				toDB: newAnonymous
			});
		}
		else
			throw new BadRequestException("UUID already exists");
	}

	public login(uuid: string, password: string)
		: AnonymousUserLoginResponseModel
	{
		const	searchUser = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid && user.password === password);
		});
		if (searchUser === undefined)
			throw new ForbiddenException("Invalid credential");
		else
		{
			// console.log(this.secret);
			searchUser.lastConnection = Date.now();
			searchUser.revokeConnectionRequest = false;
			searchUser.token = "Bearer " + jwt.sign(
				{
					uuid: searchUser.uuid,
					isAnonymous: true
				},
				this.secret,
				{
					expiresIn: "1d"
				}
			);
			// console.log(searchUser);
			const	response: AnonymousUserLoginResponseModel = {
				message: "You are successfully connected as anonymous user",
				token: searchUser.token,
				expireAt:
					searchUser.lastConnection + (1000 * 60 * 60 * 24)
				// Date.now()
			};
			return (response);
		}
	}

	public	getUserByUuid(uuid: string)
	: AnonymousUserModel | undefined
	{
		const response = this.anonymousUser.find((user) =>
		{
			return (uuid === user.uuid);
		});
		return (response);
	}

	public	userIdentifiedRequestEndOfSession(uuid: string)
	{
		const	user = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid);
		});
		if (!user)
			throw new InternalServerErrorException();
		if (user.revokeConnectionRequest === false)
			throw new InternalServerErrorException();
		user.lastConnection = Date.now();
		user.token = "no token";
		user.revokeConnectionRequest = false;
		// console.log("Anonymous user revoke session uuid : " + user.uuid);
		return (false);
	}

	public revokeTokenByUuid(uuid: string)
	{
		const	user = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid);
		});
		if (!user)
			throw new InternalServerErrorException();
		user.revokeConnectionRequest = true;
	}

	public	adminCloseAllClient()
	: string
	{
		this.anonymousUser.map((elem) =>
		{
			elem.revokeConnectionRequest = true;
			return (elem);
		});
		return ("Send revoked to " + this.anonymousUser.length + "user");
	}

	public	verifyToken(token: string)
	: string
	{
		return ("okay");
	}
}
