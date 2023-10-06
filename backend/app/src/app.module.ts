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
import { GameSocketModule } from "./game-socket/game-socket.module";
import { ChatModule } from "./chat/chat.module";
import { ChatApiModule } from "./chat-api/chat-api.module";
import { ChatApiController } from "./chat-api/chat-api.controller";
import { ChatApiService } from "./chat-api/chat-api.service";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { AnonymousUserModule } from "./anonymous-user/anonyous-user.module";


@Module(
{
	imports:
	[
		AdminsModule,
		ChatModule,
		AnonymousUserModule
	],
	controllers: [
		AppController,
		// AnonymousUserController,
		AdminsController,
		ChatApiController,
		UserController
	],
	providers: [
		AppService,
		// AnonymousUserService,
		UserService,
		AdminsService,
		ChatApiModule,
		ChatApiService
	],
})

export class AppModule
{
}
