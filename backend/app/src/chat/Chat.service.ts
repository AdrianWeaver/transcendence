/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
	Injectable
}	from "@nestjs/common";
import Chat from "./Objects/Chat";
import User from "./Objects/User";
import Channel from "./Objects/Channel";

// export interface MessageModel
// {
// 	sender: string,
// 	message: string,
// 	date: string
// }

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

type MessageModel =
{
	sender: string,
	message: string,
	id: number
}

type ChanMapModel =
{
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

	public getPrivateMessageMap(): ChanMapModel[]
	{
		return (this.chat.privateMessageMap);
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

	public	getUserByName(userName: string)
	{
		const	searchUser = this.chat.users.find((element) =>
		{
			return (element.id === userName);
		});
		return (searchUser);
	}

	// channel functions

	public	addNewChannel(newChannel: Channel, chanId: number, kind: string)
	{
		if (kind === "channel")
		{
			this.chat.channels.push(newChannel);
			const newElement: ChanMapModel = {
				id: chanId,
				name: newChannel.name,
				mode: newChannel.mode
			};
			this.chat.chanMap.push(newElement);
		}
		else if (kind === "privateMessage")
		{
			this.chat.privateMessage.push(newChannel);
			const newElement: ChanMapModel = {
				id: chanId,
				name: newChannel.name,
				mode: "undefined"
			};
			this.chat.privateMessageMap.push(newElement);
		}
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
		console.log(users);
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

	public	createPrivateConvName(senderId: string, receiverId: string)
	{
		const	tmp = senderId.slice(0, senderId.length / 2);
		const	tmp1 = receiverId.slice(0, receiverId.length / 2);
		const	newId = tmp + tmp1;
		return (newId);
	}

	public	searchPrivateConvByUsers(convId: string, userId: string, userId1: string)
	{
		const	userIndex = this.searchUserIndex(userId);
		const	userIndex1 = this.searchUserIndex(userId1);

		if (userIndex > -1)
		{
			const	searchConv = this.chat.users[userIndex].channels.find((element) =>
			{
				return (element.name === convId);
			});
			if (searchConv !== undefined)
				return searchConv;
		}
		if (userIndex1 > -1)
		{
			const	searchConv = this.chat.users[userIndex1].channels.find((element) =>
			{
				return (element.name === convId);
			});
			if (searchConv !== undefined)
				return searchConv;
		}
		return undefined;
	}

	public	searchPrivateConvByName(chanName: string)
	{
		const	searchPrivateMessage = this.chat.privateMessage.find((element) =>
		{
			return (element.name === chanName);
		});
		return (searchPrivateMessage);
	}
}
