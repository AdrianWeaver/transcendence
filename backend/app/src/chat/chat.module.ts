import { Module } from "@nestjs/common";
import { ChatSocketEvents } from "./ChatSocketEvent";
import { ChatService } from "./Chat.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
// import { ChatApiController } from "./chat-api.controller";

@Module({
	imports: [UserModule],
	providers:
	[
		ChatSocketEvents,
		ChatService,
	],
	exports: [ChatService]
})
export class ChatModule
{}
