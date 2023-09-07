import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService
{
	private	startedAt: Date;

	constructor()
	{
		this.startedAt = new Date();
	}

	getServerStatus() : {success: string, availableSince: string}
	{
		return (
			{
				success: "connection established",
				availableSince: this.startedAt.toString()
			}
		);
	}

	getHello(): string
	{
		return ("Hello World!");
	}
}
