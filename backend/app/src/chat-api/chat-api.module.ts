import { Module } from "@nestjs/common";
import { ChatService } from "../chat/Chat.service";

@Module({
	imports: [ChatService],
	providers: []
})

export class ChatApiModule
{}
