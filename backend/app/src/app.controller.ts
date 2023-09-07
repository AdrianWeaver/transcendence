import { Controller, Get, Logger, OnModuleInit } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController implements OnModuleInit
{
	private readonly logger;
	onModuleInit()
	{
		this.logger.log("The module AppController has been initialized");
	}

	constructor(private readonly appService: AppService)
	{
		this.logger = new Logger("main controlelr");
	}

	@Get("/server-status")
	getServerStatus(): {success: string, availableSince: string}
	{
		this.logger.log("User request /server-status here");
		return (this.appService.getServerStatus());
	}

	@Get()
	getHello(): string
	{
		this.logger.log("A user request the root of the api");
		return this.appService.getHello();
	}
}
