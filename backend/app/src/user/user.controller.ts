/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import { Body, Controller, Get, Logger, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsEmail, IsNotEmpty, } from "class-validator";

import	Api from "../Api";

import { ApplicationUserModel, UserLoginResponseModel, UserModel, UserVerifyTokenResModel } from "./user.interface";
import { UserAuthorizationGuard } from "./user.authorizationGuard";
import dotenv from "dotenv";

class	RegisterDto
{
	@IsNotEmpty()
	code: string;

	@IsNotEmpty()
	id: any;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

class UserLoginDto
{
	@IsNotEmpty()
	id: any;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

@Controller("user")
export class UserController
{
	private	readonly logger;

	constructor(private readonly userService: UserService)
	{
		this.logger = new Logger("user-controller");
		this.logger.log("instance UserService loaded with the instance id: " + this.userService.getUuidInstance());
	}

	@Post("register")
	getUserRegister(
		@Body() body: RegisterDto)
		// : UserRegisterResponseModel
	{
		// console.log("code: ", body.code);
		// console.log("password: ", body.password);
		// console.log("created at: ", body.userCreatedAt);
		// console.log("uuid: ", body.uuid);

		let	retValue;
		let	userObject: UserModel;
		const dataAPI = new FormData();
		dataAPI.append("grant_type", "authorization_code");
		dataAPI.append("code", body.code);
		// dataAPI.append("client_id", process.env.FT_UID);
		// dataAPI.append("client_secret", process.env.FT_SECRET);
		dataAPI.append("redirect_uri", "http://localhost:3001");

		// this.logger.debug(dataAPI);
		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://api.intra.42.fr/oauth/token",
			data: dataAPI
		};
		Api()
			.request(config)
			.then((res) =>
			{
				const	data = res.data;

				// this.logger.debug(data);
				const	newObject: ApplicationUserModel = {
					accessToken: data.access_token,
					tokenType: data.token_type,
					expiresIn: data.expires_in,
					refreshToken: data.refresh_token,
					scope: data.scope,
					createdAt: data.created_at,
					secretValidUntil: data.secret_valid_until
				};
				return (newObject);
			})
			.then((newObject : any) =>
			{
				const config = {
					method: "get",
					maxBodyLength: Infinity,
					url: "https://api.intra.42.fr/v2/me",
					headers: {
						"Authorization": "Bearer " + newObject.accessToken,
					}
				};
				Api()
				.request(config)
				.then((res) =>
				{
					const	data = res.data;
					userObject = {
						ftApi: newObject,
						// Do we need it ?
						retStatus: res.status,
						// Do we neet that ?
						date: res.headers.date,
						id: data.id,
						email: data.email,
						login: data.login,
						firstName: data.first_name,
						lastName: data.last_name,
						url: data.url,
						avatar: data.image,
						location: data.location,
						revokedConnectionRequest: false,
						// TEST anonymous user
						// uuid: body.uuid,
						// password: "a450dfbf-ad05-43d1-956e-634e779cd610",
						// createdAt: "undefined",
						authService:
						{
							token: "",
							expAt: 0,
							doubleAuth:
							{
								lastIpClient: "undefined",
								phoneNumber: "undefined",
								phoneRegistered: false,
								validationCode: "undefined",
								valid: false,
							}
						}
					};
					retValue = this.userService.register(userObject);
					return (retValue.res);
				})
				.catch((error) =>
				{
					console.log(error);
				});
			})
			.catch((error) =>
			{
				console.log(error);
			});

		// creer la requete pour recuperer le token grace a body
		// La requete provient de Postman
		// client_id est ecrit en dur pour le moment
		// client_secret est ecriit en dur pour le moment
		// POur les tests le code est envoye par postman apres avoir clique sur la carte du site


		// On devrait pouvoir logger le token.
		// fin de la premiere etape,
		// On refait un point apres pour ne pas se melanger les pinceaux
		// return ("okay");
		// this.logger.debug(""register" route request with uid: ", body.uuid);
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
		return ("Okay");
	}

	@Get("all-users")
	getAllUser()
		: UserModel[]
	{
		return (this.userService.getUserArray());
	}

	@Post("login")
	userLogin(
		@Body() body: UserLoginDto)
	: UserLoginResponseModel
	{
		this.logger
			.log("login route requested with id: ", body.id);
		return (this.userService.login(body.id, body.email));
	}

	@Post("verify-token")
	@UseGuards(UserAuthorizationGuard)
	verifyToken(@Req() headers: any)
		: UserVerifyTokenResModel
	{
		console.log(headers.authorization);
		this.logger
			.log("'verify-token' route request");
		const	response: UserVerifyTokenResModel = {
			message: "Successfully verified token",
			statusCode: 200
		};
		return (response);
	}

}
