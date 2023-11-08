/* eslint-disable curly */
/* eslint-disable no-dupe-class-members */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, Param, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, } from "class-validator";
import { Request, Response } from "express";
import	Api from "../Api";
import	ApiTwilio from "../Api-twilio";

import { ApplicationUserModel, BackUserModel, UserLoginResponseModel, UserModel, UserPublicResponseModel, UserRegisterResponseModel, UserVerifyTokenResModel } from "./user.interface";
import { UserAuthorizationGuard } from "./user.authorizationGuard";
import * as dotenv from "dotenv";
import * as busboy from "busboy";
import * as fs from "fs";
import * as sharp from "sharp";
import internal from "stream";
import { AccountPage } from "twilio/lib/rest/api/v2010/account";
import FileConfig from "./Object/FileConfig";
import * as readline from "readline";
import * as twilio from "twilio";

export class	RegisterStepOneDto
{
	@IsEmail()
	@IsNotEmpty()
	emailAddress: string;

	// minmax
	@IsNotEmpty()
	firstName: string;
	@IsNotEmpty()
	lastName: string;
	@IsNotEmpty()
	password: string;
	@IsNotEmpty()
	passwordConfirm: string;
	@IsNotEmpty()
	uniquenessPassword: "AgreeWithUniquenessOfPassword";
	@IsNotEmpty()
	username: string;
	@IsBoolean()
	ft: boolean;
}

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
	// getUserRegiste
	@IsEmail()
	@IsNotEmpty()
	email: string;
}


class UserUploadPhotoDto
{
	@IsNotEmpty()
	image: any;
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

	// to delete
	@Get("all-user-Raw")
	getAllUsersRaw()
	{
		return (this.userService.getAllUserRaw());
	}

	@Post("register/step-one")
	@UseGuards(UserAuthorizationGuard)
	async getUserRegisterStepOne(
		@Body() body: RegisterStepOneDto,
		@Req() req: any,
		@Res() res: Response)
	{
		this.logger.verbose("Next information is the previous user");
		console.log(req.user);

		const	unauthorized = (errCode: number, info: string) =>
		{
			res.status(errCode).json(
				{
					message: "Unauthorized",
					info: info,
					error: true
				});
		};
		this.logger.verbose("Next information is the updated user");
		// console.log(body);
		if (body.password !== body.passwordConfirm)
			return (unauthorized(401, "You are an hacker go off"), void(0));
		this.logger.verbose("password okay and are the same");
		const count = this.userService
			.getNumberOfUserWithUsername(body.username);
		if (count > 1)
			return (unauthorized(401, "Username already taken"), void(0));
		this.logger.verbose("username count okay");
		const user = req.user;
		console.log(user, " ", body);
		if (body.ft && (body.emailAddress !== user.email
			|| body.firstName !== user.firstName
			|| body.lastName !== user.lastName))
			return (unauthorized(401, "You are an hacker go off"), void(0));
		this.logger.verbose("verification okay");
		this.logger.debug("Number of user with this username: " + count);
		const	update = await this.userService.updateUser(user.id, body, true);
		if (update === "ERROR")
			return (unauthorized(500, "try again later"), void(0));
		return (res.status(200).json({message: "okay"}), void(0));
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
		const	users = this.userService.getUserArray();
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
				const	searchUser = users.find((elem) =>
				{
					return (elem.ftApi.accessToken === data.access_token);
				});
				if (searchUser)
				{
					this.logger.error("User Already register ");
					return ("already exists");
				}
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
				if (newObject === "already exists")
				{
					res.status(400).json({error: "you are already register"});
					return ;
				}
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
				.then(async (resData) =>
				{
					const	data = resData.data;
					const userTempCheck: UserModel | undefined = this.userService.getUserById(data.id);
					if (userTempCheck && userTempCheck.registrationProcessEnded === true)
					{
						this.logger.error("User Already register ");
						res.status(400).json({error: "you are already register"});
					}
					else
					{
						userObject = {
							registrationProcessEnded: false,
							registrationStarted: true,
							ftApi: newObject,
							retStatus: resData.status,
							date: resData.headers.date,
							id: data.id,
							email: data.email,
							username: data.login,
							online: false,
							status: "offline",
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
							},
							password: "undefined",
							friendsProfileId: []
						};
						this.logger.log("Starting processing image");
						const newUserObj = await this.userService.downloadAvatar(userObject);
						retValue = this.userService.register(newUserObj);
						await this.userService.createUserToDatabase(newUserObj)
						.then((data) =>
						{
							if (data === "ERROR")
							{
								this.logger.error("Client create a error");
							}
							else if (data === "SUCCESS")
							{
								this.logger.debug("Client create is a success");
							}
							else
							{
								this.logger.error("Logic error await/async ");
							}
						});
						res.status(200).send(retValue.res);
						// mise a jour vers la database
						this.logger.log("Ending processing image");
					}
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

	@Post("register-forty-three")
	getUserRegisterFortyThree(
		// @Body() body: RegisterDto,
		@Res() res: Response)
	{
		this.logger.log("A no 42 User want to register");
		// need to throw 5xx exception
		if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.FT_UID
			|| !this.env.parsed.FT_SECRET)
			throw new InternalServerErrorException();
		let	retValue;
		// let	userObject: UserModel;
		let	profileId: number;
		profileId = Math.floor((Math.random() * 100000) + 1);
		while (!this.userService.isProfileIDUnique(profileId))
			profileId = Math.floor((Math.random() * 100000) + 1);
		const	userObject:UserModel = {
			registrationProcessEnded: false,
			registrationStarted: true,
			ftApi: {
				accessToken: "undefined",
				tokenType: "undefined",
				expiresIn: "undefined",
				refreshToken: "undefined",
				scope: "undefined",
				createdAt: "undefined",
				secretValidUntil: "undefined"
			},
			retStatus: 200,
			date: "undefined",
			id: profileId,
			email: "undefined",
			username: "undefined",
			online: false,
			status: "offline",
			login: "undefined",
			firstName: "undefined",
			lastName: "undefined",
			url: "undefined",
			avatar: "https://thispersondoesnotexist.com/",
			ftAvatar: {
				link: "https://thispersondoesnotexist.com/",
				version: {
					large: "https://thispersondoesnotexist.com/",
					medium: "https://thispersondoesnotexist.com/",
					small: "https://thispersondoesnotexist.com/",
					mini: "https://thispersondoesnotexist.com/"
				}
			},
			location: "outer space",
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
			},
			password: "undefined",
			friendsProfileId: []
		};
		if (this.userService.getUserById(userObject.id) !== undefined)
		{
			this.logger.error("User Already register ");
			// console.log()
			res.status(400).json({error: "you are already register"});
		}
		else
		{
			this.logger.log("Starting register forty three user");
			// const newUserObj = this.userService.downloadAvatar(userObject);
			retValue = this.userService.register(userObject);
			// this.userService.createUserToDatabase(userObject)
			// .then((data) =>
			// {
			// 	if (data === "ERROR")
			// 	{
			// 		this.logger.error("Client create a error");
			// 	}
			// 	else if (data === "SUCCESS")
			// 	{
			// 		this.logger.debug("Client create is a success");
			// 	}
			// 	else
			// 	{
			// 		this.logger.error("Logic error await/async ");
			// 	}
			// });
			res.status(200).send(retValue.res);
			// mise a jour vers la database
			this.logger.log("Ending forty three user processing register");
		}
	}

	@Get("all-users")
	getAllUser()
		: UserModel[]
	{
		this.logger.verbose("request user data");
		this.logger.verbose(this.userService.getUserArray());
		return (this.userService.getUserArray());
	}

	/**
	 * @returns the list of user filtered
	 */
	@Get("get-all-users")
	getAllUsers()
		: BackUserModel[]
	{
		console.log("request back users model data");
		console.log(this.userService.getBackUserModelArray());
		return (this.userService.getBackUserModelArray());
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

	@Post("validate-registration")
	@UseGuards(UserAuthorizationGuard)
	userValidateRegistration(
		// @Body() body: any,
		@Req() req: any,
		@Res() res: Response)
	{
		this.logger
			.log("'validate-registration' route requested with id: ", req.user.id);
		const isOK = this.userService.validateRegistration(req.user.id);
		if (isOK)
			res.status(200).send("ok");
		else
			res.status(401).send("Not ok");
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
	@UseGuards(UserAuthorizationGuard)
	getMyInfo(@Req() req: any)
		: UserPublicResponseModel
	{
		// NEED TO FIND A WAY TO KNOW THE USER ID
		return (this.userService.getMyInfo(req.user.id));
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
		return (this.userService.registerPhoneNumber(data.numero, req.user.id));
	}

	@Post("double-auth-twilio")
	@UseGuards(UserAuthorizationGuard)
	DoubleAuthSendSMS(
		@Body() body: any,
		@Req() req: any
	)
	{
		// console.log("body ", body);
		// console.log("req ", req.user);
		console.log(this.env);
		if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.TWILIO_ACCOUNT_SID
			|| !this.env.parsed.TWILIO_AUTH_TOKEN
			|| !this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
			throw new InternalServerErrorException();
		// const	number = this.userService.getPhoneNumber(req.user.id);
		// if (number === undefined)
		// 	throw new InternalServerErrorException();
		if (body.numero === "undefined" || !body.numero)
			throw new InternalServerErrorException();
		const client = twilio(this.env.parsed.TWILIO_ACCOUNT_SID, this.env.parsed.TWILIO_AUTH_TOKEN);
		client.verify.v2
		.services(this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
		.verifications.create({
			to: body.numero,
			channel: "sms" })
		.then((verification) =>
		{
			console.log(verification.status);
		})
		.catch((error) =>
		{
			console.error("Boo", error);
		})
		.finally(() =>
		{
			console.log("sms sent");
		});
	}

	@Post("get-code")
	@UseGuards(UserAuthorizationGuard)
	GetValidationCode(
		@Body() body: any,
		@Req() req: any,
		@Res() res: Response
	)
	{
		// console.log("body ", body);
		// console.log("opt-code", body.otpCode);
		if (body.otpCode === undefined)
			throw new UnauthorizedException();
		console.log(this.env);
		if (!this.env)
			throw new InternalServerErrorException();
		if (!this.env.parsed)
			throw new InternalServerErrorException();
		if (!this.env.parsed.TWILIO_ACCOUNT_SID
			|| !this.env.parsed.TWILIO_AUTH_TOKEN
			|| !this.env.parsed.TWILIO_VERIFY_SERVICE_SID)
			throw new InternalServerErrorException();
		const	number = body.to;
		if (number === "undefined" || number === undefined)
			throw new InternalServerErrorException();
		const client = twilio(this.env.parsed.TWILIO_ACCOUNT_SID, this.env.parsed.TWILIO_AUTH_TOKEN);
		// const readLine = readline.createInterface({
				// input: process.stdin,
				// output: process.stdout,
			// });
		const	verify = this.env.parsed.TWILIO_VERIFY_SERVICE_SID;
		if (verify === undefined)
			throw new InternalServerErrorException();
		// readLine.question("Please enter the OTP:", (otpCode: string) =>
		// {
		client.verify.v2
			.services(verify)
			.verificationChecks.create(
				{
					to: number,
					code: body.otpCode
				})
			.then((verificationCheck) =>
			{
				console.log("status : ", verificationCheck.status);
				console.log("VERIF : ", verificationCheck);
				if (verificationCheck.status === "approved")
				{
					res.send(true);
					return (this.userService.codeValidated(body.otpCode, req.user.id, true));
				}
				else
					throw new UnauthorizedException();
			})
			.catch((err) =>
			{
				console.log("err");
				throw new InternalServerErrorException();
			});
		// });
	}

	@Post("/update-photo")
	@UseGuards(UserAuthorizationGuard)
	async updatePhoto(
		@Req() req: any,
		@Res() res: Response,
		@Body() body: any)
	{
		// console.log(req);
		this.logger.log("start update photo");
		try
		{
			const	busboyConfig = {
				headers: req.headers,
				limits:
				{
					fileSize: 10 * 1024 * 1024
				}
			};

			const	fileCfg = new FileConfig();
			fileCfg.setTempFolder(this.userService.getConfig().tmpFolder);
			fileCfg.setFilename(req.user.username);
			console.log(req.user);

			const bb = busboy(busboyConfig);

			const	processBusboy = (): Promise<string> =>
			{
				this.logger.debug("start the busboy event listener");
				return (
					new Promise<string>((resolve, reject)=>
					{
						bb.on("file", async (name: string, file: internal.Readable, info: busboy.FileInfo) =>
						{
							const	{ filename, encoding, mimeType } = info;
							console.log("Starting visualisation of busboy data");
							console.log(info);
							console.log(filename);
							console.log(encoding);
							console.log(mimeType);
							console.log("Ending of busboy data display");
							fileCfg.configMimeType(mimeType);
							if (!fileCfg.isAccepted())
								reject(new HttpException("Unsupported Media Type", HttpStatus.UNSUPPORTED_MEDIA_TYPE));
							// console.log(file);
							file.on("data", (data) =>
							{
								console.log("buffer", typeof data);
								fileCfg.addToBuffer(data);
							});
							file.on("end", () =>
							{
								console.log("finish");
								resolve(fileCfg.fullPath());
							});
						});
						bb.on("error", (error) =>
						{
							reject(error);
						});
						req.pipe(bb);
					})
				);
			};
			this.logger.verbose("Start processing");
			await processBusboy().then((filename) =>
			{
				this.logger.verbose(filename);
				try
				{
					fs.writeFileSync(fileCfg.fullPath(), fileCfg.getBuffer());
				}
				catch (error)
				{
					return (res.status(500).json({error: true}));
				}
				return (fileCfg.fullPath());
			})
			.catch((error) =>
			{
				res.status(500).json({error: true});
				console.log(error);
				return ;
			});
			await this.userService.uploadPhoto(fileCfg, req.user);
			res.status(200).json({message: "Success"});
			// console.log("buffer", fileCfg.getBuffer());
			this.logger.log("end update photo");
		}
		catch (error)
		{
			this.logger.error(error);
			res.status(500).json({error: true});
		}
	}
	@Post("change-infos")
	@UseGuards(UserAuthorizationGuard)
	ChangeUsername(
		@Body() data: any,
		@Req() req: any)
		: string
	{
		this.logger
			.log("'change-infos' route request");
		return (this.userService.changeInfos(data, req.user.id));
	}

	@Post("revoke-token")
	@UseGuards(UserAuthorizationGuard)
	RevokeToken(@Req() req: any)
	{
		this.userService.revokeTokenById(req.user.id);
		return ("token revoked");
	}

	@Post("hash-password")
	@UseGuards(UserAuthorizationGuard)
	HashPassword(
		@Body() body: any,
		@Req() req: any)
	: string
	{
		this.logger
			.log("'hash-password' route requested");
		this.userService.hashPassword(body.password, body.id);
		return ("okay");
	}

	@Post("decode-password")
	async DecodePassword(
		@Body() body: any)
	: Promise<any>
	{
		this.logger
			.log("'decode-password' route requested");
		const	ret = await this.userService.decodePassword(body.password, body.id, body.email);
		console.log(ret);
		if (!ret || ret === "ERROR")
			return ("error");
		return (ret);
	}


	@Post("add-friend")
	@UseGuards(UserAuthorizationGuard)
	AddFriend(
		@Body() body: any)
	{
		// console
		this.logger
			.log("'add-friend' route requested");
		return (this.userService.addUserAsFriend(body.friendId, body.myId));
	}

	// @Get("public/picture/:profileId")
	// getPublicPicture(@Param() params: any)
	// {
	// 	console.log(params);
	// 	// I want to send the address of the picture
	// 	const	user = this.userService.getUserById(params.profileId);
	// 	if (user === undefined)
	// 		throw new NotFoundException();
	// 	return ("http://localhost:3001/cdn/picture/" + user.username);
	// }
}
