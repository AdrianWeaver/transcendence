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
import { Socket, Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

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
	"online": boolean,
	"status": string,
	"id": string,
	"avatar": string,
	"profileId": string
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
	avatar: string,
	status: string
};

type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
};

import { v4 as uuidv4 } from "uuid";
import { GameService } from "src/game-socket/Game.service";

@Injectable()
export	class ChatService implements OnModuleInit
{
	public	chat: Chat;
	private	log = new Logger("instance-chat-service itself");
	private	uuid = uuidv4();
	private readonly chatID = "id-chat-service-v-11";

	constructor(
		private	readonly prismaService: PrismaService,
	)
	{
		this.log.verbose("Chat Service is constructed with id: " + this.uuid);
		this.chat = new Chat();
	}

	private onTableCreate()
	{
		this.log.verbose("Creating a new version inside database");
		const	dbString = this.parseForDatabase();
		this.prismaService
			.prisma
			.chatJson
			.create(
			{
				data:
				{
					chatJsonID: this.chatID,
					contents: dbString
				}
			})
			.catch((_error: any) =>
			{
				// this.log.error(error);
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
		return (JSON.stringify(toDBObject));
	}

	private	loadTableToMemory()
	{
		this.prismaService
			.prisma
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
					const	newChatInstance = new Chat();
					newChatInstance.databaseToObject(rawobj);
					this.chat = {...newChatInstance};
				}
			})
			.catch(() =>
			{
				console.log("load table skipped");
			});
	}

	onModuleInit()
	{
		// this.log.verbose("Get from SQL database to In Memory DB");
		// this.loadTableToMemory();
	}

	public	updateDatabase()
	{
		const dbString = this.parseForDatabase();
		this.prismaService.prisma.chatJson
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
	}

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
		const	searchUser = this.getUserWithProfileId(newUser.profileId);
		if (searchUser === undefined)
		{
			this.chat.users.push(newUser);
			this.chat.memberSocketIds.push(
			{
				memberSocketId: clientId,
				profileId: newUser.profileId
			});
		}
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
			return (element.name === userName);
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
				online: element.online,
				status: element.status,
				avatar: element.avatar,
				profileId: element.profileId
			};
			users.push(user);
		});
		return (users);
	}

	public	getAllUsersArray()
	{
		return (this.chat.users);
	}

	public	changeInfos(data: any, id: string | number)
	{
		const	index = this.chat.users.findIndex((elem) =>
		{
			return (elem.profileId === id.toString());
		});
		if (index !== -1)
		{
			if (data.info?.length)
				if (data.field === "username" && data.info !== this.chat.users[index].name)
					this.chat.users[index].name = data.info;
			return ("okay");
		}
		return ("user doesnt exist");
	}

	public	sendMessageToUser(user: User)
	{
		this.searchUserIndex(user.id);
	}

	public deleteChannel(chanName: string, priv: boolean)
	{
		if (priv)
		{
			const	index = this.chat.privateMessage.findIndex((element) =>
			{
				return (element.name === chanName);
			});
			this.chat.privateMessage.splice(index, 1);
			let i: number;
			i = 0;
			for (const privMsgMap of this.chat.privateMessageMap)
			{
				if (privMsgMap.name === chanName)
				{
					this.chat.privateMessageMap.splice(i, 1);
					break ;
				}
				i++;
			}
		}
		else
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
	}

	public	searchChannelByName(chanName: string)
	{
		const	searchChannel = this.chat.channels.find((element) =>
		{
			return (element.name === chanName);
		});
		return (searchChannel);
	}

	public	createPrivateConvName(sender: User, receiver: User)
	{
		const	newId = sender.name + "&" + receiver.name;
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

	public	setSocketToUser(index: number, client: Socket | null)
	{
		this.chat.users[index].changeSocket(client);
	}

	public getUserWithProfileId(profileId: string)
	{
		const searchUser = this.chat.users.find((elem) =>
		{
			return (elem.profileId.toString() === profileId.toString());
		});

		return (searchUser);
	}

	public	getUsernameWithSocketId(socketId: string)
	{
		const searchUser = this.chat.users.find((elem) =>
		{
			return (elem.id === socketId);
		});
		if (searchUser === undefined)
			return (undefined);
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

	public updateUserSocketInChannels(client: Socket | null)
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
		const	ret = this.chat.users.find((user) =>
		{
			return (profileId === user.profileId);
		});
		if (ret === undefined)
			return ("undefined");
		return (ret.name);
	}

	public	disconnectUserWithClientId(clientId: string)
	{
		return ;
		// dead code
		const index = this.searchUserIndex(clientId);
		if (index === -1)
		{
			this.log.error("The user that is started to remove dont exist ???");
			return ;
		}
		// this.chat.users[index]
		this.chat.users[index].id = "disconnected";
		const	sockIndex = this.searchSocketIndex(clientId);
		if (sockIndex === -1)
		{
			this.log.error("The user that is started to remove dont exist ???");
			return ;
		}
		this.chat.memberSocketIds[sockIndex].memberSocketId = "disconnected";
	}

	public	addNewChatUser(chatUser: ChatUserModel, client: Socket | null)
	{
		const	user: User = new User(chatUser.name, chatUser.profileId);
		user.setClient(client);
		user.setId(chatUser.id);
		user.status = chatUser.status;
		user.online = chatUser.online;
		user.avatar = chatUser.avatar;
		this.pushUser(user, chatUser.id);
	}

	public	setStatus(profileId: string, playing: boolean)
	{
		const	index = this.chat.users.findIndex((elem) =>
		{
			return (elem.profileId === profileId);
		});
		if (index !== undefined)
		{
			if (playing)
				this.chat.users[index].status = "playing";
			else
				this.chat.users[index].status
					= this.chat.users[index].online ? "online" : "offline";
		}
	}

	async	hashPassword(password: string, chanName: string)
	{
		const	saltRounds = 10;
		const	index = this.chat.channels.findIndex((elem) =>
		{
			return (elem.name === chanName);
		});
		if (index === -1)
			throw new Error("User not found - hashPassword user.service");
		const	hashed = await bcrypt.hash(password, saltRounds);
		if (hashed)
			this.chat.channels[index].password = hashed;
		return (hashed);
	}

	/**
	 * @deprecated
	 * @param gameService 
	 * @returns 
	 */
	public	updateStatus(gameService: GameService)
	{
		this.chat.users.forEach((elem) =>
		{
			if (!elem.online)
				elem.status = "offline";
			else
			{
				const	 playing = gameService.getStatusConnectedToGameFromProfileId(elem.id.toString());
				if (playing)
					elem.status = "playing";
				else
					elem.status = "online";
			}
		});
		console.log("UPDATE STATUS WORKED ?", this.chat.users);
		return (this.chat.users);
	}
}
