/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import * as bodyParser from "body-parser";
import { ValidationPipe } from "@nestjs/common";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { UserService } from "./user/user.service";
import Configuration from "./Configuration";


async function bootstrap()
{
	const	configTest = new Configuration();

	if ( await configTest.isValidConfiguration() === false)
	{
		console.log("The configuration for the project "
			+ "is not okay -- goto help folder and $> npm run"
			+ " (to see command and configure project)");
		return ;
	}
	console.log("The configuration of the project is okay program will start");
	const	app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
	});
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.useGlobalPipes(new ValidationPipe());

	setupGracefulShutdown({app});

	const serviceUser = app.get(UserService);
	serviceUser.getShutdown$().subscribe(async () =>
	{
		setTimeout(async () =>
		{
			await app.close();
		}, 2000);
	});
	await	app.listen(3000);
}

bootstrap();
