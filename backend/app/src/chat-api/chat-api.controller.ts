import { Controller, Get, Logger } from "@nestjs/common";
import { ChatApiService } from "./chat-api.service";

@Controller("api/chat")
export class ChatApiController
{
	private readonly logger = new Logger("api-chat-controller");
	constructor(private readonly chatApiService: ChatApiService)
	{
		this.logger
			.log("instanciate controller for the chat API's with instance id:"
				+ this.chatApiService.getUuidInstance());
	}

	@Get("all-user")
	getAllUsersConnected()
	{
		return (this.chatApiService.getAllUsers());
	}
}
