/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import { Body, Controller, Logger, Post, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

import	Api from "../Api";
import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { error } from "console";

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

	// @IsNotEmpty()
	// userCreatedAt: string;
	// @IsNotEmpty()
	// clientid: string;

	// @IsNotEmpty()
	// clientsecret: string;

	// @IsNotEmpty()
	// granttype: string;

	// @IsNotEmpty()
	// indirecturi: string;
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
		// console.log("code: ", body.code);
		// console.log("password: ", body.password);
		// console.log("created at: ", body.userCreatedAt);
		// console.log("uuid: ", body.uuid);


		const dataAPI = new FormData();
		dataAPI.append("grant_type", "authorization_code");
		dataAPI.append("code", body.code);
		dataAPI.append("client_id", "u-s4t2ud-8aa9db498628bfc0f7404bee5a48f6b5da74bd58af97184135e3e1018af58563");
		dataAPI.append("client_secret", "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");
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
				console.log(res);
				const	data = res.data;

				// this.logger.debug(data);
				const	newObject: any = {
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
					console.log(res);
					const	data = res.data;
					const	userObject: any = {
						id: data.id,
						email: data.email,
						login: data.login,
						firstName: data.first_name,
						lastName: data.last_name,
						url: data.url,
						avatar: data.image.link
					};
					console.log("USER: ", userObject);
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
		// const configAPI = {
		// method: "post",
		// maxBodyLength: Infinity,
		// url: "https://api.intra.42.fr/oauth/token",
		// 	dataAPI: dataAPI
		// };

		// axios.request(configAPI)
		// .then((response:any ) => {
		// console.log(JSON.stringify(response.data));
		// })
		// .catch((error:any) => {
		// console.log(error);
		// });
			// Api()
			// .post("/oauth/token", dataAPI, configAPI)
			// .then((res) =>
			// {
			// 	console.log(res);
			// 	console.log("ca marche ou pas wesh ?");
			// })
			// .catch((error) =>
			// {
			// 	console.log(error);
			// });

		// creer la requete pour recuperer le token grace a body
		// La requete provient de Postman
		// client_id est ecrit en dur pour le moment 
		// client_secret est ecriit en dur pour le moment
		// POur les tests le code est envoye par postman apres avoir clique sur la carte du site


		// On devrait pouvoir logger le token.
		// fin de la premiere etape,
		// On refait un point apres pour ne pas se melanger les pinceaux 
		return ("okay");
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
	}
}
