/* eslint-disable no-alert */
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
import { Socket, Server, Namespace } from "socket.io";

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
	id: number,
	username: string
}

type ChanMapModel =
{
    id: number,
    name: string,
	mode: string
};

type	FriendsModel = {
	id: number,
	name: string,
	profileId: string,
};

type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
};

import { v4 as uuidv4 } from "uuid";
import { profile } from "console";

@Injectable()
export	class ChatService implements OnModuleInit
{
	private	chat: Chat;
	private	log = new Logger("instance-chat-service itself");
	private	uuid = uuidv4();
	private prisma: PrismaClient;
	private readonly chatID = "id-chat-service-v-10";

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
		this.log.verbose("Creating a new version inside database");
		const	dbString = this.parseForDatabase();
		this.prisma
			.chatJson
			.create(
			{
				data:
				{
					chatJsonID: this.chatID,
					contents: dbString
				}
			})
			.catch((error: any) =>
			{
				this.log.error("On table Create error");
				this.log.error(error);
			});
	}

	public getChatData()
	{
		return (this.chat);
	}

	public updateMemberSocketId(newSocketId: string, profileId: string)
	{
		this.chat.updateMemberSocketId(newSocketId, profileId);
	}

	public	updateChannelsAdminSocketId(newSocketId : string, profileId:string)
	{
		this.chat.updateChannelsAdminSocketId(newSocketId, profileId);
	}

	public updateChannelOwner(newSocketId: string, profileId: string)
	{
		this.chat.updateChannelOwner(newSocketId, profileId);
	}

	public parseForDatabase() : string
	{
		const toDBObject = this.chat.parseForDatabase();
		// console.log(toDBObject);
		// this.log.verbose(JSON.stringify(toDBObject));
		return (JSON.stringify(toDBObject));
	}

	private	loadTableToMemory()
	{
		this.prisma
			.chatJson
			.findUnique(
			{
				where:
				{
					chatJsonID: this.chatID,
				}
			}
			)
			.then((data: any) =>
			{
				if (data === null)
				{
					this.onTableCreate();
					this.loadTableToMemory();
				}
				else
				{
					const rawobj = JSON.parse(data.contents);
					console.log("raw object chat from db", rawobj);
					const	newChatInstance = new Chat();
					newChatInstance.databaseToObject(rawobj);
					this.chat = {...newChatInstance};
					// console.log(rawobj);
				}
			})
			.catch((error: any) =>
			{
				console.log(error);
			});
	}

	private	loadTableToMemoryOld()
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
			.then((data: any) =>
			{
				if (data === null)
				{
					this.onTableCreate();
					this.loadTableToMemory();
				}
				else
				{
					const rawobj = JSON.parse(data.contents);

					const	newChatInstance = new Chat();

					const arrayUser: User[] = [];
					rawobj.users.forEach((strobj: string) =>
					{
						const rawUser = JSON.parse(strobj);

						const	newUserInstance = new User(
							rawUser.name,
							rawUser.profileId);
						// NEED TO KNOW WHAT TO DO WITH null SOCKET
						newUserInstance.setClient(null);
						newUserInstance.chat = this.chat;
						// newUserInstance.id = "not-connect";
						newUserInstance.id = rawUser.id;
						const blockedArray: Array<MemberSocketIdModel> = [];
						rawUser.blocked.forEach((blocked: MemberSocketIdModel) =>
						{
							const newBlocked: MemberSocketIdModel = {
								memberSocketId: blocked.memberSocketId,
								profileId: blocked.profileId,
							};
							blockedArray.push(newBlocked);
						});
						newUserInstance.blocked = blockedArray;

						if (rawUser.friends !== undefined)
						{
							const arrayFriendList: Array<FriendsModel> = [];
							rawUser.friends.forEach((elem: FriendsModel) =>
							{
								const	objToMemory: FriendsModel = {
									id: elem.id,
									name: elem.name,
									profileId: elem.profileId,
								};
								arrayFriendList.push(objToMemory);
							});
							newUserInstance.friends = arrayFriendList;
						}
						arrayUser.push(newUserInstance);
					});
					newChatInstance.users = arrayUser;

					const	arrayChanMap: Array<ChanMapModel> = [];
					// console.log(rawobj.chanMap);
					rawobj.chanMap.forEach((elem: ChanMapModel) =>
					{
						const	objToMemory: ChanMapModel = {
							id: elem.id,
							mode: elem.mode,
							name: elem.name
						};
						arrayChanMap.push(objToMemory);
					});
					newChatInstance.chanMap = arrayChanMap;

					// RETRIEVING CHANNELS
					const arrayChannels: Channel[] = [];
					// console.log(rawobj.channels);
					// rawobj.channels.forEach((strchan : string) =>
					// {
					// 	const	rawChan = JSON.parse(strchan);

					// 	const	channel = new Channel(
					// 		rawChan.name,
					// 		null,
					// 		rawChan.mode,
					// 		rawChan.password,
					// 		rawChan.kind,
					// 		rawChan.profileId,
					// 	);
					// 	// console.log("INSTANCE: ");
					// 	// console.log(channel instanceof Channel);
					// 	// console.log(channel);
					// 	channel.members = rawChan.members;
					// 	channel.owner = rawChan.owner;
					// 	rawChan.admins.forEach((admin: MemberSocketIdModel) =>
					// 	{
					// 		const obj: MemberSocketIdModel = {
					// 			memberSocketId: admin.memberSocketId,
					// 			profileId: admin.profileId,
					// 		};
					// 		channel.admins.push(obj);
					// 	});
					// 	rawChan.banned.forEach((banned: MemberSocketIdModel) =>
					// 	{
					// 		const obj: MemberSocketIdModel = {
					// 			memberSocketId: banned.memberSocketId,
					// 			profileId: banned.profileId,
					// 		};
					// 		channel.banned.push(obj);
					// 	});

					// 	const arrayMessages: Array<MessageModel> = [];

					// 	rawChan.messages.forEach((message: MessageModel) =>
					// 	{
					// 		const objToMemory: MessageModel = {
					// 			sender: message.sender,
					// 			message: message.message,
					// 			id: message.id,
					// 			username: message.username,
					// 		};
					// 		arrayMessages.push(objToMemory);
					// 	});
					// 	channel.messages = arrayMessages;
					// 	// channel.chat = this.chat;

					// 	const	arrayUsers: MemberSocketIdModel[] = [];
					// 	rawChan.users.forEach((elem: MemberSocketIdModel) =>
					// 	{
					// 		const obj: MemberSocketIdModel = {
					// 			memberSocketId: elem.memberSocketId,
					// 			profileId: elem.profileId,
					// 		};
					// 		arrayUsers.push(obj);
					// 	});
					// 	channel.users = arrayUsers;

					// 	arrayChannels.push(channel);
					// });
					// newChatInstance.channels = arrayChannels;

					const	arrMemberSocketIds: Array<MemberSocketIdModel> = [];
					rawobj.memberSocketIds.forEach((elem: MemberSocketIdModel) =>
					{
						const	objToMemory: MemberSocketIdModel = {
							memberSocketId: elem.memberSocketId,
							profileId: elem.profileId,
						};
						arrMemberSocketIds.push(objToMemory);
					});
					newChatInstance.memberSocketIds = arrMemberSocketIds;
					// on reparse les users afin de leur ajouter leur 
					this.chat = newChatInstance;

					this.chat.channels.forEach((channel: Channel) =>
					{
						channel.chat = this.chat;
					});

					rawobj.users.forEach((strobj: string) =>
					{
						const rawUser = JSON.parse(strobj);
						// const chanArray: Channel[] = [];
						const chanArray: string[] = [];
						rawUser.channels.forEach((chan: string) =>
						{
							const tmpChan = JSON.parse(chan);
							const searchChan = this.chat.channels.find((chanToFind) =>
							{
								return (chanToFind.name === tmpChan.name);
							});
							if(searchChan !== undefined)
								chanArray.push(searchChan.id);
						});
						const searchUser = this.chat.users.find((element) =>
						{
							return (element.profileId === rawUser.profileId);
						});
						if (searchUser !== undefined)
							searchUser.channels = chanArray;
					});

					console.log("End of parser check with serialized value ");
					console.log( JSON.parse(this.parseForDatabase()));
					console.log(this.chat);
				}
			})
			.catch((error: any) =>
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
		this.log.verbose(JSON.parse(dbString));
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
		.catch((error: any) =>
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
			return (element.memberSocketId === clientId);
		});
		return (searchSocket);
	}

	public	checkOldSocketInChannels(client: Socket, oldSocketId: string)
	{
		// change socket id in the chat structure
		const index = this.chat.memberSocketIds.findIndex((element) =>
		{
			return (element.memberSocketId === oldSocketId);
		});
	}

	// add and delete a user

	public	pushUser(newUser: User, clientId: string)
	{
		this.chat.users.push(newUser);
		this.chat.memberSocketIds.push(
		{
			memberSocketId: clientId,
			profileId: newUser.profileId
		});
	}

	public	deleteUser(userIndex: number, userSocket: number)
	{
		this.chat.users.splice(userIndex, 1);
		this.chat.memberSocketIds.splice(userSocket, 1);
	}

	public	getUserBySocketId(userName: string)
	{
		const	searchUser = this.chat.users.find((element) =>
		{
			return (element.id === userName);
		});
		return (searchUser);
	}

	public	getProfileIdWithUserName(userName: string)
	{
		const searchUser = this.chat.users.find((element) =>
		{
			return (element.id === userName);
		});
		if (searchUser === undefined)
			return (undefined);
		return (searchUser.profileId);
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

	public	getAllUsersArray()
	{
		return (this.chat.users);
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
				return (element === convId);
			});
			if (searchConv !== undefined)
				return searchConv;
		}
		if (userIndex1 > -1)
		{
			const	searchConv = this.chat.users[userIndex1].channels.find((element) =>
			{
				return (element === convId);
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

	public	getIndexUserWithProfileId(profileId: string)
	{
		const	searchIndex = this.chat.users.findIndex((elem) =>
		{
			return (elem.profileId === profileId);
		});
		return (searchIndex);
	}

	public	setSocketToUser(index: number, client: Socket)
	{
		this.chat.users[index].changeSocket(client);
	}

	public getUserWithProfileId(profileId: string)
	{
		const searchUser = this.chat.users.find((elem) =>
		{
			return (elem.profileId === profileId);
		});

		return (searchUser);
	}

	public	getUsernameWithSocketId(socketId: string)
	{
		const searchUser = this.chat.users.find((elem) =>
		{
			return (elem.id === socketId);
		});
		return (searchUser?.name);
	}

	public getProfileIdFromSocketId(socketId: string) : string
	{
		return (this.chat.getProfileIdFromSocketId(socketId));
	}

	public updateUserInChannels(newSocketId: string, profileId: string)
	{
		this.chat.updateUserInChannels(newSocketId, profileId);
	}

	public updateUserInChat(newSocketId: string, profileId: string)
	{
		this.chat.updateUserInChat(newSocketId, profileId);
	}

	public updateUserSocketInChannels(client: Socket)
	{
		this.chat.updateUserSocketInChannels(client);
	}

	public updateBannedInChannel(newSocketId: string, profileId: string)
	{
		this.chat.updateBannedInChannel(newSocketId, profileId);
	}

	public setServer(server: Server)
	{
		this.chat.setServer(server);
	}

	public getUsernameWithProfileId(profileId: string)
	{
		let toReturn: string;
		toReturn = "undefined";
		this.chat.users.forEach((user) =>
		{
			if (user.profileId === profileId)
				toReturn = user.name;
		});
		return (toReturn);
	}
}
