import { Controller, Logger } from "@nestjs/common";
import { ChatService } from "../chat/Chat.service";

@Controller("api/chat")
export class ChatApiController
{
	private readonly logger = new Logger("api-chat-controller");
	constructor(private readonly chatService: ChatService)
	{
		this.logger
			.debug("instanciate controller for the chat API's"
				+ " with instance id: " + chatService.getChatInstanceId());
	}
}
