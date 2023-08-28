import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
	AnonymousUserService
} from "./anonymous-user/anonymous-user.service";
import { AdminsModule } from './admins/admins.module';
import
{
	AnonymousUserController
}	from "./anonymous-user/anonymous-user.controller";
import { AdminsService } from "./admins/admins.service";
import { AdminsController } from "./admins/admins.controller";


@Module(
{
	imports: [AdminsModule],
	controllers: [
		AppController,
		AnonymousUserController,
		AdminsController
	],
	providers: [
		AppService,
		AnonymousUserService,
		AdminsService
	],
})

export class AppModule
{
}
