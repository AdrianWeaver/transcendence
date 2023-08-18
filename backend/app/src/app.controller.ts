import { Controller, Get, OnModuleInit } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController implements OnModuleInit
{

	onModuleInit()
	{
		console.log("The module AppController has been initialized");
	}

	constructor(private readonly appService: AppService)
	{

	}

	@Get("/server-status")
	getServerStatus(): {success: string, availableSince: string}
	{
		return (this.appService.getServerStatus());
	}

	@Get()
	getHello(): string
	{
		console.log("A user request the root of the api");
		return this.appService.getHello();
	}
}
