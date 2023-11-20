import { Module } from "@nestjs/common";
import { ChatSocketEvents } from "./ChatSocketEvent";
import { ChatService } from "./Chat.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { GameService } from "src/game-socket/Game.service";
import { GameSocketModule } from "src/game-socket/game-socket.module";
import { PrismaModule } from "src/prisma/prisma.module";

// import { ChatApiController } from "./chat-api.controller";

@Module({
	imports: [
		UserModule,
		GameSocketModule,
		PrismaModule,
	],
	providers:
	[
		ChatSocketEvents,
		ChatService
	],
	exports: [ChatService]
})
export class ChatModule
{}
