/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import * as bodyParser from "body-parser";
import { ValidationPipe } from "@nestjs/common";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { UserService } from "./user/user.service";

async function bootstrap()
{
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
