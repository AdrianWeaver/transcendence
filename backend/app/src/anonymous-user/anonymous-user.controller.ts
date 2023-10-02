/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import {
	Body,
	Controller,
	Post,
	UseGuards,
	Req,
	Logger
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
	}

	@Post("register")
	getAnonymousRegister(@Body() body:AnonymousRegisterDto)
	: AnonymousUserRegisterResponseModel
	{
		this.logger
			.log("A user request 'register' route with uid :" + body.uuid);
		return (this.anonymousUserService.register(body.uuid));
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
