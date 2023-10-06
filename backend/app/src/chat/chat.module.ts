import { Module } from "@nestjs/common";
import { ChatSocketEvents } from "./ChatSocketEvent";
import { ChatService } from "./Chat.service";
// import { ChatApiController } from "./chat-api.controller";

@Module({
	providers:
	[
		ChatSocketEvents,
		ChatService
	],
	exports: [ChatService]
})
export class ChatModule
{}
