/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import {
	Body,
	Controller,
	Post,
	UseGuards,
	Req,
	Get
} from "@nestjs/common";
import {Request} from "express";
import { IsJWT, IsNotEmpty, IsUUID } from "class-validator";
import
{
	AnonymousUserService,
}	from "./anonymous-user.service";
import
{
	AnonymousAdminResponseModel,
	AnonymousUserLoginResponseModel,
	AnonymousUserModel,
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
	constructor(private readonly anonymousUserService: AnonymousUserService)
	{

	}

	@Post("register")
	getAnonymousRegister(@Body() body:AnonymousRegisterDto)
	: AnonymousUserRegisterResponseModel
	{
		console.log(body.uuid);
		return (this.anonymousUserService.register(body.uuid));
	}

	@Post("login")
	anonymousUserLogin(@Body() body: AnonymousUserLoginDto)
	: AnonymousUserLoginResponseModel
	{
		return (this.anonymousUserService.login(body.uuid, body.password));
	}

	@Post("verify-token")
	@UseGuards(AuthorizationGuard)
	verifyToken()
	: AnonymousUserVerifyTokenResModel
	{
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
		console.log(req.user);
		this.anonymousUserService.revokeTokenByUuid(req.user.uuid);
		return ("your session is now closed, please relog for access to data");
	}

	// Unprotected for now may use a special Guard For Administrator/Moderator
	@Get("admin/list-all-anonymous")
	adminListAllAnonymous()
	: AnonymousAdminResponseModel
	{
		return (this.anonymousUserService.getAnonymousUserArray());
	}

	// Unprotected for now 
	@Post("admin/close-all-connection")
	adminCloseAllClient()
	: string
	{
		return (this.anonymousUserService.adminCloseAllClient());
	}
}
