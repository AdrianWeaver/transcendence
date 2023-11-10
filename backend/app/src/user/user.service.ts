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
	OnModuleDestroy,
	OnModuleInit
} from "@nestjs/common";
import
{
	AdminResponseModel,
	BackUserModel,
	HistoryModel,
	UserLoginResponseModel,
	UserModel,
	UserPublicResponseModel,
	UserRegisterResponseModel,
} from "./user.interface";
import { v4 as uuidv4 } from "uuid";

import { randomBytes } from "crypto";
import	* as jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

import axios from "axios";
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
import * as bcrypt from "bcrypt";
import { RegisterStepOneDto } from "./user.controller";
import ServerConfig from "../serverConfig";
import { Subject } from "rxjs";
import { FriendsModel } from "src/chat/ChatSocketEvent";


@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy
{
	private	user: Array<UserModel> = [];
	private	matchHistory: Array<HistoryModel> = [];
	private	secret: string;
	// private	userDB: Array<UserDBModel> = [];
	// private userDBString: Array<string> = [];

	private	prisma: PrismaClient;
	private readonly secretId = "user-service-secret";
	private readonly logger = new Logger("user-service itself");
	private readonly uuidInstance = uuidv4();
	private	readonly	cdnConfig = new ServerConfig();
	private			shutdown$ = new Subject<string>();
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
			// TEST
		this.prisma = new PrismaClient();
		this.logger.log("Base instance loaded with the instance id: "
			+ this.getUuidInstance());
		this.loadSecretFromDB();
	}

	private	generateSecretForDB()
	{
		const	toDB = {
			"secret_id": this.secretId,
			"value": randomBytes(64).toString("hex")
		};
		this.prisma.secretTable
			.create(
				{
					data: toDB
				}
			).then(() =>
			{
				this.loadSecretFromDB();
			})
			.catch((error: any) =>
			{
				this.logger.error(error);
			});
	}

	private	loadSecretFromDB()
	{
		this.prisma
			.secretTable
			.findUnique({
				where:
				{
					// eslint-disable-next-line camelcase
					secret_id: this.secretId,
				}
			}).then((data: any) =>
			{
				this.logger.debug("Next line is for database");
				this.logger.debug(typeof data);
				this.logger.debug(data);
				if (data === null)
				{
					this.logger.log("data is eq to null");
					this.generateSecretForDB();
				}
				else
				{
					this.logger.log("data is provided");
					this.secret = data?.value;
					this.logger.error("Secret : " + this.secret);
				}
			})
			.catch((error: any) =>
			{
				this.logger.error(error);
				this.triggerShutDown("Secret error form database ");
			})
			.finally(() =>
			{
				this.logger.debug("end of load into database ");
			});
	}

	public	async createUserToDatabase(user: UserModel)
		: Promise<string>
	{
		this.logger.debug("Create the user into the table User");
		const	toDB = this.prepareUserForDB(user.id.toString());

		const status = await this.prisma
			.userJson
			.create(
			{
				data:
				{
					userJsonID: user.id.toString(),
					contents: JSON.stringify(toDB)
				}
			})
			.then(() =>
			{
				this.logger.verbose("user succesfully created ");
				return ("SUCCESS");
			})
			.catch((error: any) =>
			{
				this.logger.error("On table Create User error");
				this.logger.error(error);
				return ("ERROR");
			});
		this.logger.debug("value of status " + status);
		return (status);
	}

	private onTableCreate(user: UserModel)
	{
		this.logger.verbose("Creating a new version User inside database");
			this.prisma
				.userJson
				.findUnique(
					{
						where:
							{
								userJsonID: user.id.toString()
							}
					}
				)
				.then((data: any) =>
				{
					if (data)
					{
						const	content = JSON.parse(data.contents);
						// console.log("content ", content);
						const	update = this.prepareUserForDB(user.id);
						this.prisma
							.userJson
							.update(
								{
									where:
									{
										userJsonID: user.id.toString()
									},
									data: {
										contents: JSON.stringify(update)
									}
								}
							);
					}
					else
					{
						const	toDB = this.prepareUserForDB(user.id.toString());
						this.prisma
							.userJson
							.create(
							{
								data:
								{
									userJsonID: user.id.toString(),
									contents: JSON.stringify(toDB)
								}
							})
							.catch((error: any) =>
							{
								this.logger.error("On table Create User error");
								this.logger.error(error);
							});
					}
				})
				.catch((error) =>
				{
					console.log("error create entry", error);
				});
	}

	private	loadTableToMemory()
	{
		// return ;
		this.prisma
			.userJson
			.findMany({})
			.then((data: any) =>
			{
				if (data !== null)
				{
					const	array = data;
					array.forEach((elem: any) =>
					{
						const	rawObj = JSON.parse(elem.contents);
						// // TEST at home, I need to do this:
						// const stringObj = JSON.parse(elem.contents);
						// const	rawObj = JSON.parse(stringObj);
						// console.log("rawObj user", rawObj);
						this.databaseToObject(rawObj);
					});
				}
			})
			.catch((error: any) =>
			{
				console.log(error);
			});
	}

	async onModuleInit()
	{
		console.log("GET USER BACK FROM DB");
		console.log("heer ", this.cdnConfig.uri);
		this.loadTableToMemory();
		await this.checkPermalinks();
		this.checkIOAccessPath(this.publicPath);
		this.checkIOAccessPath(this.publicPathLarge);
		this.checkIOAccessPath(this.publicPathMedium);
		this.checkIOAccessPath(this.publicPathSmall);
		this.checkIOAccessPath(this.publicPathMicro);
		this.checkIOAccessPath(this.publicPathTemp);
	}

	public	triggerShutDown(stringReason: string)
	{
		this.logger.error("Server will shuting down reason: " + stringReason);
		this.shutdown$.next(stringReason);
	}

	public	getShutdown$()
	{
		return (this.shutdown$);
	}

	public onModuleDestroy()
	{
		//  cleaning here
		this.logger.debug("The application is closing connection");
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
				// console.log(compareFromDB);
				const requestedCmp = await JSON.parse(actualServerCfg.serialize());
				// console.log(requestedCmp);
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
		{
			this.logger.error("Production file must have server config environnement");
			this.triggerShutDown("ENVIRONNEMENT UNSETTED");
		}
		else
		{
			// await this.isHavingPreviousPermalinks(test);
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
		const	searchUser = this.user.find((elem) =>
		{
			const	user = {
				id: elem.id,
				email: elem.email,
				username: elem.username,
				firstName: elem.firstName,
				lastName: elem.lastName,
				avatar: elem.avatar,
				location: elem.location,
			};
			users.push(user);
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
						avatar: this.cdnConfig.uri + ":3000/cdn/image/profile/" + userObj.username + ".jpeg",
						ftAvatar:
						{
							link: this.cdnConfig.uri + ":3000/cdn/image/profile/" + userObj.username + ".jpeg",
							version:
							{
								large: this.cdnConfig.uri + ":3000/cdn/image/profile/large/" + userObj.username + ".jpeg",
								medium: this.cdnConfig.uri + ":3000/cdn/image/profile/medium/" + userObj.username + ".jpeg",
								mini: this.cdnConfig.uri + ":3000/cdn/image/profile/micro/" + userObj.username + ".jpeg",
								small: this.cdnConfig.uri + ":3000/cdn/image/profile/small/" + userObj.username + ".jpeg",
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
			// console.log(metadata);
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

	public	registerFortyThree(data: UserModel)
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
		registrationStarted: true,
		registrationProcessEnded: false,
		ftApi: data.ftApi,
		retStatus: data.retStatus,
		date: data.date,
		id: data.id,
		email: data.email,
		username: data.username,
		login: data.login,
		online: data.online,
		status: data.status,
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
		password: data.password,
		friendsProfileId: []
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
		registrationStarted: true,
		registrationProcessEnded: false,
		ftApi: data.ftApi,
		retStatus: data.retStatus,
		date: data.date,
		id: data.id,
		email: data.email,
		username: data.username,
		login: data.login,
		online: data.online,
		status: data.status,
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
		password: data.password,
		friendsProfileId: []
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
		console.log("Hash password id ", id);
		const	index = this.user.findIndex((elem) =>
		{
			return (id.toString() === elem.id.toString());
		});
		if (index === -1)
			throw new Error("User not found - hashPassword user.service");
		const	hashed = await bcrypt.hash(password, saltRounds);
		if (hashed)
			this.user[index].password = hashed;
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
			this.user[index].authService.token = ret.token;
			this.user[index].authService.expAt = ret.expAt;
			return (ret);
		})
		.catch((err) =>
		{
			console.log(err);
			return ("ERROR");
		});
		console.log("valid password ?", valid);
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

			// console.log(searchUser);
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
		const	searchFriendIndex = this.user.findIndex((elem) =>
		{
			return (elem.id === friendId);
		});
		if (searchFriendIndex !== -1)
			return ("Friend doesnt exist");
		// this.user[searchUserIndex].friends.push(searchFriend);
		this.user[searchUserIndex].friendsProfileId.push(friendId);
		this.user[searchFriendIndex].friendsProfileId.push(id);
		return (searchFriend.username + " added as friend");
	}

	public getNumberOfUserWithUsername(username : string)
		: number
	{
		this.logger.debug("username: " + username);
		const count = this.user.filter((obj) =>
		{
			return (obj.username === username);
		}).length;
		return (count);
	}

	public	async updateUser(userId: number, body: RegisterStepOneDto, registerStepOne: boolean)
		: Promise<string>
	{
		const index = this.user.findIndex((user) =>
		{
			return (userId === user.id);
		});
		if (index === -1)
			return ("ERROR");
		this.user[index].username = body.username;
		this.user[index].online = true;
		this.user[index].status = "online";
		await this.hashPassword(body.password, this.user[index].id);
		if (this.user[index].password === "undefined" || this.user[index].password === undefined)
			return ("ERROR");
		return ("okay");
	}

	public	addFriends(myProfileId: any, targetProfileId: any)
		: string
	{
		const	myUserIndex = this.user.findIndex((user) =>
		{
			return (user.id.toString() === myProfileId.toString());
		});
		const	targetUserIndex = this.user.findIndex((user) =>
		{
			return (user.id.toString() === targetProfileId.toString());
		});
		if (myUserIndex === -1 || targetUserIndex === -1)
			return ("ERROR");
		else
		{
			const findProfileIndex = this.user[myUserIndex]
				.friendsProfileId
				.findIndex((elem) =>
				{
					return (elem === targetProfileId.toString());
				});
			if (findProfileIndex === -1)
			{
				this.user[myUserIndex].friendsProfileId.push(targetProfileId.toString());
				// console.log("addFriedns user serv isFriend ", this.user[myUserIndex].friendsProfileId);
			}
			else
			{
				return ("ALREADY_FRIENDS");
			}
		}
		return ("SUCCESS");
	}

	public	getFriendsProfileId(myProfileId: any)
	: Array<string>
	{
		const	myUserIndex = this.user.findIndex((user) =>
		{
			return (user.id.toString() === myProfileId.toString());
		});
		if (myUserIndex === -1)
			return ([]);
		const	array = [...this.user[myUserIndex].friendsProfileId];
		return (array);
	}

	public	getFriendModel(profileIdRequested: any, index: number)
		: FriendsModel | undefined
	{
		const	myUserIndex = this.user.findIndex((user) =>
		{
			return (user.id.toString() === profileIdRequested.toString());
		});
		if (myUserIndex === -1)
			return (undefined);
		const friend: FriendsModel = {
			id: index,
			name: this.user[myUserIndex].username,
			profileId: this.user[myUserIndex].id,
		};
		return (friend);
	}

	public	getFriendName(profileIdRequested: any)
		: string
	{
		const	myUserIndex = this.user.findIndex((user) =>
		{
			return (user.id.toString() === profileIdRequested.toString());
		});
		if (myUserIndex === -1)
			return ("undefined");
		return (this.user[myUserIndex].username);
	}
	// public	doIHaveFriendRequest	

	public	prepareUserForDB(userId: any)
	{
		const	user = this.user.find((elem) =>
		{
			return (userId.toString() === elem.id.toString());
		});
		if (user === undefined)
			throw new Error("user prepareUserForDB not found");
		// UserModel stringified
		const	objToDB: UserModel = {
			// date of creation - 1h
			registrationStarted: user.registrationStarted,
			ftApi: {...user.ftApi},
			registrationProcessEnded: user.registrationProcessEnded,
			retStatus: user.retStatus,
			date: user.date,
			id: user.id,
			email: user.email,
			username: user.username,
			login: user.login,
			online: user.online,
			status: user.status,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
			ftAvatar: user.ftAvatar,
			location: user.location,
			url: user.url,
			authService: {...user.authService},
			password: user.password,
			friendsProfileId: [...user.friendsProfileId],
			revokedConnectionRequest: user.revokedConnectionRequest
		};
		// this.userDB.push(objToDB);
		const	toDB = JSON.stringify(objToDB);
		// this.userDBString.push(toDB);
		// console.log("create User ready for db ", user);
		// console.log("create User to db ", objToDB);
		// console.log("create USER STRINGIFIED", toDB);
		return (objToDB);
	}

	// public	updateUserForDB(userId: number)
	// 	: UserDBModel | string
	// {
	// 	const	user = this.user.find((elem) =>
	// 	{
	// 		return (userId.toString() === elem.id.toString());
	// 	});
	// 	// TEST 
	// 	if (user === undefined)
	// 		return ("error");
	// 	console.log("user ok");
	// 	const	userDB = this.userDB.find((elem) =>
	// 	{
	// 		return (userId.toString() === elem.id.toString());
	// 	});
	// 	// TEST 
	// 	if (userDB === undefined)
	// 	{
	// 		this.onTableCreate(user);
	// 		return ("ok");
	// 	}
	// 	console.log("userDB ok");
	// 	// or throw error ?
	// 	const	index = this.userDB.findIndex((elem) =>
	// 	{
	// 		return (userId.toString() === elem.id.toString());
	// 	});
	// 	// TEST 
	// 	if (index === -1)
	// 		return ("error");
	// 	console.log("userDB index ok");
	// 	userDB.date = user.date,
	// 	userDB.id = user.id,
	// 	userDB.email = user.email,
	// 	userDB.username = user.username,
	// 	userDB.login = user.login,
	// 	userDB.firstName = user.firstName,
	// 	userDB.lastName = user.lastName,
	// 	userDB.avatar = user.avatar,
	// 	userDB.ftAvatar = user.ftAvatar,
	// 	userDB.location = user.location,
	// 	userDB.doubleAuth = {...user.authService.doubleAuth};
	// 	userDB.password = user.password;
	// 	userDB.friendsProfileId = [...user.friendsProfileId];
	// 	const	toDB = JSON.stringify(userDB);
	// 	this.userDBString[index] = toDB;
	// 	console.log("update User updated for db ", user);
	// 	console.log("update User updated to db ", userDB);
	// 	console.log("update USER STRINGIFIED", this.userDBString);
	// 	return (userDB);
	// }

	public	databaseToObject(data: any)
	{
		// const	array = [...this.userDBString];
		const	newUsers: UserModel[] = [];

		const	toObj: UserModel = {
			registrationStarted: data.registrationStarted,
			registrationProcessEnded: data.registrationProcessEnded,
			ftApi: data.ftApi,
			retStatus: data.retStatus,
			date: data.date,
			id: data.id,
			email: data.email,
			username: data.username,
			login: data.login,
			online: data.online,
			status: data.status,
			firstName: data.firstName,
			lastName: data.lastName,
			url: data.url,
			avatar: data.avatar,
			ftAvatar: data.ftAvatar,
			location: data.location,
			// TEST I dont know if its important to keep it
			revokedConnectionRequest: false,
			authService:
			{
				// Do we get a new token here or in the route with login ?
				// token: "Bearer " + jwt.sign(
				// 	{
				// 		id: data.id,
				// 		email: data.email
				// 	},
				// 	this.secret,
				// 	{
				// 		expiresIn: "1d"
				// 	}
				// ),
				token: data.token,
				expAt: data.expAt,
				doubleAuth:
				{
					enable: data.enable,
					lastIpClient: data.lastIpClient,
					phoneNumber: data.phoneNumber,
					phoneRegistered: data.phoneRegistered,
					validationCode: data.validationCode,
					valid: data.valid,
				}
			},
			password: data.password,
			friendsProfileId: [...data.friendsProfileId]
		};
		// console.log("BACK TO OBJ", toObj);
		newUsers.push(toObj);
		// console.log("new users", newUsers);
		this.user = [...newUsers];
		// console.log("THIS USERS", this.user);
	}

	public	isProfileIDUnique(profileID: number | string)
	: boolean
	{
		const	searchUser = this.user.find((elem) =>
		{
			return (profileID === elem.id);
		});
		if (searchUser !== undefined)
			return (false);
		return (true);
	}

	public	validateRegistration(userId: string | number)
	: boolean
	{
		console.log("VALIDATE REGISTRATION", userId);
		const	index = this.user.findIndex((elem) =>
		{
			return (userId.toString() === elem.id.toString());
		});
		if (index === -1)
			return (false);
		this.user[index].registrationProcessEnded = true;
		console.log("User registration ended ? ", this.user[index].registrationProcessEnded);
		return (true);
	}

	public	getMyStats()
	{
		const fakeRows = [
			{
				id: 1,
				date: "Yesterday Night",
				gameMode: "classical",
				adversaire: "Adversaire 1 (username)",
				myScore: "7",
				advScore: "0",
				elapsedTime: "42 secondes",
				myAvatar: "https://thispersondoesnotexist.com/",
				adversaireAvatar: "https://thispersondoesnotexist.com/"
			},
			{
				id: 2,
				date: "Yesterday ",
				gameMode: "classical",
				adversaire: "Adversaire 1 (username)",
				myScore: "7",
				advScore: "0",
				elapsedTime: "42 secondes",
				myAvatar: "https://thispersondoesnotexist.com/",
				adversaireAvatar: "https://thispersondoesnotexist.com/"
			},
			{
				id: 3,
				date: "Toto",
				gameMode: "classical",
				adversaire: "Adversaire 1 (username)",
				myScore: "7",
				advScore: "0",
				elapsedTime: "42 secondes",
				myAvatar: "https://thispersondoesnotexist.com/",
				adversaireAvatar: "https://thispersondoesnotexist.com/"
			},
		];
		return (fakeRows);
	}
}
