/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import {
	Body,
	Controller,
	Post,
	UseGuards,
	Req,
	Logger,
	Res,
	OnApplicationBootstrap
} from "@nestjs/common";
import
{
	IsNotEmpty,
	IsUUID
}	from	"class-validator";
import
{
	AnonymousUserService,
}	from "./anonymous-user.service";
import
{
	// AnonymousUserLoginResponseModel,
	// AnonymousUserRegisterResponseModel,
	AnonymousUserVerifyTokenResModel,
	CustomRequest
}	from "./anonymous-user.interface";
import { AuthorizationGuard } from "./anonymous-user.authorizationGuard";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";

class AnonymousRegisterDto
{
	@IsUUID()
	@IsNotEmpty()
	uuid: string;
}

class AnonymousUserLoginDto
{
	@IsUUID()
	@IsNotEmpty()
	uuid: string;
	@IsNotEmpty()
	password: string;
}

@Controller("anonymous-user")
export class AnonymousUserController implements OnApplicationBootstrap
{
	private readonly logger;
	constructor(
		private readonly anonymousUserService: AnonymousUserService,
		private	readonly prismaService: PrismaService
	)
	{
		this.logger = new Logger("anonymous-user controller");
		this.logger
		.debug("I'm connected to anonymous-user-service instance id :"
			+ this.anonymousUserService.getUuidInstance());
		this.logger.debug("uuid prisma: " + this.prismaService.uuid);
	}

	onApplicationBootstrap()
	{
		this.logger
			.log("Loading fron database before the connection is accepted");
		
		this.prismaService.prisma.anonymousUser
			.findMany()
			.then((data: any) =>
			{
				this.anonymousUserService.populateFromDBObject(data);
			})
			.catch((error: any) =>
			{
				this.logger.error(error);
			});
	}

	@Post("register")
	getAnonymousRegister(
		@Body() body: AnonymousRegisterDto,
		@Res() res: Response)
	// : AnonymousUserRegisterResponseModel
	{
		this.logger
			.debug("anonymous user: A user request 'register' route with uid :"
				+ body.uuid);
		const	retValue = this.anonymousUserService.register(body.uuid);

		if (retValue.toDB.lastConnection === "never connected")
			retValue.toDB.lastConnection = -1;
		res.send(retValue.res).status(200)
			.end();
		const	obj = retValue.toDB;
		this.logger.debug("User has registration finish");
		this.logger.debug(obj);
		this.prismaService.prisma.anonymousUser.create(
			{
				data:
				{
					uuid: obj.uuid,
					token: obj.token,
					isRegistredAsRegularUser: obj.isRegistredAsRegularUser,
					lastConnection: obj.lastConnection.toString(),
					password: obj.password,
					revokeConnectionRequest: obj.revokeConnectionRequest,
					userCreatedAt: obj.userCreatedAt
				}
			}
		).then((data: any) =>
		{
			this.logger.debug("User sucessfully created", data);
		})
		.catch((error: any) =>
		{
			this.logger
				.error("An error occur when attempt to persist into database ",
					error);
		});
	}

	@Post("login")
	anonymousUserLogin(
		@Body() body: AnonymousUserLoginDto,
		@Res() res: Response)
	// : AnonymousUserLoginResponseModel
	{
		this.logger
			.debug("A user request 'login' route with uid :" + body.uuid);
		const ret = this.anonymousUserService.login(body.uuid, body.password);
		res.status(200).json(ret.res);
		this.logger.debug("User has login finish");
		const obj = ret.db;
		this.logger.debug(obj);
		this.prismaService.prisma.anonymousUser.update({
			where: {
				uuid: obj.uuid
			},
			data:
			{
				lastConnection: obj.lastConnection.toString(),
				revokeConnectionRequest: obj.revokeConnectionRequest,
				token: obj.token,
				isRegistredAsRegularUser: obj.isRegistredAsRegularUser,
				password: obj.password,
				userCreatedAt: obj.userCreatedAt,
				uuid: obj.uuid
			}
		})
		.then((data: any) =>
		{
			this.logger.debug("User sucessfully created", data);
		})
		.catch((error: any) =>
		{
			this.logger
				.error("An error occur when attempt to persist into database ",
					error);
		});
	}

	@Post("verify-token")
	@UseGuards(AuthorizationGuard)
	verifyToken()
	: AnonymousUserVerifyTokenResModel
	{
		this.logger
			.debug("A user request 'verify-token' router ");
		const	response: AnonymousUserVerifyTokenResModel = {
			message: "Sucessfully verify token",
			statusCode: 200
		};
		return (response);
		// return (this.anonymousUserService.verifyToken(token));
	}

	@Post("close-session")
	@UseGuards(AuthorizationGuard)
	revokeToken(@Req() req: CustomRequest)
		: string
	{
		this.logger
			.debug("A user request 'close-session' route with uid :");
		this.anonymousUserService.revokeTokenByUuid(req.user.uuid);
		return ("your session is now closed, please relog for access to data");
	}
}
