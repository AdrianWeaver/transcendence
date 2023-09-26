/* eslint-disable max-len */
import {
	Injectable
}	from "@nestjs/common";
import Chat from "./Objects/Chat";
import User from "./Objects/User";
import Channel from "./Objects/Channel";

export interface MessageRoomModel
{
	"roomName": string,
	// private msg or channel:
	"privateConv": boolean,
	"content": string[]
}
export	interface ChatUserModel
{
	"name": string,
	"id": string,
	"avatar": string,
	"msgRoom": MessageRoomModel[]
}
@Injectable()
export	class ChatService
{
	// data here 
	private	chat: Chat;

	constructor()
	{
		this.chat = new Chat();
	}

	public	getChat(): Chat
	{
		return (this.chat);
	}

	// search users and sockets

	public	searchUser(clientId: string)
	{
		const searchUser = this.chat.users.find((element) =>
		{
			return (element.id === clientId);
		});
		return (searchUser);
	}

	public	searchUserIndex(clientId: string)
	{
		const	userIndex = this.chat.users.findIndex((element) =>
		{
			return (element.id === clientId);
		});
		return (userIndex);
	}

	public	searchSocketIndex(clientId: string)
	{
		const	searchSocket = this.chat.memberSocketIds.findIndex((element) =>
		{
			return (element === clientId);
		});
		return (searchSocket);
	}

	// add and delete a user

	public	pushUser(newUser: User, clientId: string)
	{
		this.chat.users.push(newUser);
		this.chat.memberSocketIds.push(clientId);
	}

	public	deleteUser(userIndex: number, userSocket: number)
	{
		this.chat.users.splice(userIndex, 1);
		this.chat.memberSocketIds.splice(userSocket, 1);
	}

	// channel functions

	public	addNewChannel(newChannel: Channel)
	{
		this.chat.channels.push(newChannel);
	}

	public	getAllUsers()
	{
		const	users: ChatUserModel[] = [];

		this.chat.users.map((element) =>
		{
			const user = {
				name: element.name,
				id: element.id,
				avatar: "https://thispersondoesnotexist.com/",
				msgRoom: []
			};
			users.push(user);
		});
		return (users);
	}

	public	sendMessageToUser(user: User)
	{
		this.searchUserIndex(user.id);
	}

	// public	sentMessageToChannel(channel: Channel)
	// {

	// }

}
