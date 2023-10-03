import { Module } from "@nestjs/common";
import { ChatService } from "../chat/Chat.service";
import { ChatApiService } from "./chat-api.service";
import { ChatApiController } from "./chat-api.controller";

@Module({
	imports: [ChatService],
	providers:
	[
		ChatApiService,
		ChatApiController
	]
})

export class ChatApiModule
{
}
