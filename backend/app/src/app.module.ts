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
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";

import { join } from "path";
import { GameApiModule } from "./game-api/game-api.module";
import { GameApiController } from "./game-api/game-api.controller";
import { GameApiService } from "./game-api/game-api.service";
import { PrismaModule } from "./prisma/prisma.module";
// may change on prod (folder dist)
const	pictureFolder = join(__dirname, "..", "/public/profilePictures");
const	assetsFolder = join(__dirname, "..", "/public/assets");

@Module(
{
	imports:
	[
		AdminsModule,
		ChatModule,
		GameSocketModule,
		AnonymousUserModule,
		UserModule,
		PrismaModule,
		ServeStaticModule
			.forRoot({
				serveRoot: "/cdn/image/profile",
				rootPath: pictureFolder,
				serveStaticOptions:
				{
					index: false
				}
			}),
		ServeStaticModule
			.forRoot({
				serveRoot: "/cdn/image/assets",
				rootPath: assetsFolder,
				serveStaticOptions:
				{
					index: false
				}
			}),
		GracefulShutdownModule
			.forRoot({
				cleanup: async (app : any) =>
				{
				},
				gracefulShutdownTimeout:
					Number(process.env.GRACEFULL_SHUTDOWN_TIMEOUT ?? 10000),
				keepNodeProcessAlive: true,
			}),
	],
	controllers: [
		AppController,
		AnonymousUserController,
		AdminsController,
		ChatApiController,
		GameApiController,
		UserController
	],
	providers: [
		AppService,
		AdminsService,
		ChatApiModule,
		ChatApiService,
		GameApiService,
		GameApiModule
	],
})

export class AppModule implements OnApplicationBootstrap
{
	private readonly	logger = new Logger("app-module");

	onApplicationBootstrap()
	{
	}
}
