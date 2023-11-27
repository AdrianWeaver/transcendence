/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import * as bodyParser from "body-parser";
import { ValidationPipe } from "@nestjs/common";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { NestExpressApplication } from "@nestjs/platform-express";
import { UserService } from "./user/user.service";
import Configuration from "./Configuration";


async function bootstrap()
{
	const	configTest = new Configuration();

	if ( await configTest.isValidConfiguration() === false)
	{
		return ;
	}
	const	app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
	});
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.useGlobalPipes(new ValidationPipe());
	app.set("trust proxy", true);
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
