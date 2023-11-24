/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
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
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnonymousUserService implements OnModuleInit
{
	private	anonymousUser: Array<AnonymousUserModel> = [];
	private	secret: string;
	private	uuidInstance: string = "42";
	private	logger = new Logger("anymous-user-service itself");
	private	readonly secretId = "anonymous-user-service-secret";

	public constructor (
		private readonly prismaService : PrismaService
	)
	{
		this.anonymousUser = [];
		this.uuidInstance = uuidv4();
		this.logger.log("An instance of service is started with id: "
			+ this.uuidInstance);
		this.logger.log("An instance of prisma service is loaded with uid "
			+ this.prismaService.uuid);
	}

	onModuleInit()
	{
		//this.loadSecretFromDB();
	}

	private	generateSecretForDB()
	{
		const	toDB = {
			"secret_id": this.secretId,
			"value": randomBytes(64).toString("hex")
		};

		this.prismaService.prisma.secretTable
			.create(
				{
					data: toDB
				}
			).then(() =>
			{
				this.loadSecretFromDB();
			})
			.catch((error: any) =>
			{
				this.logger.error(error);
			});
	}

	private loadSecretFromDB()
	{
		return ;
		this.prismaService.prisma.secretTable
			.findUnique({
				where:
				{
					// eslint-disable-next-line camelcase
					secret_id: this.secretId,
				}
			}).then((data: any) =>
			{
				if (data === null)
					this.generateSecretForDB();
				else
					this.secret = data?.value;
				this.logger.verbose("secret form db is:" + this.secret);
			})
			.catch((error: any) =>
			{
				this.logger.error(error);
			})
			.finally(() =>
			{
				this.logger.debug("end of load into database ");
			});
	}

	public	populateFromDBObject(data: any[])
	{
		this.logger.verbose("\tcreate user from database ");
		return ;
		this.prismaService
			.prisma.anonymousUser
			.findMany()
			.then((data) =>
			{
				console.log(data);
			})
			.catch((error: any ) =>
			{
				this.logger.error("Ca fait  pas des chocapics ");
			});
		// const	cast = data as AnonymousUserModel[];
		// cast.forEach(el =>
		// {
		// 	const	obj: AnonymousUserModel = {
		// 		isRegistredAsRegularUser: el.isRegistredAsRegularUser,
		// 		lastConnection: el.lastConnection,
		// 		password: el.password,
		// 		revokeConnectionRequest: el.revokeConnectionRequest,
		// 		token: el.token,
		// 		userCreatedAt: el.userCreatedAt,
		// 		uuid: el.uuid,
		// 	};
		// 	this.anonymousUser.push(obj);
		// });
		this.logger.verbose(this.anonymousUser);
	}

	public	getUuidInstance (): string
	{
		return (this.uuidInstance);
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
		: {db : AnonymousUserModel, res: AnonymousUserLoginResponseModel}
	{
		const	searchUser = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid && user.password === password);
		});
		if (searchUser === undefined)
			throw new ForbiddenException("Invalid credential");
		else
		{
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
			const	response: AnonymousUserLoginResponseModel = {
				message: "You are successfully connected as anonymous user",
				token: searchUser.token,
				expireAt:
					searchUser.lastConnection + (1000 * 60 * 60 * 24)
			};
			const	retValue = {
				db: searchUser,
				res: response
			};
			return (retValue);
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
			throw new Error("User doesnt exist");
		if (user.revokeConnectionRequest === false)
			throw new Error("No action");
		user.lastConnection = Date.now();
		user.token = "no token";
		user.revokeConnectionRequest = false;
		console.log("Anonymous user revoke session uuid : " + user.uuid);
		return (false);
	}

	public revokeTokenByUuid(uuid: string)
	{
		const	user = this.anonymousUser.find((user) =>
		{
			return (user.uuid === uuid);
		});
		if (!user)
			throw new Error("User doesnt exist");
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
