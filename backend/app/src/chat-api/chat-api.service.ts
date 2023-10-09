import { Injectable, Logger } from "@nestjs/common";
import { ChatService, ChatUserModel } from "../chat/Chat.service";

@Injectable()
export class ChatApiService
{
	private	log = new Logger("api-chat-service");
	constructor(private readonly chatService: ChatService)
	{
		this.log.debug("adapter of websocket instance id :"
			+ this.chatService.getChatInstanceId());
	}

	public	getAllUsers() : ChatUserModel[]
	{
		return (this.chatService.getAllUsers());
	}
}
