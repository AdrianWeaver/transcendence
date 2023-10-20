/* eslint-disable curly */
/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { IsEmail, IsNotEmpty, isNotEmpty, } from "class-validator";
import { Response } from "express";
import	Api from "../Api";

import { ApplicationUserModel, UserLoginResponseModel, UserModel, UserPublicResponseModel, UserRegisterResponseModel, UserVerifyTokenResModel } from "./user.interface";
import { UserAuthorizationGuard } from "./user.authorizationGuard";
import * as dotenv from "dotenv";
// import { FileInterceptor } from "@nestjs/platform-express";
import * as busboy from "busboy";
import * as fs from "fs";
import * as sharp from "sharp";
import internal from "stream";
import { AccountPage } from "twilio/lib/rest/api/v2010/account";

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

class UserLoginDto
{
	@IsNotEmpty()
	id: any;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

class UserUploadPhotoDto
{
	@IsNotEmpty()
	image: any;
}

@Controller("user")
export class UserController
{
	private	readonly logger;
	private	env;

	constructor(private readonly userService: UserService)
	{
		this.logger = new Logger("user-controller");
		this.logger.log("instance UserService loaded with the instance id: " + this.userService.getUuidInstance());
		this.env = dotenv.config();
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
				.then(async (resData) =>
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
					this.logger.error("NOT AN ERROR: Starting processing image");
					const newUserObj = await this.userService.downloadAvatar(userObject);
					retValue = this.userService.register(newUserObj);
					res.status(200).send(retValue.res);
					// mise a jour vers la database
					this.logger.error("NOT AN ERROR: Ending processing image");
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
		console.log(headers.authorization);
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

	@Post("/update-photo")
	@UseGuards(UserAuthorizationGuard)
	async updatePhoto(
		@Req() req: any,
		@Res() res: Response,
		@Body() body: any)
	{
		this.logger.error("NOT AN ERROR: start update photo");
		try
		{
			const	busboyConfig = {
				headers: req.headers,
				limits:
				{
					fileSize: 10 * 1024 * 1024
				}
			};
			const bb = busboy(busboyConfig);

			const	processBusboy = (): Promise<string> =>
			{
				return (
					new Promise<string>((resolve, reject)=>
					{
						bb.on("file", async (name: string, file: internal.Readable, info: busboy.FileInfo) =>
						{
							let		acceptedType;
							let		extension;
							const	{ filename, encoding, mimeType } = info;
							console.log("Starting visualisation of busboy data");
							console.log(info);
							console.log(filename);
							console.log(encoding);
							console.log(mimeType);
							console.log("Ending of busboy data display");
							acceptedType = false;
							if (mimeType === "image/jpeg")
							{
								extension = ".jpeg";
								acceptedType = true;
							}
							if (mimeType === "image/png")
							{
								extension = ".png";
								acceptedType = true;
							}
							if (!acceptedType)
								reject(new HttpException("Unsupported Media Type", HttpStatus.UNSUPPORTED_MEDIA_TYPE));
							// console.log(file);
							try
							{
								const	tmpFolder = this.userService.getConfig().tmpFolder;
								const	filename = req.user.username;
								const fullPath = tmpFolder + "/" + filename + extension;
								file.pipe(fs.createWriteStream(fullPath));
								
								// ...error here 
								this.logger.verbose("Successfully write to tmp");
								resolve(fullPath);
							}
							catch (error)
							{
								reject(error);
							}
						});
						bb.on("finish", () =>
						{
							// this.logger.verbose("finished bb");
							resolve("what");
						});
						bb.on("close", () =>
						{
							// this.logger.verbose("closed bb");
							reject("connection Closed");
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
			const tmpFile = await processBusboy();
			// this.logger.verbose(tmpFile);
			await this.userService.uploadPhoto(tmpFile, req.user);
			res.status(200).json({message: "Success"});
			this.logger.error("NOT AN ERROR: end update photo");
		}
		catch (error)
		{
			this.logger.error(error);
			res.status(500).json({error: true});
		}
	}

	// @Post("/update-photo")
	// // @UseGuards(UserAuthorizationGuard)
	// updatePhoto(
	// 	@Req() req: any,
	// 	@Res() res: Response,
	// 	@Body() body: any)
	// {
	// 	this.logger.error("NOT AN ERROR: A user request update photo");
	// 	// console.log(req.headers);
	// 	const	busboyConfig = {
	// 		headers: req.headers,
	// 		limits:
	// 		{
	// 			fileSize: 10 * 1024 * 1024
	// 		}
	// 	};
	// 	const bb = busboy(busboyConfig);

	// 	bb.on("file", (name: string, file: internal.Readable, info: busboy.FileInfo) =>
	// 	{
	// 		const	{ filename, encoding, mimeType } = info;

	// 		console.log("Starting visualisation of busboy data");
	// 		console.log(info);
	// 		console.log(filename);
	// 		console.log(encoding);
	// 		console.log(mimeType);
	// 		console.log("Ending of busboy data display");
	// 		let	acceptedType;

	// 		acceptedType = false;
	// 		if (mimeType === "image/jpeg")
	// 			acceptedType = true;
	// 		if (mimeType === "image/png")
	// 			acceptedType = true;
	// 		if (!acceptedType)
	// 		{
	// 			throw new HttpException("Unsupported Media Type", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
	// 			// this.logger.error("file have no correct mimeType");
	// 		}
	// 		file
	// 		.on("limit", () =>
	// 		{
	// 			console.log("File limits reached !");
	// 			throw new HttpException("Payload too large", HttpStatus.PAYLOAD_TOO_LARGE);
	// 		})
	// 		.on("data", (data) =>
	// 		{
	// 			console.log(data);
	// 			return ;
	// 		})
	// 		.on("close", ()=>
	// 		{
	// 			console.log("File close ");
	// 		});
	// 	});

	// 	bb.on("field", (name, val, info) =>
	// 	{
	// 		console.log(name, val);
	// 	});
	// 	bb.on("close", () =>
	// 	{
	// 		console.log("BB connexion close");
	// 		res.status(200).json("Sucessfully uploaded ");
	// 		return ("closed");
	// 	});

	// 	req.pipe(bb);
	// 	this.logger.error("NOT AN ERROR: A user request update photo");
	// 	// console.log(body);
	// 	// console.log(file);
	// 	return ("okay");
	// }
}
