/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import * as bodyParser from "body-parser";
import { ValidationPipe } from "@nestjs/common";

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
	await	app.listen(3000);
}

bootstrap();
