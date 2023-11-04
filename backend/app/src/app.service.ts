import { Injectable, Logger } from "@nestjs/common";
import Configuration from "./Configuration";


@Injectable()
export class AppService
{
	private	startedAt: Date;
	private config: Configuration;
	private	authApiUrl: string;
	private logger = new Logger("App-Service");

	constructor()
	{
		this.startedAt = new Date();
		this.config = new Configuration();
		this.authApiUrl = this.config.getFtAuthURL();
		this.logger.log("auth link generated: " + this.authApiUrl);
	}

	getServerStatus()
		: {
			success: string,
			availableSince: string,
			links: {authApiUrl : string}
		}
	{
		return (
			{
				success: "connection established",
				availableSince: this.startedAt.toString(),
				links:
				{
					authApiUrl: this.authApiUrl
				}
			}
		);
	}

	getAuthLink () : string
	{
		return (this.authApiUrl);
	}

	getHello(): string
	{
		return ("Hello World!");
	}
}
