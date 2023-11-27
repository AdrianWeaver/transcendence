/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { PictureConfigModel } from "../user.service";
import ServerConfig from "../../serverConfig";


type CDNConfig = {
	avatar: string;
	ftAvatar:
	{
		link: string,
		version:
		{
			large: string,
			medium: string,
			mini: string,
			small: string,
		}
	}
};

type AssetConfig = {
	statusGameOnline: string;
	statusGameOffline: string;
	statusChatOnline: string;
	statusChatOffline: string;
};

class FileConfig
{
	private	acceptedType: boolean;
	private	extension: string;
	private	tempFolder: string;
	private	filename: string;
	private	buffer: Buffer[];
	private	pictureConfiguration: PictureConfigModel;
	private	serverConfig: ServerConfig;

	public	fullPath: () => string;
	public	configMimeType: (mimetype: string) => void;
	public	isAccepted: () => boolean;
	public	setTempFolder: (tempFolder: string) => void;
	public	setFilename: (filename: string) => void;
	public	addToBuffer: (data: Buffer) => void;
	public	getBuffer: () => Buffer;
	public	needConvertToJPEG: () => boolean;
	public	setPictureConfig: (pathCfg: PictureConfigModel) => void;
	public	getPathLarge: () => string;
	public	getPathMedium: () => string;
	public	getPathMicro: () => string;
	public	getPathSmall: () => string;
	public	getPathNormal: () => string;
	public	getPathTmpConverted: () => string;
	public	getCDNConfig: () => CDNConfig;
	public	getAssetsConfig: () => AssetConfig;

	constructor()
	{
		this.serverConfig = new ServerConfig();
		this.acceptedType = false;
		this.extension = "";
		this.tempFolder = "";
		this.filename = "";
		this.buffer = [];
		this.fullPath = () : string =>
		{
			return (this.tempFolder + "/" + this.filename + this.extension);
		};
		this.configMimeType = (mimetype: string) =>
		{
			if (mimetype === "image/jpeg")
			{
				this.extension = ".jpeg";
				this.acceptedType = true;
			}
			if (mimetype === "image/png")
			{
				this.extension = ".png";
				this.acceptedType = true;
			}
		};
		this.isAccepted = () =>
		{
			return (this.acceptedType);
		};
		this.setTempFolder = (tempFolder: string) =>
		{
			this.tempFolder = tempFolder;
		};
		this.setFilename = (filename: string) =>
		{
			this.filename = filename;
		};
		this.addToBuffer = (data: Buffer) =>
		{
			this.buffer.push(data);
		};
		this.getBuffer = () =>
		{
			return (Buffer.concat(this.buffer));
		};
		this.needConvertToJPEG = () =>
		{
			return (this.extension === ".png");
		};
		this.setPictureConfig = (pictureCfg: PictureConfigModel) =>
		{
			this.pictureConfiguration = pictureCfg;
		};
		this.getPathLarge = () =>
		{
			console.log("returning path Large");

			return (
				this.pictureConfiguration.path.large
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getPathMedium = () =>
		{
			console.log("returning path mediumm");

			return (
				this.pictureConfiguration.path.medium
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getPathMicro = () =>
		{
			console.log("returning path micro");

			return (
				this.pictureConfiguration.path.micro
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getPathSmall = () =>
		{
			console.log("returning path smmall");

			return (
				this.pictureConfiguration.path.small
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getPathNormal = () =>
		{
			console.log("returning path normal");
			return (
				this.pictureConfiguration.path.normal
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getPathTmpConverted = () =>
		{
			return (
				this.pictureConfiguration.tmpFolder
					+ "/" + this.filename + ".jpeg"
			);
		};
		this.getCDNConfig = () =>
		{
			const basecdn = this.serverConfig.protocol
				+ "://" + this.serverConfig.location
				+ ":" + this.serverConfig.port + "/cdn/image/profile/";
			return ({
				avatar: basecdn + this.filename + ".jpeg",
				ftAvatar:
				{
					link: basecdn + this.filename + ".jpeg",
					version:
					{
						large: basecdn + "large/" + this.filename + ".jpeg",
						medium: basecdn + "medium/" + this.filename + ".jpeg",
						mini: basecdn + "micro/" + this.filename + ".jpeg",
						small: basecdn + "small/" + this.filename + ".jpeg",
					}
				}
			});
		};
		this.getAssetsConfig = () =>
		{
			const	baseUrl = this.serverConfig.protocol
			+ "://" + this.serverConfig.location
			+ ":" + this.serverConfig.port + "/cdn/image/assets/";
			const	returnValue: AssetConfig = {
				statusGameOffline: baseUrl + "pong-offline.png",
				statusGameOnline: baseUrl + "pong-online.png",
				statusChatOffline: baseUrl + "user-offline.png",
				statusChatOnline: baseUrl + "user-online.png",
			}
			return (returnValue);
		};
	}
}

export default FileConfig;
