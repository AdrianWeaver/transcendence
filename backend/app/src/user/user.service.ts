/* eslint-disable curly */
/* eslint-disable no-label-var */
/* eslint-disable no-unused-labels */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import
{
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	OnModuleInit
} from "@nestjs/common";
import
{
	AdminResponseModel,
	BackUserModel,
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
import FileConfig from "./Object/FileConfig";

export type PictureConfigModel = {
	path:
	{
		normal: string;
		large: string;
		medium: string;
		small: string;
		micro: string;
	},
	tmpFolder: string;
	size: number[];
}
import { ThisMonthInstance } from "twilio/lib/rest/api/v2010/account/usage/record/thisMonth";
import * as bcrypt from "bcrypt";
import { RegisterStepOneDto } from "./user.controller";
import ServerConfig from "../serverConfig";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class UserService implements OnModuleInit
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

	// upload tempt storage 
	private readonly	publicPathTemp = "/app/public/tmp";

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
		
	}

	async onModuleInit()
	{
		await this.checkPermalinks();
		this.checkIOAccessPath(this.publicPath);
		this.checkIOAccessPath(this.publicPathLarge);
		this.checkIOAccessPath(this.publicPathMedium);
		this.checkIOAccessPath(this.publicPathSmall);
		this.checkIOAccessPath(this.publicPathMicro);
		this.checkIOAccessPath(this.publicPathTemp);
	}

	public	getConfig()
		: PictureConfigModel
	{
		const	obj: PictureConfigModel = {
			path:
			{
				normal: this.publicPath,
				large: this.publicPathLarge,
				medium: this.publicPathMedium,
				micro: this.publicPathMicro,
				small: this.publicPathSmall,
			},
			size: this.avatarArraySize,
			tmpFolder: this.publicPathTemp
		};
		return (obj);
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

	private async isHavingPreviousPermalinks(actualServerCfg: ServerConfig): Promise<boolean>
	{
		const	prisma = new PrismaClient();
		const	permalinkVersion = "prod-v2";
		// console.log(prisma.permalinks);
		try
		{
			const permalinks = await prisma.permalinks.findUnique(
				{
					where:
					{
						version: permalinkVersion
					}
				});
			this.logger.verbose("permalink setted ?: " + (permalinks !== null));
			if (permalinks === null)
			{
				try
				{
					await prisma.permalinks.create(
					{

						data: {
							version: permalinkVersion,
							contents: actualServerCfg.serialize()
						}
					}
					);
					await this.isHavingPreviousPermalinks(actualServerCfg);
				}
				catch (error)
				{
					this.logger.error(error);
				}
			}
			else
			{
				const compareFromDB = await JSON.parse(permalinks.contents);
				console.log(compareFromDB);
				const requestedCmp = await JSON.parse(actualServerCfg.serialize());
				console.log(requestedCmp);
				if (compareFromDB === requestedCmp)
				{
					this.logger.error("Permalink already set but environnement changing");
					return (false);
				}
				this.logger.warn("Permalinks already set, must not change until drop table");
			}
			this.logger.verbose(JSON.stringify(permalinks));
		}
		catch(error)
		{
			this.logger.error(error);
			return (false);
		}
		return (true);
	}
	private	async checkPermalinks()
	{
		const test = new ServerConfig();
		this.logger.verbose("Permalinks verifications from environement:");
		this.logger.verbose("Location: " + test.location);
		this.logger.verbose("Protocol: " + test.protocol);
		this.logger.verbose("Port: " + test.port);
		if (!test.port || !test.location || !test.protocol)
			this.logger.error("Production file must have server config environnement");
		else
		{
			await this.isHavingPreviousPermalinks(test);
			// prisma.
			// prisma
			// prisma.secretTable
			// 	.create(
			// 		{
			// 			data: toDB
			// 		}
			// 	).then(() =>
			// 	{
			// 		this.loadSecretFromDB();
			// 	})
			// 	.catch((error: any) =>
			// 	{
			// 		this.logger.error(error);
			// 	});
		}
		this.logger.verbose("Permalinks check ending");
	}

	public getAllUserRaw () : Array<UserModel>
	{
		return (this.user);
	}

	public	getUuidInstance(): string
	{
		return (this.uuidInstance);
	}

	public	getUserArray(): Array<UserModel>
	{
		return (this.user);
	}

	public	getBackUserModelArray(): BackUserModel[]
	{
		const	users: BackUserModel[] = [];
		let i: number;

		i = 0;
		const	searchUser = this.user.find((elem) =>
		{
			users[i] = {
				id: elem.id,
				email: elem.email,
				username: elem.username,
				firstName: elem.firstName,
				lastName: elem.lastName,
				avatar: elem.avatar,
				location: elem.location,
			};
			i++;
		});
		return (users);
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

	private	async	createResizeImage(srcFilename:string, destFilename: string, size: string)
	{
		const	destSize = this.getOutputSize(size);
		// debug helper
		this.logger.debug("Starting resize image");
		this.logger.debug("Src filename: ", srcFilename);
		this.logger.debug("Dest filename: ", destFilename);
		this.logger.debug("Size requested: ", size);
		this.logger.debug("Dest size:" + destSize);

		const	sourceImage = sharp(srcFilename);
		this.logger.log("Extracting meta-data...");
		try
		{
			const	metadata = await sourceImage.metadata();
			// console.log(metadata);
			if ((metadata.width === undefined || metadata.height === undefined)
				|| metadata.width !== metadata.height)
				throw new InternalServerErrorException();
			const	coef = this.getCoefResize(metadata.width, destSize);
			// this.logger.log(coef);
			if (coef.operator === "divide")
			{
				const resizedImage = sourceImage.resize(Math.floor(metadata.width / coef.value));
				await resizedImage.toFile(destFilename);
				this.logger.verbose("Successfull write file " + size);
			}
			else if (coef.operator === "multiply")
			{
				const resizedImage = sourceImage.resize(Math.floor(metadata.width * coef.value));
				await resizedImage.toFile(destFilename);
				this.logger.verbose("Successfull write file " + size);
			}
			else
			{
				await sourceImage.toFile(destFilename);
				this.logger.verbose("Successfull write file" + size);
			}
		}
		catch (error)
		{
			this.logger.error(error);
		}
	}

	// image at this step if perfectly square
	public async	downloadAvatar(userObj: UserModel)
	: Promise<UserModel>
	{
		this.logger.debug("Starting the downmload of the avatar");
		// console.log(userObj);
		const	targetUrl = userObj.ftAvatar.link;
		this.logger.verbose("This is the target downlad: " + targetUrl);
		const filename = this.publicPath + "/" + userObj.username + ".jpeg";
		const filenameLarge = this.publicPathLarge + "/" + userObj.username + ".jpeg";
		const filenameMedium = this.publicPathMedium + "/" + userObj.username + ".jpeg";
		const filenameSmall = this.publicPathSmall + "/" + userObj.username + ".jpeg";
		const filenameMicro = this.publicPathMicro + "/" + userObj.username + ".jpeg";
		this.logger.verbose("This is the target file: " + filename);
		try
		{
			this.logger.verbose("Starting fetching the data from 42 api");
			const response = await axios
				.get(targetUrl, { responseType: "arraybuffer"});
			const data = response.data;
			this.logger.verbose("Start: The data is ready to be stored inside a file");
			try
			{
				fs.writeFileSync(filename, data);
				this.logger.log("Successfully store the avatar");
				try
				{
					fs.writeFileSync(filenameLarge, data);
					this.logger.log("Succesfully save Large file");
					await this.createResizeImage(filename, filenameMedium, "medium");
					this.logger.log("Succesfully save medium file");
					await this.createResizeImage(filename, filenameSmall, "small");
					this.logger.log("Succesfully save small file");
					await this.createResizeImage(filename, filenameMicro, "micro");
					this.logger.log("Succesfully save micro file");
					const newUserObj: UserModel = {
						...userObj,
						avatar: "http://localhost:3000/cdn/image/profile/" + userObj.username + ".jpeg",
						ftAvatar:
						{
							link: "http://localhost:3000/cdn/image/profile/" + userObj.username + ".jpeg",
							version:
							{
								large: "http://localhost:3000/cdn/image/profile/large/" + userObj.username + ".jpeg",
								medium: "http://localhost:3000/cdn/image/profile/medium/" + userObj.username + ".jpeg",
								mini: "http://localhost:3000/cdn/image/profile/micro/" + userObj.username + ".jpeg",
								small: "http://localhost:3000/cdn/image/profile/small/" + userObj.username + ".jpeg",
							}
						}
					};
					return (newUserObj);
				}
				catch (error)
				{
					this.logger.error(error);
				}
			}
			catch (error)
			{
				this.logger.error(error);
			}
			this.logger.verbose("End: The data is ready to be stored inside a file");
		}
		catch (error)
		{
			this.logger.error(error);
		}
		this.logger.error("Must not be here !");
		return (userObj);
	}

	private	async convertPNGToJPEG(oldTmpFilePath: string, destTmpFilePath: string)
	{
		this.logger.debug("input file: " + oldTmpFilePath);
		this.logger.debug("output file: " + destTmpFilePath);

		try
		{
			const	imagePng = sharp(oldTmpFilePath);
			const	metadata = await imagePng.metadata();
			console.log(metadata);
			const	outputBuffer = await imagePng.jpeg().toBuffer();
			this.logger.verbose("buffer ready to be writted");
			fs.writeFileSync(destTmpFilePath, outputBuffer);
			this.logger.log("Convertion okay");
		}
		catch (error)
		{
			this.logger.error(error);
		}
	}

	private	async	deletePicture(src: string)
	{
		try
		{
			fs.unlinkSync(src);
			this.logger.verbose("PNG file deleted");
		}
		catch (error)
		{
			this.logger.error(error);
		}
	}

	private async	cropImageIfNeeded(filecfg: FileConfig)
	{
		this.logger.log("Start crop if needed");

		try
		{
			const	image = sharp(filecfg.getPathTmpConverted());

			const	metadata = await image.metadata();
			// console.log(metadata);
			if (metadata.height === metadata.width
				|| metadata.width === undefined
				|| metadata.height === undefined)
				return ;
			const	requestedSize = Math.min(metadata.height, metadata.width);
			console.log("requested size: ", requestedSize);
			const	cropedImage = await image.extract(
				{
					width: requestedSize,
					height: requestedSize,
					left: 0,
					top: 0,
				}
			)
			.toBuffer();
			this.logger.verbose("Sucessfull write to buffer the croped image");
			fs.writeFileSync(filecfg.getPathTmpConverted(), cropedImage);
			this.logger.log("Image cropped writed to disk");
		}
		catch (error)
		{
			this.logger.error(error);
		}
	}

	private async	resizeAllUploadedPictures(fileCfg: FileConfig)
	{
		this.logger.verbose("Starting resize all pictures");
		try
		{
			await	this.cropImageIfNeeded(fileCfg);

			await this.createResizeImage(
				fileCfg.getPathTmpConverted(),
				fileCfg.getPathNormal(),
				"large"
			);
			await this.createResizeImage(
				fileCfg.getPathTmpConverted(),
				fileCfg.getPathLarge(),
				"large"
			);
			this.logger.log("resized to large");
			await this.createResizeImage(
				fileCfg.getPathTmpConverted(),
				fileCfg.getPathMedium(),
				"medium"
			);
			this.logger.log("resized to medium");
			await this.createResizeImage(
				fileCfg.getPathTmpConverted(),
				fileCfg.getPathSmall(),
				"small"
			);
			this.logger.log("resized to small");
			await this.createResizeImage(
				fileCfg.getPathTmpConverted(),
				fileCfg.getPathMicro(),
				"micro"
			);
			this.logger.log("resized to micro");
		}
		catch (error)
		{
			this.logger.error(error);
		}
	}

	public	async	uploadPhoto(fileCfg: FileConfig, userObj: UserModel)
	: Promise<UserModel>
	{
		this.logger.verbose("Starting resize Process");
		this.logger.log("The tmpfilepath is : ", fileCfg.fullPath());
		fileCfg.setPictureConfig(this.getConfig());
		// console.log(this.getConfig());
		if (fileCfg.needConvertToJPEG())
		{
			try
			{
				this.logger.log("Starting convertion of the file");
				await this.convertPNGToJPEG(fileCfg.fullPath(), fileCfg.getPathTmpConverted());
				await this.deletePicture(fileCfg.fullPath());
				await this.resizeAllUploadedPictures(fileCfg);
				this.logger.log("Ending convertion of the file");
			}
			catch (error)
			{
				this.logger.error(error);
			}
		}
		else
		{
			try
			{
				await this.resizeAllUploadedPictures(fileCfg);
			}
			catch (error)
			{
				this.logger.error(error);
			}
		}
		this.deletePicture(fileCfg.getPathTmpConverted());
		const	newUserObj: UserModel = {
			...userObj,
			avatar: fileCfg.getCDNConfig().avatar,
			ftAvatar: fileCfg.getCDNConfig().ftAvatar,
		};
		this.logger.verbose("End resize Process");
		// const index = this.user.findIndex((user) =>
		// {
		// 	return (user.id === newUserObj.id);
		// });
		// this.user[index] = newUserObj;
		return (newUserObj);
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
		// const	secretToken = randomBytes(64).toString("hex");
		const newUser : UserModel= {
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
			},
			password: data.password
			// tokenSecret: secretToken
		};
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

	public	getUserExpById(id: any)
	: number
	{
		const searchUser = this.user.find((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		if (searchUser === undefined)
			return (-1);
		return (searchUser.authService.expAt);
	}

	public	revokeUserTokenExpById(id: any)
	{
		const searchIndex = this.user.findIndex((user) =>
		{
			return (id.toString() === user.id.toString());
		});
		if (searchIndex === -1)
			return ;
		this.user[searchIndex].authService.expAt = Date.now();
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

	public	registerPhoneNumber(numero: string, id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			searchUser.authService.doubleAuth.enable = true;
			searchUser.authService.doubleAuth.phoneNumber = numero;
			searchUser.authService.doubleAuth.phoneRegistered = true;
		}
		return("ok");
	}

	public	getUsernameByProfileId(profileId: string)
	{
		const searchUser = this.user.find((element) =>
		{
			return (element.id === profileId);
		});
		console.error(searchUser);
		return (searchUser?.username);
	}

	public	getPhoneNumber(id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
			return (searchUser.authService.doubleAuth.phoneNumber);
		return("undefined");
	}

	public	codeValidated(code: string, id: string, valid: boolean)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			searchUser.authService.doubleAuth.validationCode = code;
			searchUser.authService.doubleAuth.valid = valid;
			searchUser.registrationProcessEnded = valid;
		}
		return (valid);
	}

	async	hashPassword(password: string, id: number)
	{
		const	saltRounds = 10;
		const	index = this.user.findIndex((elem) =>
		{
			return (id === elem.id);
		});
		const	hashed = await bcrypt.hash(password, saltRounds);
		if (hashed)
			this.user[index].password = hashed;
		// .then((hash) =>
		// {
		// 	this.user[index].password = hash;
		// 	return (hash);
		// })
		// .catch((err) =>
		// {
		// 	console.log(err);
		// 	return ("ERROR");
		// });
		console.log("le test ", hashed);
		return (hashed);
	}

	async	decodePassword(password: string, id: any, email: any)
	{
		const	index = this.user.findIndex((elem) =>
		{
			return (elem.id.toString() === id.toString() && elem.email === email);
		});
		if (index === -1)
			return ("ERROR");
		console.log(password, " ", this.user[index].password);
		const	valid = await bcrypt.compare(password, this.user[index].password)
		.then(() =>
		{
			const ret =	{
				token: "Bearer " + jwt.sign(
				{
					id: id,
					email: email
				},
				this.getSecret(),
				{
					expiresIn: "1d"
				}),
				expAt: Date.now() + (1000 * 60 * 60 * 24),
				index: index
			};
			if (ret === undefined)
				return ("ERROR");
			return (ret);
		})
		.catch((err) =>
		{
			console.log(err);
			return ("ERROR");
		});
		return (valid);
	}

	public	changeInfos(data: any, id: string)
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUser !== undefined)
		{
			if (data.info?.length)
				if (data.field === "username" && data.info !== searchUser.username)
					searchUser.username = data.info;
				else if (data.field === "email" && data.info !== searchUser.email)
					searchUser.email = data.info;
				else if (data.field === "phoneNumber" && data.info !== searchUser.authService.doubleAuth.phoneNumber)
					searchUser.authService.doubleAuth.phoneNumber = data.info;
				else if (data.field === "password")
					this.decodePassword(data.info, id, searchUser.email);

			console.log(searchUser);
			return ("okay");
		}
		return ("user doesnt exist");
	}
	public	addUserAsFriend(friendId: string, id: string)
	{
		const	searchFriend = this.user.find((elem) =>
		{
			return (elem.id === friendId);
		});
		const	searchUserIndex = this.user.findIndex((elem) =>
		{
			return (elem.id === id);
		});
		if (searchUserIndex !== -1)
			return ("User doesnt exist");
		if (searchFriend === undefined)
			return ("This new friend doesnt exist");
		// this.user[searchUserIndex].friends.push(searchFriend);
		return (searchFriend.username + " added as friend");
	}

	public getNumberOfUserWithUsername(username : string)
		: number
	{
		this.logger.debug("username: " + username);
		// this.logger.error("NOT an error");
		// console.log("here is data ", this.user);
		// this.logger.error("NOT an error");
		const count = this.user.filter((obj) =>
		{
			return (obj.username === username);
		}).length;
		// console.log("count array : ", count);
		return (
			count
		);
	}

	public	async updateUser(userId: number, body: RegisterStepOneDto)
		: Promise<string>
	{
		const index = this.user.findIndex((user) =>
		{
			return (userId === user.id);
		});
		if (index === -1)
			return ("ERROR");
		this.user[index].username = body.username;
		await this.hashPassword(body.password, this.user[index].id);
		if (this.user[index].password === "undefined" || this.user[index].password === undefined)
			return ("ERROR");
		return ("okay");
	}
}
