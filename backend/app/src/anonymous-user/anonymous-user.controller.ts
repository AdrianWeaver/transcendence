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
	Res
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
	AnonymousUserLoginResponseModel,
	AnonymousUserRegisterResponseModel,
	AnonymousUserVerifyTokenResModel,
	CustomRequest
}	from "./anonymous-user.interface";
import { AuthorizationGuard } from "./anonymous-user.authorizationGuard";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

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
export class AnonymousUserController
{
	private readonly logger;
	constructor(private readonly anonymousUserService: AnonymousUserService)
	{
		this.logger = new Logger("anonymous-user controller");
		this.logger.debug("I'm connected :)");
	}

	@Post("register")
	getAnonymousRegister(
		@Body() body: AnonymousRegisterDto,
		@Res() res: Response)
	// : AnonymousUserRegisterResponseModel
	{
		this.logger
			.debug("A user request 'register' route with uid :" + body.uuid);
		const	retValue = this.anonymousUserService.register(body.uuid);

		this.logger.debug("return Value :", retValue);
		if (retValue.toDB.lastConnection === "never connected")
			retValue.toDB.lastConnection = -1;
		res.send(retValue.res).status(200)
			.end();
		// res.send(retValue.res);
		// const prisma = new PrismaClient();
		// const	rec = retValue.toDB;
		// prisma.$connect();
		// prisma.anonymousUser.create({
		// 	data:
		// 	{
		// 		uuid: rec.uuid,
		// 		isRegistredAsRegularUser: rec.isRegistredAsRegularUser,
		// 		lastConnection: rec.lastConnection as number,
		// 		password: rec.password,
		// 		revokeConnectionRequest: rec.revokeConnectionRequest,
		// 		token: rec.token,
		// 		userCreatedAt: rec.userCreatedAt
		// 	}
		// })
		// 	.catch((error: any) =>
		// 	{
		// 		throw error;
		// 	})
		// 	.finally(async () =>
		// 	{
		// 		prisma.$disconnect();
		// 	});
		// return ;
	}

	@Post("login")
	anonymousUserLogin(@Body() body: AnonymousUserLoginDto)
	: AnonymousUserLoginResponseModel
	{
		this.logger
			.log("A user request 'login' route with uid :" + body.uuid);
			
		return (this.anonymousUserService.login(body.uuid, body.password));
	}

	@Post("verify-token")
	@UseGuards(AuthorizationGuard)
	verifyToken()
	// login or clear, cause user already have an uuid
	: AnonymousUserVerifyTokenResModel
	// but seams to be an error, user are trigger without
	// normal procedure
	// (We are inside register, see display anonymous connect)
	{
		this.logger
			.log("A user request 'verify-token' router ");
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
			.log("A user request 'close-session' route with uid :");
		this.anonymousUserService.revokeTokenByUuid(req.user.uuid);
		return ("your session is now closed, please relog for access to data");
	}
}
