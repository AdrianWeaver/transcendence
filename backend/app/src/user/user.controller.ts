/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import { Body, Controller, Logger, Post, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

class	RegisterDto
{
	@IsNotEmpty()
	code: string;
	@IsNotEmpty()
	@IsUUID()
	uuid: string;
	@IsNotEmpty()
	@IsUUID()
	password: string;
	userCreateAt: string;
}

@Controller("user")
export class UserController
{
	private	readonly logger;

	constructor(private readonly userService: UserService)
	{
		this.logger = new Logger("user-controller");
		this.logger.debug("instance loaded");
	}

	@Post("register")
	getUserRegister(
		@Body() body: RegisterDto)
		: string
	{
		return ("okay");
		// this.logger.debug("'register' route request with uid: ", body.uuid);
		// const	retValue = this.userService.register(body.uuid);

		// this.logger.debug("return value: ", retValue);
		// if (retValue.toDB.lastConnection === "never connected")
		// 	retValue.toDB.lastConnection = -1;
		// res.send(retValue.res).status(200)
		// 	.end();
		// const	prisma = new PrismaClient();
		// const	rec = retValue.toDB;
		// prisma.$connect();
		// prisma.user.create({
		// 	data:
		// 	{
		// 		uuid: rec.uuid,
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
		// 	return ;
	}
}
