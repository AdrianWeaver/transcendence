import { Logger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

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
import { AnonymousUserModule } from "./anonymous-user/anonyous-user.module";
import { UserModule } from "./user/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { dirname, join } from "path";

// may change on prod (folder dist)
const	pictureFolder = join(__dirname, "..", "/public/profilePictures");

@Module(
{
	imports:
	[
		AdminsModule,
		ChatModule,
		AnonymousUserModule,
		UserModule,
		ServeStaticModule
			.forRoot({
				serveRoot: "/cdn/image/profile",
				rootPath: pictureFolder,
				serveStaticOptions:
				{
					index: false
				}
			}),
	],
	controllers: [
		AppController,
		AnonymousUserController,
		AdminsController,
		ChatApiController,
		UserController
	],
	providers: [
		AppService,
		// UserService,
		AdminsService,
		ChatApiModule,
		ChatApiService
	],
})

export class AppModule implements OnApplicationBootstrap
{
	private readonly	logger = new Logger("app-module");

	onApplicationBootstrap()
	{
		this.logger.verbose("DIRECTORY: " + pictureFolder);
	}
}
