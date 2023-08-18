import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
	AnonymousUserService
} from "./anonymous-user/anonymous-user.service";
import
{
	AnonymousUserController
}	from "./anonymous-user/anonymous-user.controller";


@Module(
{
	imports: [],
	controllers: [
		AppController,
		AnonymousUserController
	],
	providers: [
		AppService,
		AnonymousUserService
	],
})

export class AppModule
{
}
