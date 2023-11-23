/* eslint-disable max-depth */
/* eslint-disable semi */
/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { Server, Socket } from "socket.io";
import User from "./Objects/User";
import Channel from "./Objects/Channel";
import	* as roomNameArray from "../game-socket/assets/roomName.json";

import
{
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
}	from "@nestjs/websockets";
import { ChatService, ChatUserModel } from "./Chat.service";
import { Logger } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import	* as jwt from "jsonwebtoken";
import { error, profile } from "console";
import { elementAt } from "rxjs";
import { constants } from "buffer";
import { UserModel } from "src/user/user.interface";

import { UserAuthorizationGuard } from "src/user/user.authorizationGuard";

import GameServe from "src/game-socket/Objects/GameServe";
import { GameService } from "src/game-socket/Game.service";
import { NodeAnimationFrame } from "../game-socket/NodeAnimationFrame";

type	ActionSocket = {
	type: string,
	payload?: any
};

type FriendListModel = {
	name: string,
	status: string,
	online: boolean
}

type MessageModel =
{
	sender: string,
	message: string,
	id: number,
	username: string,
}

type	MembersModel =
{
	id: number,
	name: string,
	profileId: string,
	userName: string,
	status: string,
	online: boolean
}

export type	FriendsModel =
{
	id: number,
	name: string,
	profileId: string,
}


type MemberSocketIdModel ={
	memberSocketId: string,
	profileId: string
}

@WebSocketGateway(
{
	path: "/socket-chat",
	cors:
	{
		origin: "*"
	},
})
export class ChatSocketEvents
		implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
	{
		@WebSocketServer()
		server: Server;
		private readonly logger = new Logger("Chat-socket-events");

		public	constructor(
			private readonly chatService: ChatService,
			private readonly userService: UserService,
			private readonly gameService: GameService)
		{
			this.logger.debug("An instance is started with chat service id: "
				+ this.chatService.getChatInstanceId());
			this.logger.debug("User instance service is :"
				+ this.userService.getUuidInstance());
			this.logger.debug("GameSevice instance is loaded with id: "
				+ this.gameService.getInstanceId());
		}

		afterInit(server: any)
		{
			this.chatService.setServer(this.server);
		}

		handleConnection(client: Socket)
		{
			this.chatService.setServer(this.server);
			let profileId: string;
			if (client.handshake.auth)
			{
				const	secret = this.userService.getSecret();
				const	bearerToken: string = client.handshake.auth.token;
				const	token = bearerToken.split("Bearer ");
				if (token.length !== 2)
				{
					client.disconnect();
					return ;
				}
				try
				{
					const decodedToken = jwt.verify(token[1], secret) as jwt.JwtPayload;
					profileId = decodedToken.id;

					const alreadyConnected = this.chatService.chat.memberSocketIds.find((user) =>
					{
		
						return (user.profileId === profileId
							&& (user.memberSocketId !== "disconnected" && user.memberSocketId !== "undefined"));
					});

					if (alreadyConnected !== undefined)
					{
						const action: ActionSocket = {
							type: "already-connected"
						};
						client.emit("connect-state", action);
						client.disconnect();
						return ;
					}
					const index = this.chatService.getIndexUserWithProfileId(profileId);
					if (index === -1)
					{
						const userName = this.userService.getUsernameByProfileId(profileId) as string;
						const user = this.userService.getUserById(profileId);
						if (user === undefined)
							throw new Error("HandleConnexion user dosnt exist");
						const newUser = new User(userName, profileId);
						newUser.setClient(client);
						newUser.setAvatar(user.avatar);
						newUser.setId(client.id);
						newUser.status = user.status;
						newUser.online = user.online;
						this.chatService.pushUser(newUser, client.id);
						const	action = {
							type: "on-connection",
							payload: "",
						};
						this.server.emit("channel-info", action);
					}
					else
					{
						this.chatService.setSocketToUser(index, client);
						this.chatService.chat.users[index].status = "online";
						this.chatService.chat.users[index].online = true;
						this.chatService.updateUserSocketInChannels(client);

						this.chatService.updateMemberSocketId(client.id, profileId);

						this.chatService.updateChannelsAdminSocketId(client.id, profileId);
						this.chatService.updateChannelOwner(client.id, profileId);
						this.chatService.updateUserInChannels(client.id, profileId);
						this.chatService.updateUserInChat(client.id, profileId);

						this.chatService.updateBannedInChannel(client.id, profileId);

						const	userToUpdate = this.chatService.getUserWithProfileId(profileId);
						this.chatService.chat.channels.forEach((channel: Channel) =>
						{
							channel.users.forEach((user: MemberSocketIdModel) =>
							{
								if (user.profileId === profileId)
									userToUpdate?.client?.join(channel.name);
							});
						});
						this.chatService.chat.privateMessage.forEach((channel: Channel) =>
						{
							channel.users.forEach((user: MemberSocketIdModel) =>
							{
								if (user.profileId === profileId)
									userToUpdate?.client?.join(channel.name);
							});
						});

						const	blockedArray: string[] = [];
						userToUpdate?.blocked.forEach((blocked) =>
						{
							blockedArray.push(blocked.profileId);
						})
						const	action = {
							type: "on-connection",
							payload: {
								blockedList: blockedArray,
							}
						};
						client.emit("channel-info", action);
					}
					this.chatService.updateDatabase();
				}
				catch (error)
				{
					if (error instanceof jwt.JsonWebTokenError)
					{
						client.disconnect();
						return ;
					}
					return ;
				}
			}
			else
			{
				this.logger.warn("A client try to connect without authenticate");
				client.disconnect();
				return ;
			}

			// INIT CHANNELS, USERS, FRIENDS DISPLAY

			const	userMe = this.chatService.getUserBySocketId(client.id);
			if (userMe !== undefined)
			{
				const	profId = this.chatService.getProfileIdFromSocketId(client.id);
				const	friendsArr: string[] = [];

				userMe.friends.forEach((friend) =>
				{
					friendsArr.push(friend.name);
				});
				const	action = {
					type: "init-channels",
					payload: {
						channels: this.chatService.getChanMap(),
						friends: friendsArr,
						uniqueId: profId,
						privateMessage: this.chatService.getPrivateMessageMap(),
					}
				};
				client.emit("repopulate-on-reconnection", action);
			}
		}

		handleDisconnect(client: Socket)
		{
			const sockId = client.id;
			client.disconnect();
			const index = this.chatService.searchUserIndex(sockId);
			if (index === -1)
			{
				this.logger.error("The user that is started to remove dont exist ???");
				return ;
			}
			const	profileId = this.chatService.getProfileIdFromSocketId(sockId);
			if (profileId === "undefined")
			{
				this.logger.error("The user that is started to remove dont exist ???");
				return ;
			}
			this.chatService.updateMemberSocketId("disconnected", profileId);

			this.chatService.updateChannelsAdminSocketId("disconnected", profileId);
			this.chatService.updateChannelOwner("disconnected", profileId);
			this.chatService.updateUserInChannels("disconnected", profileId);
			this.chatService.updateUserInChat("disconnected", profileId);
			this.chatService.updateBannedInChannel("disconnected", profileId);
			this.chatService.updateDatabase();

			const indexOfUsers = this.chatService.chat.users.findIndex((user) =>
			{
				return (user.profileId === profileId);
			})
			if (indexOfUsers === -1)
			{
				this.logger.error("must not be in this conditions ");
				return ;
			}
			// can check if the user is playing with the function of gameService
			this.chatService.chat.users[indexOfUsers].status = "offline";
			this.chatService.chat.users[indexOfUsers].online = false;
		}

		@SubscribeMessage("sending-message")
		handleSendingMessageToUser(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "send-message")
			{
				client.join(data.payload.chanName);
				const action = {
					type: "message-to-send",
					payload:
					{
						sender: client.id,
						msgRoom: [
							{
								id: data.payload.id,
								roomName: data.payload.chanName,
								privateConv: data.payload.privateConv,
								messageContent: data.payload.content,
							}
						]
					}
				};
				this.server.to(data.payload.chanName).emit("sending-message", action);
			}
		}

		public createNewGame(profileId: string, friendProfileId: string)
		{
				// want to have a room name that fit to logic of game room name feature :)

				const	filteredGame = this.gameService.gameInstances.filter((instance) =>
				{
					return (
						(instance.playerOne.profileId === profileId
						&& instance.playerTwo.profileId === friendProfileId)
						|| (instance.playerTwo.profileId === profileId
						&& instance.playerOne.profileId === friendProfileId)
					);
				});
				const	filteredGameByGameMode = filteredGame.filter((instance) =>
				{
					return (instance.gameMode === "friend");
				});
				if (filteredGameByGameMode.length)
				{
					return ("error");
				}
				const	searchPlayerOne = this.chatService.getUserWithProfileId(profileId.toString());
				const	searchPlayerTwo = this.chatService.getUserWithProfileId(friendProfileId.toString());
				if (searchPlayerOne === undefined || searchPlayerTwo === undefined)
				{
					// TEST
					console.error("user not found");
					return ("error");
				}
				this.gameService.increaseRoomCount();
				// can put length of room dynamically to reject connection if liimiit trigger
				// roomNameArray.length < roomCount : reject busy server
				const	roomName = "room "
					+ roomNameArray[
						this.gameService.getRoomCount()
					]
				const	newGame = new GameServe(roomName);
				newGame.gameMode = "friend";
				newGame.ball.game = newGame;
				newGame.board.game = newGame;
				newGame.net.game = newGame;
				newGame.playerOne.socketId = "invited";
				newGame.playerTwo.socketId = "invited";
				newGame.playerOne.profileId = searchPlayerOne.profileId;
				newGame.playerTwo.profileId = searchPlayerTwo.profileId;
				newGame.playerOne.name = searchPlayerOne.name;
				newGame.playerTwo.name = searchPlayerTwo.name;
				newGame.board.init();
				newGame.loop = new NodeAnimationFrame();
				newGame.loop.game = newGame;

				// this.gameService.getRoomCount();
				this.gameService.pushGameServeToGameInstance(newGame);
				return (newGame.uuid);
		}

		/**
		 * Subscibed message "info"
		 * @param client 
		 * @param data 
		 * @returns 
		 */
		public	handleInfoSentMessage(client: Socket, data: ActionSocket)
		{
			let	channel;
			let	kind;
			let	playPong;
			let	friendProfileId;
			let	message;

			message = data.payload.message;
			playPong = false;
			const	profileId = this.chatService.getProfileIdFromSocketId(client.id);
			channel = this.chatService.searchChannelByName(data.payload.chanName);
			if (channel === undefined)
			{
				channel = this.chatService.searchPrivateConvByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				kind = "privateMessage";
				channel.admins.map((elem) =>
				{
					if (elem.profileId !== profileId)
						friendProfileId = elem.profileId;
				});
				if (friendProfileId === undefined)
					return ;
				// TEST DO WE NEED TO HANDLE THAT ERROR ? OR IT IS OK LIKE THIS
				if (data.payload.message === "/playPong")
				{
					const	usernameOne = this.userService.getUsernameByProfileId(profileId);
					const	usernameTwo = this.userService.getUsernameByProfileId(friendProfileId);
					playPong = true;
					const	gameUuid = this.createNewGame(profileId, friendProfileId);
					message = "/playPong&" + profileId + ":" + usernameOne + "!" + friendProfileId + ":" + usernameTwo + "!" + gameUuid;
				}
			}
			else
			{
				kind = "channel";
			}
			if (data.payload.message.trim().length === 0)
				return ;
			const	id = channel.messages.length;
			const newMessage: MessageModel = {
				// profileId instead of socketId ?
				sender: playPong ? "server" : profileId,
				message: message,
				id: id,
				username: this.chatService.getUsernameWithSocketId(client.id) as string,
			};
			channel.addNewMessage(newMessage);
			this.chatService.updateDatabase();
			const	action = {
				type: "update-messages",
				payload: {
					messages: channel.messages,
					chanName: channel.name,
					friendProfileId: friendProfileId,
					myProfileId: profileId,
					playPong: playPong,
					kind: kind
				}
			};
			this.server.to(channel.name).emit("update-messages", action);
		}

		public handleInfoGetUserList(client: Socket, data: ActionSocket)
		{
			const	profileId = this.chatService.getProfileIdFromSocketId(client.id);
			const copyUsers = this.chatService.getAllUsers();

			const	me = this.chatService.getUserBySocketId(client.id);
			if (me === undefined)
				return ;
			const regularUsers = this.userService.getAllUserRaw();
			if (regularUsers === undefined)
				return ;
			const	searchUser = copyUsers.findIndex((elem) =>
			{
				return (client.id === elem.id);
			});
			if (searchUser !== -1)
				copyUsers.splice(searchUser, 1);
			const	newArray= [...regularUsers];
			const	friendsList: string[] = [];
			me.friends.map((elem) =>
			{
				friendsList.push(elem.name);
			});
			copyUsers.forEach((elem) =>
			{
				newArray.map((element) =>
				{
					if (elem.profileId === element.id && elem.name !== element.username)
						elem.name = element.username;
					if (elem.name === element.username)
					{
						elem.online = element.online;
						elem.status = element.status;
					}
				});
			});
			const action = {
				type: "sending-list-user",
				payload:
				{
					arrayListUsers: copyUsers,
					friendsList: friendsList,
					kind: "privateMessage"
				}
			};
			client.emit("info", action);
		}

		public	handleInfoCreateChatUser(client: Socket, data: ActionSocket )
		{
			const	searchChatUser = this.chatService.getUserBySocketId(client.id);

			let newChatUser: ChatUserModel;
			if (searchChatUser === undefined)
			{
				newChatUser = {
					name: data.payload.user.username,
					avatar: data.payload.user.avatar,
					id: client.id,
					online: data.payload.online,
					status: data.payload.status,
					profileId: data.payload.user.id
				};
				this.chatService.addNewChatUser(newChatUser, client);
			}
			else
			{
				newChatUser = {
					name: searchChatUser.name,
					avatar: searchChatUser.avatar,
					id: searchChatUser.id,
					online: searchChatUser.online,
					status: searchChatUser.status,
					profileId: searchChatUser.profileId
				};
			}
			const	action = {
				type: "create-chat-user",
				payload:
				{
					newChatUser: newChatUser,
					online: data.payload.online
				}
			};
			this.server.emit("add-chat-user", action);
		}

		@SubscribeMessage("info")
		handleInformation(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "get-user-list")
			{
				this.handleInfoGetUserList(client, data);
			}

			if (data.type === "sent-message")
			{
				this.logger.error("The client send a message", data);
				this.handleInfoSentMessage(client, data);
			}

			if (data.type === "create-chat-user")
			{
				this.handleInfoCreateChatUser(client, data);
			}
		}

		@SubscribeMessage("channel-info")
		handleChannels(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "create-channel")
			{
					let kind;
					let	alreadyCreated;
					alreadyCreated = false;
					let	tmp, tmp2;
					const	searchUser = this.chatService.searchUserIndex(data.payload.activeId);
					let		chanName;
					let		searchConv;
					if (searchUser > -1 && data.payload.kind !== "channel")
					{
						tmp = this.chatService.getUserBySocketId(client.id);
						tmp2 = this.chatService.getUserBySocketId(data.payload.activeId);
						if (tmp === undefined || tmp2 === undefined)
							return ;
						chanName = this.chatService.createPrivateConvName(tmp, tmp2);
						const chanName1 = this.chatService.createPrivateConvName(tmp2, tmp);
						if (this.chatService.searchPrivateConvByName(chanName) || this.chatService.searchPrivateConvByName(chanName1))
							alreadyCreated = true;
						else
						{
							searchConv = this.chatService.searchPrivateConvByUsers(chanName, data.payload.activeId, client.id);
							if (searchConv === undefined)
								searchConv = this.chatService.searchPrivateConvByUsers(chanName1, data.payload.activeId, client.id);
							if (searchConv === undefined)
								searchConv = this.chatService.searchPrivateConvByName(chanName);
						}
						kind = "privateMessage";
						if (searchConv === undefined && alreadyCreated === false)
						{
							const newPrivateMsg = new Channel(chanName);
							newPrivateMsg.setClient(client, this.chatService.getProfileIdFromSocketId(client.id));
							newPrivateMsg.setId();
							newPrivateMsg.setPassword("");
							newPrivateMsg.setKind(kind);
							newPrivateMsg.setMode("private");
							newPrivateMsg.chat = this.chatService.getChat();
							const obj: MemberSocketIdModel = {
								memberSocketId: data.payload.activeId,
								profileId: this.chatService.getProfileIdFromSocketId(data.payload.activeId),
							};
							newPrivateMsg?.users.push(obj);
							newPrivateMsg.members++;
							newPrivateMsg?.addAdmin(tmp2?.id);
							client.join(newPrivateMsg.name);
							tmp2.client?.join(newPrivateMsg.name);
							this.chatService.addNewChannel(newPrivateMsg, data.payload.pmIndex, kind);
							this.chatService.updateDatabase();
						}
						const	action = {
							type: "add-new-channel",
							payload:
							{
								chanMap: undefined,
								kind: "privateMessage",
								privateMessageMap: this.chatService.getPrivateMessageMap(),
								chanName: chanName
							}
						};
						this.server.emit("display-channels", action);
					}
					else
					{
						chanName = data.payload.chanName;
						kind = "channel";
					}
					if (kind === "channel")
					{
						const profileId = this.chatService.getProfileIdFromSocketId(client.id);
						if (profileId === "undefined")
							throw new Error("'create-channel' ChatSocketEvent");
						const	searchUser = this.chatService.getUserWithProfileId(profileId);
						if (searchUser === undefined)
							throw new Error("'create-channel' ChatSocketEvent");
						const	newChannel = new Channel(chanName);
						newChannel.setClient(client, profileId);
						newChannel.setId();
						newChannel.setKind(kind);
						newChannel.setPassword(data.payload.chanPassword);
						newChannel.setMode(data.payload.chanMode);
						newChannel.chat = this.chatService.getChat();
						client.join(newChannel.name);
						searchUser?.channels.push(newChannel.id);
						this.chatService.addNewChannel(newChannel, data.payload.chanId, kind);
						this.chatService.updateDatabase();
						const	action = {
							type: "add-new-channel",
							payload:
							{
								chanMap: this.chatService.getChanMap(),
								kind: "channel",
								privateMessageMap: undefined
							}
						};
						this.server.emit("display-channels", action);
					}
			}
			if (data.type === "destroy-channel")
			{
				let	searchChannel: Channel | undefined;

				const	profileId = this.chatService.getProfileIdFromSocketId(client.id);
				let isAdmin: boolean;
				if (data.payload.kind === "privateMessage")
				{
					searchChannel = this.chatService.searchPrivateConvByName(data.payload.name);
					isAdmin = true;
				}
				else
				{
					searchChannel = this.chatService.searchChannelByName(data.payload.name);
					if (searchChannel?.isAdmin(profileId) === true)
						isAdmin = true;
					else
						isAdmin = false;
				}
				let	msg;
				msg = "";
				let	action;
				const	priv = msg === "" ? false : true;
				if (isAdmin === true)
				{
					this.chatService.deleteChannel(data.payload.name, priv);
					this.chatService.updateDatabase();
					action = {
						type: "destroy-channel",
						payload: {
							chanMap: this.chatService.getChanMap(),
							message: msg,
							privateMessageMap: this.chatService.getPrivateMessageMap()
						}
					};
					this.server.emit("display-channels", action);
				}
				else
				{
					msg = "You are not the channel's admin !";
					action = {
						type: "destroy-channel",
						payload: {
							chanMap: this.chatService.getChanMap(),
							message: msg,
							privateMessageMap: this.chatService.getPrivateMessageMap()
						}
					};
					client.emit("display-channels", action);
				}
			}

			if (data.type === "asked-join")
			{
				const	searchChannel = this.chatService.searchChannelByName(data.payload.chanName);
				const 	action = {
					type: "asked-join",
					payload: {
						message: "",
						messages: searchChannel?.messages,
						chanName: data.payload.chanName,
					}
				};
				if (searchChannel === undefined)
					return ;
				const	searchUser = this.chatService.getUserWithProfileId(data.payload.id);
				if (searchUser === undefined)
					throw new Error("'asked-join ChatSocketEvent");
				searchUser?.channels.push(searchChannel.id);
				if (searchChannel.isMember(client.id) === true)
					action.payload.message = "You are already in this channel";
				if (searchChannel.mode === "private")
					action.payload.message = "This channel is private";
				if (searchChannel.isBanned(client.id) === true)
					action.payload.message = "You have been banned from this channel";
				client.emit("display-channels", action);
				const	userMe = this.chatService.getUserBySocketId(client.id);
				if (userMe === undefined)
					return ;
				if (action.payload.message === "")
				{
					client.join(data.payload.chanName);
					const id = searchChannel.messages.length + 1;
					const	messageText = "Welcome to the channel, " + userMe.name + " !";
					const newMessage: MessageModel = {
						sender: "server",
						message: messageText,
						id: id,
						username: "server",
					};
					searchChannel.addNewMessage(newMessage);
					const	messageAction = {
						type: "new-message",
						payload: {
							messages: searchChannel.messages,
							chanName: searchChannel.name,
							socketId: client.id,
							kind: "channel",
						}
					};
					this.server.to(searchChannel.name).emit("update-messages", messageAction);

					searchChannel.members++;
					const obj: MemberSocketIdModel = {
						memberSocketId: client.id,
						profileId: this.chatService.getProfileIdFromSocketId(client.id) as string,
					};
					searchChannel?.users.push(obj);
					searchChannel.sockets.push(client);
					this.chatService.updateDatabase();
				}
			}

			if(data.type === "password-for-protected")
			{
				const	action = {
					type: "protected-password",
					payload: {
						correct: "false"
					}
				};
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel?.password === data.payload.password)
				{
					action.payload.correct = "true";
				}
				client.emit("display-channels", action);
			}

			if (data.type === "did-I-join")
			{
				let	channel: Channel;
				channel = this.chatService.searchChannelByName(data.payload.chanName) as Channel;
				if (channel === undefined)
				{
					channel = this.chatService.searchPrivateConvByName(data.payload.chanName) as Channel;
				}
				const	action = {
					type: "confirm-is-inside-channel",
					payload: {
						chanName: data.payload.chanName,
						isInside: "",
						chanMessages: channel?.messages,
						kind: data.payload.kind,
					}
				};
				if (channel.isMember(client.id) === false)
					action.payload.isInside = "You must first join the channel";
				client.emit("channel-info", action);
			}

			if (data.type === "leave-channel")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				const	user = this.chatService.getUserBySocketId(client.id);
				if (channel === undefined || user === undefined)
					return ;
				channel.leaveChannel(client);
				client.leave(channel.name);
				const message = user.name + " has left this channel.";
				const id = channel.messages.length + 1;
				const newMessage: MessageModel = {
					sender: "server",
					message: message,
					id: id,
					username: "server",
				};
				channel.addNewMessage(newMessage);
				const	action = {
					type: "left-channel",
					payload: {
						chanName: data.payload.chanName,
						message: message,
						messages: channel.messages,
						kind: "channel",
					}
				};
				this.server.to(data.payload.chanName).emit("update-messages", action);
				action.payload.message = "You have been removed from " + data.payload.chanName;
				client.emit("left-message", action);
				this.chatService.updateDatabase();
			}

			if (data.type === "kick-member" || data.type === "ban-member")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	targetClient = channel.findClientById(data.payload.userName);
				if (targetClient === undefined)
					return ;
				const	target = this.chatService.getUserBySocketId(targetClient.id);
				if (target === undefined)
					return ;
				const id = channel.messages.length + 1;
	
				let message: string;
				const newMessage: MessageModel = {
					sender: "server",
					message: "",
					id: id,
					username: "server",
				};
				if (channel.isOwner(targetClient.id) === false)
				{
					channel.leaveChannel(targetClient);
					targetClient.leave(channel.name);
					if (data.type === "kick-member")
					{
						newMessage.message = target.name + " has been kicked.";
					}
					else
					{
						newMessage.message = target.name + " has been banned.";
						channel.addToBanned(target.id, target.profileId);
					}
					channel.addNewMessage(newMessage);
				}
				else
					newMessage.message = "Don't touch the owner of the channel !";

				const	action = {
					type: "left-channel",
					payload: {
						message: newMessage.message,
						messages: channel.messages,
						chanName: channel.name,
						kind: "channel",
					}
				};
				
				if (channel.isOwner(targetClient.id) === false)
				{
					this.server.to(channel.name).emit("update-messages", action);
					if (data.type === "kick-member")
						action.payload.message = "You have been kicked from " + channel.name;
					else
						action.payload.message = "You have been banned from " + channel.name;
				
					const indexToRemove = channel.admins.findIndex((admin) =>
					{
						return (admin.profileId === target.profileId);
					})
					channel.admins.splice(indexToRemove, 1);
					targetClient.emit("left-message", action);
				}
				else
				{
					action.type = "unsuccessful-kick";
					client.emit("user-info", action);
				}
				this.chatService.updateDatabase();
			}

			if (data.type === "member-list")
			{
				let channel;
				let	conv: boolean, isFriend;
				let	talkingUser: string;
				talkingUser = "";
				conv = false;
				isFriend = false;
				let	friendProfId: string;

				friendProfId = "";
				channel = this.chatService.searchChannelByName(data.payload.chanName);
				const	testChatUsers = this.chatService.getAllUsersArray();
				const	profId = this.chatService.getProfileIdFromSocketId(client.id);
				const	searchUser = this.chatService.getUserWithProfileId(profId);
				if (searchUser === undefined)
					return ;
				if (channel === undefined)
				{
					channel = this.chatService.searchPrivateConvByName(data.payload.chanName);
					if (channel === undefined)
						return ;
					conv = true;
				}
				const	isAdmin = channel.isAdmin(profId);
				const	memberList: MembersModel[] = [];
				let		userName: string;
				userName = "";
				if (conv)
				{
					for(const user of testChatUsers)
					{
						if (user !== undefined && user?.profileId !== "undefined" && user.profileId !== undefined)
						{
							userName = this.chatService.getUsernameWithProfileId(user.profileId) as string;
							if (user.profileId !== profId)
							{
								friendProfId = user.profileId;
								talkingUser = userName;
								const	searchFriend = searchUser.friends.find((elem) =>
								{
									return (elem.name === userName);
								});
								if (searchFriend !== undefined)
									isFriend = true
							}
							const newMember: MembersModel = {
								id: memberList.length + 1,
								// replace socketId by profileId
								name: user.profileId,
								profileId: user.profileId,
								userName: userName,
								status: user.status,
								online: user.online
							};
							memberList.push(newMember);
						}
					}
				}
				else
				{
					for(const user of channel.users)
					{
						if (user !== undefined && user?.profileId !== "undefined" && user.profileId !== undefined)
						{
							userName = this.chatService.getUsernameWithProfileId(user.profileId) as string;
							const	searchU = this.chatService.getUserWithProfileId(user.profileId);
							if (searchU === undefined)
							{
								return ;
							}
							if (user.profileId !== profId && conv)
							{
								friendProfId = user.profileId;
								talkingUser = userName;
								const	searchFriend = searchUser.friends.find((elem) =>
								{
									return (elem.name === userName);
								});
								if (searchFriend !== undefined)
									isFriend = true
							}
							const newMember: MembersModel = {
								id: memberList.length + 1,
								// replace socketId by profileId
								name: user.profileId,
								profileId: user.profileId,
								userName: userName,
								status: searchU.status,
								online: searchU.online,
							};
							memberList.push(newMember);
						}
					}
				}
				const	action = {
					type: "display-members",
					payload: {
						memberList: memberList,
						isAdmin: isAdmin,
						// uniqueId profId instead of socketId
						uniqueId: profId,
						talkingUser: talkingUser,
						isFriend: isFriend,
						friendId: friendProfId
					}
				};
				client.emit("channel-info", action);
			}
		}

		@SubscribeMessage("user-info")
		handleUsers(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "add-friend")
			{
				this.logger.debug("add friend requested");
				const	friendUser = this.chatService.getUserWithProfileId(data.payload.friendProfileId);
				const	userMe = this.chatService.getUserBySocketId(client.id);

				if (userMe === undefined || friendUser === undefined)
					return ;
				let message: string;
				message = "";
				const	state = this.userService.addFriends(userMe.profileId, friendUser.profileId);
				if (state === "ERROR")
					return ;
				if (state === "ALREADY_FRIENDS")
					message = friendUser.name + " is already your friend";
				const	myArrayProfileId = this.userService.getFriendsProfileId(userMe.profileId);
				const	myFriendArray: Array<FriendsModel> = [];
				const	myFriendNameArray: Array<string> = [];

				myArrayProfileId.forEach((elem, index) =>
				{
					const toPush = this.userService.getFriendModel(elem, index);
					if (toPush === undefined)
						throw new Error("Error");
					myFriendArray.push(toPush);
					myFriendNameArray.push(this.userService.getFriendName(elem));
				});

				// NOTICE HERE FRIENDS WAS PUSHED

				userMe.friends = [...myFriendArray];
				const	action = {
					type: "add-friend",
					payload: {
						friendList: myFriendNameArray,
						newFriend: friendUser.name,
						alreadyFriend: message,
						friendProfileId: friendUser.profileId
					}
				};
				client.emit("user-info", action);
				this.chatService.updateDatabase();
			}

			if (data.type === "block-user")
			{
				const	userMe = this.chatService.getUserBySocketId(client.id);
				if (userMe === undefined)
					return ;
				// const	searchSocket = this.chatService.getUserBySocketId(data.payload.blockedName);
				
				const	userToBlock = this.chatService.getUserWithProfileId(data.payload.blockedName);
				if (userToBlock === undefined)
					return ;
				const blockedToAdd: MemberSocketIdModel = {
					memberSocketId: userToBlock.id,
					profileId: userToBlock.profileId,
				};
				const arrayBlocked: string[] = [];
				userMe.blocked.push(blockedToAdd);
				userMe.blocked.forEach((blocked) =>
				{
					arrayBlocked.push(blocked.profileId);
				});
				const	action = {
					type: "block-user",
					payload: {
						blockedList: arrayBlocked,
						newBlocked: userToBlock.name,
						blockedProfileId: userToBlock.profileId,
					}
				};
				client.emit("user-info", action);
				this.chatService.updateDatabase();
			}

			if (data.type === "mute-user")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	targetClient = channel.findClientById(data.payload.userName);
				if (targetClient === undefined)
					return ;
				const	action = {
					type: "set-is-muted",
					payload: {
						chanName: channel.name,
						message: "",
					}
				};
				if (channel.isOwner(targetClient.id) === true)
				{
					action.type = "unsuccessful-kick";
					action.payload.message = "Don't touch the owner of the channel!";
					client.emit("user-info", action);
				}
				else
					targetClient.emit("user-info", action);
			}

			if (data.type === "invite-member")
			{
				const	userMe = this.chatService.getUserBySocketId(client.id);
				if (userMe === undefined)
					return ;
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
				{
					this.logger.error("Channel is undefined ");
					return ;
				}
				const	searchUser = this.chatService.getUserWithProfileId(data.payload.userName);
				if (searchUser === undefined)
				{
					return ;
				}
				const	targetClient = searchUser.client;
				if (targetClient === undefined || targetClient === null)
					return ;
				const	action = {
					type: "invite-member",
					payload: {
						message: "",
					}
				};
				if (channel.isMember(client.id) === false)
				{
					action.payload.message = "You are not in the channel " + channel.name;
					client.emit("user-info", action);
				}
				else if (channel.isMember(targetClient.id) === true)
				{
					action.payload.message = searchUser.name + " is already in the channel.";
					client.emit("user-info", action);
				}
				else if (channel.isBanned(targetClient.id) === true)
				{
					action.payload.message = searchUser.name + " has been banned from this channel.";
					client.emit("user-info", action);
				}
				else
				{
					action.payload.message = "You have been added to the channel " + data.payload.chanName
						+ " by " + userMe.name;
					targetClient.emit("user-info", action);
					action.payload.message = searchUser.name + " has been successfully added to the channel "
						+ data.payload.chanName;
					client.emit("user-info", action);

					targetClient.join(channel.name);
					channel.members++;
					channel.sockets.push(targetClient);
					const obj: MemberSocketIdModel = {
						memberSocketId: targetClient.id,
						profileId: searchUser.profileId as string,
					};
					channel.users.push(obj);

					const id = channel.messages.length + 1;
					const newMessage: MessageModel = {
						sender: "server",
						message: searchUser.name + " has been added by " + userMe.name,
						id: id,
						username: "server",
					};
					channel.addNewMessage(newMessage);
					const	messageAction = {
						type: "new-message",
						payload: {
							messages: channel.messages,
							chanName: channel.name,
							socketId: client.id,
							kind: "channel",
						}
					};
					this.server.to(channel.name).emit("update-messages", messageAction);
				}
				this.chatService.updateDatabase();
			}

			if (data.type === "make-admin")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	tmpUser = this.chatService.getUserWithProfileId(data.payload.userName);
				if (tmpUser === undefined)
					return ;
				const	targetClient = tmpUser.client;
				if (targetClient === undefined || targetClient === null)
					return ;
				const	action = {
					type: "make-admin",
					payload: {
						message: "",
					}
				};

				if (channel.isOwner(client.id) === false)
				{
					action.payload.message = "You are not the owner";
					return ;
				}
				if (channel.isAdmin(targetClient.id) === true)
				{
					action.payload.message = targetClient.id + " is already an admin.";
					client.emit("user-info", action);
				}
				else
				{
					action.payload.message = "You are now an admin of the channel " + channel.name;
					targetClient.emit("user-info", action);
					channel.addAdmin(targetClient.id);
				}

				const id = channel.messages.length + 1;
					const newMessage: MessageModel = {
						sender: "server",
						message: this.chatService.getUsernameWithProfileId(tmpUser.profileId) + " is now an admin.",
						id: id,
						username: "server",
					};
					channel.addNewMessage(newMessage);
					const	messageAction = {
						type: "new-message",
						payload: {
							messages: channel.messages,
							chanName: channel.name,
							socketId: client.id,
							kind: "channel",
						}
					};
					this.server.to(channel.name).emit("update-messages", messageAction);
					this.chatService.updateDatabase();
			}

			if (data.type === "is-my-conv")
			{
				let	isMyConv: boolean;
				const	searchConv = this.chatService.searchPrivateConvByName(data.payload.name);
				if (searchConv === undefined)
					return ;
				const	profileId = this.chatService.getProfileIdFromSocketId(client.id);
				if (profileId === undefined)
					return ;
				const	userMe = searchConv.users.find((elem) =>
				{
					return (elem.profileId === profileId);
				});
				if (userMe === undefined)
					isMyConv = false;
				else
					isMyConv = true;
				const	action = {
					type: "is-my-conv",
					payload: {isMyConv: isMyConv}
				};
				client.emit("is-my-conv", action);
			}
		}
	}
