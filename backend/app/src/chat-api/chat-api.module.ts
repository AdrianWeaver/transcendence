import { Module } from "@nestjs/common";
import { ChatService } from "../chat/Chat.service";
// import { ChatApiController } from "./chat-api.controller";
import { ChatApiService } from "./chat-api.service";

@Module({
	imports: [ChatService],
	providers: [ChatApiService]
})

export class ChatApiModule
{}
