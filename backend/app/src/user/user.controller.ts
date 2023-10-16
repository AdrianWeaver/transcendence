/* eslint-disable no-dupe-class-members */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, } from "class-validator";
import { Request, Response } from "express";
import	Api from "../Api";
import	ApiTwilio from "../Api-twilio";

import { ApplicationUserModel, UserLoginResponseModel, UserModel, UserPublicResponseModel, UserRegisterResponseModel, UserVerifyTokenResModel } from "./user.interface";
import { UserAuthorizationGuard } from "./user.authorizationGuard";
import * as dotenv from "dotenv";

import * as twilio from "twilio";

class	RegisterDto
{
	@IsNotEmpty()
	code: string;

	// @IsNotEmpty()
	// id: any;

	// @IsEmail()
	// @IsNotEmpty()
	// email: string;
}

class	UserDoubleAuthDto
{
	// @IsNumberString()
	@IsNotEmpty()
	numero: string;

	// id or token ?
	// @IsNotEmpty()
	// id: any;
}
class UserLoginDto
{
	@IsNotEmpty()
	id: any;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

class	TwilioResponseDto
{
	@IsNotEmpty()
	// numero format +33
	To: string;
	// Channel = sms
	Channel: string;
}
@Controller("user")
export class UserController
{
	private	readonly logger;
	private	readonly env;

	constructor(private readonly userService: UserService)
	{
		this.logger = new Logger("user-controller");
		this.logger.log("instance UserService loaded with the instance id: " + this.userService.getUuidInstance());
		this.env = dotenv.config();
	}

	@Post("test-double-auth")
	testDoubleAuth(
		@Body() body: any
	)
	{
		console.log("body ", body);
		console.log(this.env);
		if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.TWILIO_ACCOUNT_SID
			|| !this.env.parsed.TWILIO_AUTH_TOKEN
			|| !this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
			throw new InternalServerErrorException();
		const client = twilio(this.env.parsed.TWILIO_ACCOUNT_SID, this.env.parsed.TWILIO_AUTH_TOKEN);
		client.verify.v2
		.services(this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
		.verifications.create({
			to: "+33767406877",
			channel: "sms" })
		.then((verification) =>
		{
			console.log(verification.status);
		})
		// client.messages
		// .create({
		// 	body: "Hello world",
		// 	messagingServiceSid: "MGb27c1e450cb8f255dc5ffaf1cd154d7a",
		// 	to: "+33767406877",
		// 	from: "+12293947099"
		// })
		// .then((message) =>
		// {
		// 	console.log(message.sid);
		// 	console.log(message);
		// })
		.catch((error) =>
		{
			console.error("Boo", error);
		})
		.finally(() =>
		{
			console.log("sms sent");
		});
	}

	@Post("register")
	getUserRegister(
		@Body() body: RegisterDto,
		@Res() res: Response)
	{
		this.logger.log("A User want to register");
		// need to throw 5xx exception
		if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.FT_UID
			|| !this.env.parsed.FT_SECRET)
			throw new InternalServerErrorException();
		let	retValue;
		let	userObject: UserModel;
		const dataAPI = new FormData();
		dataAPI.append("grant_type", "authorization_code");
		dataAPI.append("code", body.code);
		dataAPI.append("client_id", this.env.parsed.FT_UID);
		dataAPI.append("client_secret", this.env.parsed.FT_SECRET);
		dataAPI.append("redirect_uri", "http://localhost:3001");

		this.logger.debug(dataAPI);
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
				.then((resData) =>
				{
					const	data = resData.data;
					userObject = {
						registrationProcessEnded: false,
						ftApi: newObject,
						retStatus: resData.status,
						date: resData.headers.date,
						id: data.id,
						email: data.email,
						username: data.login,
						login: data.login,
						firstName: data.first_name,
						lastName: data.last_name,
						url: data.url,
						avatar: data.image?.link,
						ftAvatar: data.image,
						location: data.location,
						revokedConnectionRequest: false,
						authService:
						{
							token: "",
							expAt: 0,
							doubleAuth:
							{
								enable: false,
								lastIpClient: "undefined",
								phoneNumber: "undefined",
								phoneRegistered: false,
								validationCode: "undefined",
								valid: false,
							}
						}
					};
					retValue = this.userService.register(userObject);
					res.status(200).send(retValue.res);
					// mise a jour vers la database
				})
				.catch((error) =>
				{
					// this.logger.error("Get my information route", error);
					// throw new InternalServerErrorException();
					res.status(500).send({
						message: "internal server Error ",
						error: error
					});
				});
			})
			.catch((error) =>
			{
				// this.logger.error("redeem code for token", error);
				res.status(401).send({
					message: "wrong code provided",
					error: error
				});
			});
	}

	@Get("all-users")
	getAllUser()
		: UserModel[]
	{
		this.logger.verbose("request user data");
		this.logger.verbose(this.userService.getUserArray());
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

	// Our token 
	@Post("verify-token")
	@UseGuards(UserAuthorizationGuard)
	verifyToken(@Req() headers: any)
		: UserVerifyTokenResModel
	{
		this.logger
			.log("'verify-token' route request");
		const	response: UserVerifyTokenResModel = {
			message: "Successfully verified token",
			statusCode: 200
		};
		return (response);
	}

	@Get("my-info")
	getMyInfo()
		: UserPublicResponseModel
	{
		// NEED TO FIND A WAY TO KNOW THE USER ID
		return (this.userService.getMyInfo(97756));
	}

	@Post("double-auth")
	@UseGuards(UserAuthorizationGuard)
	GetTheNumber(
		@Body() data: UserDoubleAuthDto,
		@Req() req: any)
		: string
	{
		this.logger
			.log("'double-auth' route request");
		return (this.userService.getPhoneNumber(data.numero, req.user.id));
	}

	@Post("double-auth-twilio")
	// @UseGuards(UserAuthorizationGuard)
	ReceiveValidationCodeTwilio(
		@Body() body: TwilioResponseDto,
		@Res() res: any)
		: string
	{
		this.logger
			.log("'double-auth-twilio' route request");
			if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.TWILIO_ACCOUNT_SID
			|| !this.env.parsed.TWILIO_AUTH_TOKEN
			|| !this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
			throw new InternalServerErrorException();
		const	data = {
			To: "+33622143240",
			Channel: "sms"
		};
		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://verify.twilio.com/v2/Services/VA96f27d7513b90f3f54774bfde0efd889/Verifications",
			data: data
		};
		ApiTwilio()
		.request(config)
		.then((res) =>
		{
			console.log(res.data);
		});
			// .request(config)
			// .then((res) =>
			// {
			// 	const	data = res.data;
			// 	console.log(data);
			// })
			// .catch((error) =>
			// {
			// 	// this.logger.error("Get my information route", error);
			// 	// throw new InternalServerErrorException();
			// 		console.log("error ", error);
			// });
		return ("code validation send");
	}
}
