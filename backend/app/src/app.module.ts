import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
	AnonymousUserService
} from "./anonymous-user/anonymous-user.service";
import { AdminsModule } from "./admins/admins.module";
import
{
	AnonymousUserController
}	from "./anonymous-user/anonymous-user.controller";
import { AdminsService } from "./admins/admins.service";
import { AdminsController } from "./admins/admins.controller";
import { ChatModule } from "./chat/chat.module";
import { ChatService } from "./chat/Chat.service";
import { ChatApiService } from "./chat-api/chat-api.service";
import { ChatApiController } from "./chat-api/chat-api.controller";


@Module(
{
	imports:
	[
		AdminsModule,
		ChatModule,

	],
	controllers: [
		AppController,
		AnonymousUserController,
		AdminsController,
		ChatApiController
	],
	providers: [
		AppService,
		AnonymousUserService,
		ChatService,
		ChatApiService,
		AdminsService
	],
})

export class AppModule
{
}
