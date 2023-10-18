/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import
{
	AdminResponseModel,
	UserLoginResponseModel,
	UserModel,
	UserPublicResponseModel,
	UserRegisterResponseModel,
} from "./user.interface";
import { v4 as uuidv4 } from "uuid";
import User from "src/chat/Objects/User";

import { privateDecrypt, randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";
import axios from "axios";
import path, { join } from "path";
import * as fs from "fs";

import * as sharp from "sharp";

@Injectable()
export class UserService
{
	private	user: Array<UserModel> = [];
	private	secret = randomBytes(64).toString("hex");
	private readonly	logger = new Logger("user-service itself");
	private readonly	uuidInstance = uuidv4();

	// image cdn Large is eq to publicPath 700 X 700
	private	readonly	publicPath = "/app/public/profilePictures";
	private readonly	publicPathLarge = "/app/public/profilePictures/large";

	// mediumm is eq to 350 X 350
	private readonly	publicPathMedium = "/app/public/profilePictures/medium";

	// small is eq to 175 X 175
	private readonly	publicPathSmall = "/app/public/profilePictures/small";

	// mmicro is eq to 25 X 25
	private readonly	publicPathMicro = "/app/public/profilePictures/micro";

	private	readonly	avatarArraySize = [
		700,
		350,
		175,
		25
	];

	public constructor()
	{
		this.logger.log("Base instance loaded with the instance id: "
			+ this.getUuidInstance());
		this.checkIOAccessPath(this.publicPath);
		this.checkIOAccessPath(this.publicPathLarge);
		this.checkIOAccessPath(this.publicPathMedium);
		this.checkIOAccessPath(this.publicPathSmall);
		this.checkIOAccessPath(this.publicPathMicro);
	}

	private	checkIOAccessPath(path: string)
	{
		fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (error) =>
		{
			if (error)
				this.logger.error("You need to check files and directory permission X and  W");
			else
				this.logger.verbose("The path for public storage is okay and accessible");
		});
	}

	public	getUuidInstance(): string
	{
		return (this.uuidInstance);
	}

	public	getUserArray(): Array<UserModel>
	{
		return (this.user);
	}

	public	getAdminArray(): AdminResponseModel
	{
		const	modifiedArray = this.user.map((elem) =>
		{
			return ({
				...elem,
				password: "[hidden information]"
			});
		});
		const	response = {
			numberOfClient: this.user.length,
			array: modifiedArray
		};
		return (response);
	}

	public	getSecret() : string
	{
		return (this.secret);
	}

	private	getCoefResize(inputSize: number, outputSize: number)
	{
		const coef = {
			value: 1,
			operator: ""
		};
		// operator division
		if (inputSize > outputSize)
		{
			coef.operator = "divide";
			coef.value = inputSize / outputSize;
		}
		// operator multiplication
		else if (outputSize > inputSize)
		{
			coef.operator = "multiply";
			coef.value = outputSize / inputSize;
		}
		else
		{
			coef.operator = "nothing";
			coef.value = 1;
		}
		return (coef);
	}

	private	getOutputSize(size: string)
	{
		switch (size)
		{
			case "large":
				return (this.avatarArraySize[0]);
			case "medium":
				return (this.avatarArraySize[1]);
			case "small":
				return (this.avatarArraySize[2]);
			case "micro":
				return (this.avatarArraySize[3]);
			default:
				return (this.avatarArraySize[0]);
		}
	}

	private	createResizedImage(srcFilename:string, destFilename: string, size: string)
	{
		this.logger.debug("Starting resize image");
		console.log("Src filename: ", srcFilename);
		console.log("Dest filename: ", destFilename);
		console.log("Size requested: ", size);

		const	destSize = this.getOutputSize(size);
		console.log("dest size:" + destSize);

		const	sourceImage = sharp(srcFilename);
		sourceImage
			.metadata()
			.then((metadata) =>
			{
				console.log("Meta-data");
				// console.log(metadata);
				if (metadata.width === undefined)
					throw new InternalServerErrorException();
				const	coef = this.getCoefResize(metadata.width, destSize);
				console.log(coef);
				if (coef.operator === "divide")
				{
					sourceImage
						.resize(Math.floor(metadata.width / coef.value))
						.toFile(destFilename)
						.then((info) =>
						{
							this.logger.verbose("Successfull create image size : " + size);
						})
						.catch((error) =>
						{
							console.log(error);
						});
				}
				else if (coef.operator === "multiply")
				{
					sourceImage
						.resize(Math.floor(metadata.width * coef.value))
						.toFile(destFilename)
						.then((info) =>
						{
							this.logger.verbose("Successfull create image size : " + size);
						})
						.catch((error) =>
						{
							console.log(error);
						});
				}
				else
				{
					sourceImage
						.toFile(destFilename)
						.then((info) =>
						{
							this.logger.verbose("Successfull create image size : " + size);
						})
						.catch((error) =>
						{
							console.log(error);
						});
				}
			})
			.catch((error) =>
			{
				this.logger.error(error);
			});
		this.logger.debug("Ending resize image");
	}

	// image at this step if perfectly square
	public async	downloadAvatar(userObj: UserModel)
	: Promise<UserModel>
	{
		this.logger.debug("Starting the downmload of the avatar");
		console.log(userObj);
		const	targetUrl = userObj.ftAvatar.link;
		this.logger.verbose("This is the target downlad: " + targetUrl);
		const filename = this.publicPath + "/" + userObj.username + ".jpeg";
		const filenameLarge = this.publicPathLarge + "/" + userObj.username + ".jpeg";
		const filenameMedium = this.publicPathMedium + "/" + userObj.username + ".jpeg";
		const filenameSmall = this.publicPathSmall + "/" + userObj.username + ".jpeg";
		const filenameMicro = this.publicPathMicro + "/" + userObj.username + ".jpeg";
		this.logger.verbose("This is the target file: " + filename);
		axios
		.get(targetUrl,
			{
				responseType: "arraybuffer"}
			)
			.then((res) =>
			{
				return (res.data);
			})
			.then((data) =>
			{
				this.logger.verbose("The data is ready to be stored inside a file");
				// console.log(data);
				fs.writeFile(filename, data, () =>
				{
					this.logger.verbose("Successfully download and write file");
					fs.writeFile(filenameLarge, data, () =>
					{
						this.logger.verbose("Successfully write file Large");
						this.createResizedImage(filename, filenameMedium, "medium");
						this.createResizedImage(filename, filenameSmall, "small");
						this.createResizedImage(filename, filenameMicro, "micro");
					});
				});
			})
			.catch((error) =>
			{
				this.logger.error(error);
			});

		this.logger.debug("Ending the downmload of the avatar");
		return (userObj);
	}

	public	register(data: UserModel)
		: {res: UserRegisterResponseModel, toDB: UserModel}
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.id === data.id);
		});
		if (searchUser?.registrationProcessEnded === true)
			throw new BadRequestException("Account already created");
		if (searchUser !== undefined)
		{
			const	index = this.user.findIndex((user) =>
			{
				return (user.id === data.id);
			});
			if (index !== -1)
				this.user.splice(index, 1);
		}
		const newUser: UserModel = {
			registrationProcessEnded: false,
			ftApi: data.ftApi,
			retStatus: data.retStatus,
			date: data.date,
			id: data.id,
			email: data.email,
			username: data.username,
			login: data.login,
			firstName: data.firstName,
			lastName: data.lastName,
			url: data.url,
			avatar: data.avatar,
			ftAvatar: data.ftAvatar,
			location: data.location,
			revokedConnectionRequest: data.revokedConnectionRequest,
			authService:
			{
				token: "Bearer " + jwt.sign(
					{
						id: data.id,
						email: data.email
					},
					this.secret,
					{
						expiresIn: "1d"
					}
				),
				expAt: Date.now() + (1000 * 60 * 60 * 24),
				doubleAuth:
				{
					enable: data.authService.doubleAuth.enable,
					lastIpClient: data.authService.doubleAuth.lastIpClient,
					phoneNumber: data.authService.doubleAuth.phoneNumber,
					phoneRegistered: data.authService.doubleAuth.phoneRegistered,
					validationCode: data.authService.doubleAuth.validationCode,
					valid: data.authService.doubleAuth.valid,
				}
			}
		};
		// const	urlImage = newUser.avatar;
		// this.logger.verbose(urlImage);
		// const	tmpPictures = join(__dirname, "..", "..", "public", "tmp", newUser.id + ".jpg");
		// const	dl = new DownloaderHelper(urlImage, tmpPictures);
		// dl.on("end", () =>
		// {
		// 	this.logger.log("Succcessfull download image from api");
		// });
		// dl.on("error", (error) =>
		// {
		// 	this.logger.error("Download Failed", error);
		// });
		// dl.start().catch((error) =>
		// {
		// 	this.logger.error("error", error);
		// });
		// this.logger.log("End of download ");
		this.user.push(newUser);
		const	response: UserRegisterResponseModel = {
			message: "Your session has been created, you must loggin",
			token: newUser.authService.token,
			id: newUser.id,
			email: newUser.email,
			statusCode: newUser.retStatus,
			username: newUser.username,
			login: newUser.login,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			avatar: newUser.avatar,
			ftAvatar: newUser.ftAvatar
		};
		return (
		{
			res: response,
			toDB: newUser
		});
	}

	public	login(id: any, email:string)
		: UserLoginResponseModel
	{
		const	searchUser = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString()
				&& user.email === email);
		});
		if (searchUser === undefined)
			throw new ForbiddenException("Invalid credential");
		else

			searchUser.authService.token = "Bearer " + jwt.sign(
				{
					id: searchUser.id,
					email: searchUser.email
				},
				this.secret,
				{
					expiresIn: "1d"
				}
			);

			const	response: UserLoginResponseModel = {
				message:
					"You are successfully connected as " + searchUser.login,
				token: searchUser.authService.token,
				expireAt: searchUser.authService.expAt
			};
			return (response);
	}

	public	userIdentifiedRequestEndOfSession(id: any)
	{
		const	user = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString());
		});
		if (!user)
			throw new InternalServerErrorException();
		if (user.revokedConnectionRequest === false)
			throw new InternalServerErrorException();
		user.authService.token = "no token";
		user.revokedConnectionRequest = false;
		return (false);
	}

	public revokeTokenById(id: any)
	{
		const	user = this.user.find((user) =>
		{
			return (user.id.toString() === id.toString());
		});
		if (!user)
			throw new InternalServerErrorException();
		user.revokedConnectionRequest = true;
	}

	public	getUserById(id: any)
		: UserModel | undefined
	{
		const	response = this.user.find((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		return (response);
	}

	public	verifyToken(token: string)
		: string
	{
		const	searchUser = this.user.findIndex((elem) =>
		{
			return (elem.authService.token === token);
		});
		if (searchUser !== undefined)
			return ("TOKEN OK");
		return ("TOKEN NOT OK");
	}

	public	getMyInfo(id: any)
		: UserPublicResponseModel
	{
		let	myInfo: UserPublicResponseModel;

		myInfo = {
			id: "undefined",
			email: "undefined",
			firstName: "undefined",
			lastName: "undefined",
			login: "undefined",
			username: "undefined"
		};
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)

			myInfo = {
				id: searchUser.id,
				email: searchUser.email,
				firstName: searchUser.firstName,
				lastName: searchUser.lastName,
				login: searchUser.login,
				username: searchUser.username
			};
		return (myInfo);
	}
}
