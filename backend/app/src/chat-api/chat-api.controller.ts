import { Controller, Get, Logger } from "@nestjs/common";
import { ChatApiService } from "./chat-api.service";
import { ChatUserModel } from "../chat/Chat.service";

@Controller("api/chat")
export class ChatApiController
{
	private logger = new Logger("Controller chat api");
	constructor(private readonly chatService: ChatApiService)
	{
		this.logger.log("started");
	}

	@Get("user-list")
	getUserList() : ChatUserModel[]
	{
		return (this.chatService.getUserArray());
	}
}
