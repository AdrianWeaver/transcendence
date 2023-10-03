import { Module } from "@nestjs/common";
import { ChatSocketEvents } from "./ChatSocketEvent";
import { ChatService } from "./Chat.service";
import { ChatApiController } from "./chat-api.controller";
// import { AuthorizationGuard} from "src/anonymous-user/anonymous-user.authorizationGuard";

@Module({
	controllers: [ChatApiController],
	providers:
	[
		ChatSocketEvents,
		ChatService,
		// AuthorizationGuard
	],
	exports:
	[ChatService]
})
export class ChatModule
{}
