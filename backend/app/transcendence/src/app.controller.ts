import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController
{
	constructor(
		private readonly appService: AppService)
	{

	}

	@Get()
	getHello(): string
	{
		console.log("A user request the root of the api");
		return this.appService.getHello();
	}
}
