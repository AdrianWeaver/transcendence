/* eslint-disable max-statements */
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


type ChanMapModel = {
    id: number,
    name: string,
	mode: string
};

@Injectable()
export	class ChatService
{
	// data here 
	private	chat: Chat;

	constructor()
	{
		this.chat = new Chat();
	}

	// getters

	public	getChat(): Chat
	{
		return (this.chat);
	}

	public getChannels(): Channel[]
	{
		return (this.chat.channels);
	}

	public getChanMap(): ChanMapModel[]
	{
		return (this.chat.chanMap);
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

	public	addNewChannel(newChannel: Channel, chanId: number)
	{
		this.chat.channels.push(newChannel);
		const newElement: ChanMapModel = {
			id: chanId,
			name: newChannel.name,
			mode: newChannel.mode

		};
		this.chat.chanMap.push(newElement);
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

	public deleteChannel(chanName: string)
	{
		const	index = this.chat.channels.findIndex((element) =>
		{
			return (element.name === chanName);
		});
		this.chat.channels.splice(index, 1);
		let i: number;
		i = 0;
		for (const chanMap of this.chat.chanMap)
		{
			if (chanMap.name === chanName)
			{
				this.chat.chanMap.splice(i, 1);
				break ;
			}
			i++;
		}
	}

	public	searchChannelByName(chanName: string)
	{
		const	searchChannel = this.chat.channels.find((element) =>
		{
			return (element.name === chanName);
		});
		return (searchChannel);
	}
}
