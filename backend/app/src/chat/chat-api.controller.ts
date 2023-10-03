import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { ChatService, ChatUserModel} from "../chat/Chat.service";
import Chat from "./Objects/Chat";

@Controller("chat-api/v2")
export class ChatApiController
{
	private readonly logger;
	constructor(private readonly chatService: ChatService)
	{
		this.logger = new Logger("chat-api controller");
	}

	@Get("")
	getChatApiStatus() : ChatUserModel[]
	{
		this.logger.log("information from service ",
			this.chatService.getAllUsers()
		);
		return (this.chatService.getAllUsers());
	}

	@Get("get-all")
	getAllData(): Chat
	{
		return (this.chatService.getChat());
	}
}
