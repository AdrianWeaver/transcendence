/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
	Injectable, Logger, OnModuleInit
}	from "@nestjs/common";
import Chat from "./Objects/Chat";
import User from "./Objects/User";
import Channel from "./Objects/Channel";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";

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

import { v4 as uuidv4 } from "uuid";

@Injectable()
export	class ChatService implements OnModuleInit
{
	private	chat: Chat;
	private	log = new Logger("instance-chat-service itself");
	private	uuid = uuidv4();
	private prisma: PrismaClient;
	private readonly chatID = "id-chat-service-v-3";

	constructor()
	{
		this.log.verbose("Chat Service is constructed");
		this.chat = new Chat();
		this.prisma = new PrismaClient();
		// this.initDB();
		// this.updateDB();
	}

	private onTableCreate()
	{
		const	dbString = this.parseForDatabase();
		this.prisma.chatJson
			.create(
			{
				data:
				{
					chatJsonID: this.chatID,
					contents: dbString
				}
			})
			.catch((error) =>
			{
				this.log.error("On table Create error");
				this.log.error(error);
			});
	}

	public parseForDatabase() : string
	{
		const	channelsDB: string[] = [];
		const	usersToDB: string[] = [];

		this.chat.channels.forEach((channel) =>
		{
			// console.log(channel.parseForDatabase());
			channelsDB.push(channel.parseForDatabase());
		});

		this.chat.users.forEach((user) =>
		{
			console.log(user.parseForDatabase());
			usersToDB.push(user.parseForDatabase());
		});
		const toDBObject = {
			activeMembers: this.chat.activeMembers,
			chanMap: this.chat.chanMap,
			channels: channelsDB,
			matchHistory: this.chat.matchHistory,
			memberSocketIds: this.chat.memberSocketIds,
			message: this.chat.message,
			users: usersToDB,
			privateMessage: this.chat.privateMessage,
			privateMessageMap: this.chat.privateMessageMap,
		};
		// console.log(toDBObject);
		this.log.verbose(JSON.stringify(toDBObject));
		return (JSON.stringify(toDBObject));
	}

	private	loadTableToMemory()
	{
		this.prisma.chatJson
			.findUnique(
			{
				where:
				{
					chatJsonID: this.chatID,
				}
			}
			)
			.then((data) =>
			{
				this.log.verbose("This is our object or  array");
				this.log.verbose(data);
				if (data === null)
				{
					this.onTableCreate();
					this.loadTableToMemory();
				}
				else
				{
					const rawobj = JSON.parse(data.contents);
					this.log.debug(rawobj);
					const	arrayUsers: Array<User> = [];
					rawobj.users?.forEach((rawUserString: string) =>
					{
						const rawUserObject = JSON.parse(rawUserString);
						const	user = new User(rawUserObject.name, null, rawUserObject.profileId);
						console.log("USER TEST: ", user);
						console.log("Raw user object: ", rawUserObject);
						arrayUsers.push(user);
					});

					this.log.verbose("Just here the start raw object");
					const	arrayChannels: Array<Channel> = [];
					rawobj.channels?.forEach((rawChannelString: string) =>
					{
						const	rawChannelObject = JSON.parse(rawChannelString);

						console.log(rawChannelObject);

						const	channel = new Channel(rawChannelObject.name, null, rawChannelObject.mode,
							rawChannelObject.password, rawChannelObject.kind);
							arrayChannels.push(channel);
					});
					this.log.verbose("Just here the end raw object");
					const	newChat: Chat = {
						...this.chat,
						channels: arrayChannels,
						privateMessage: rawobj.privateMessage,
						chanMap: rawobj.chanMap,
						privateMessageMap: rawobj.privateMessageMap,
						users: arrayUsers,
						memberSocketIds: rawobj.memberSocketIds

					};
					// this.log.verbose(rawobj);
					this.log.verbose(newChat);
					this.chat = newChat;
				}
			})
			.catch((error) =>
			{
				this.log.error(error);
			});
	}

	onModuleInit()
	{
		this.log.verbose("Get from SQL database to In Memory DB");
		this.loadTableToMemory();
	}

	public	updateDatabase()
	{
		this.log.verbose("Updating all Chat Object");
		const dbString = this.parseForDatabase();
		this.prisma.chatJson
		.update(
			{
				where:
				{
					chatJsonID: this.chatID
				},
				data:
				{
					chatJsonID: this.chatID,
					contents: dbString,
				}
			}
		)
		.catch((error) =>
		{
			this.log.error(error);
		});
		// this.log.verbose(JSON.parse(dbString));
	}
	// public async updateDB(): Promise<void>
	// {
	// 	try
	// 	{
	// 		await this.prisma.$connect;
	// 		const updatedChatJson = JSON.stringify(this.chat);
	// 		await this.prisma.chatJson.update({
	// 			where: { chatJsonID: this.chatID },
	// 			data: { contents: updatedChatJson },
	// 		});
	// 		console.log("UpdatedChatJson: " + updatedChatJson);
	// 	}
	// 	catch (error)
	// 	{
	// 		this.log.error("Error storing chat message:", error);
	// 	}
	// 	finally
	// 	{
	// 		await this.prisma.$disconnect();
	// 	}
	// }

	// getters

	public	getChatInstanceId() : string
	{
		return (this.uuid);
	}

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

	public	searchUserWithProfileId(profileId: string)
	{
		const searchUser = this.chat.users.find((element) =>
		{
			return (element.profileId === profileId);
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

	public	checkOldSocketInChannels(client: Socket, oldSocketId: string)
	{
		// change socket id in the chat structure
		const index = this.chat.memberSocketIds.findIndex((element) =>
		{
			return (element === oldSocketId);
		});
		this.chat.memberSocketIds[index] = client.id;

		// change socket in the channel structure
		for (const channel of this.chat.channels)
		{
			if (channel.isMember(oldSocketId) === true)
			{
				const	socketIndex = channel.sockets.findIndex((element) =>
				{
					return (element.id === oldSocketId);
				});
				channel.sockets[socketIndex] = client;
				if (channel.isAdmin(oldSocketId))
				{
					const adminIndex = channel.admins.findIndex((element) =>
					{
						return (element === oldSocketId);
					});
					channel.admins[adminIndex] = client.id;
				}
				if (channel.isOwner(oldSocketId) === true)
					channel.owner = client.id;
			}
			if (channel.isBanned(oldSocketId) === true)
			{
				const bannedIndex = channel.banned.findIndex((element) =>
				{
					return (element === oldSocketId);
				});
				channel.banned[bannedIndex] = client.id;
			}
		}
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
