import { Injectable, Logger } from "@nestjs/common";
import { ChatService, ChatUserModel } from "../chat/Chat.service";

@Injectable()
export class ChatApiService
{
	private logger = new Logger("chat-api-service");
	constructor(private readonly chatService: ChatService)
	{
		this.logger.log("API service from chat websocket started");
	}

	public	getUserArray() : ChatUserModel[]
	{
		return (this.chatService.getAllUsers());
	}
}
