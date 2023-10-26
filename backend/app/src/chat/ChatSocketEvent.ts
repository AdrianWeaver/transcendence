/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { Server, Socket } from "socket.io";
import Chat from "./Objects/Chat";
import User from "./Objects/User";
import Channel from "./Objects/Channel";
import { v4 as uuidv4 } from "uuid";
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
import { ChatService } from "./Chat.service";
import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserService } from "src/user/user.service";
import	* as jwt from "jsonwebtoken";
import { profile } from "console";

type	ActionSocket = {
	type: string,
	payload?: any
};

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
}

type	FriendsModel =
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
			private readonly userService: UserService)
		{
			this.logger.debug("An instance is started with chat service id: "
				+ this.chatService.getChatInstanceId());
			this.logger.debug("User instance service is :"
				+ this.userService.getUuidInstance());
		}

		afterInit(server: any)
		{
			// this.chatService.setServer(this.server);
		}

		handleConnection(client: Socket)
		{
			this.chatService.setServer(this.server);
			// console.log(client.handshake.auth);
			// if (client.handshake.auth)
			let profileId: string;
			if (client.handshake.auth)
			{
				const	secret = this.userService.getSecret();
				const	bearerToken: string = client.handshake.auth.token;
				// console.log(bearerToken);
				const	token = bearerToken.split("Bearer ");
				if (token.length !== 2)
				{
					client.disconnect();
					return ;
				}
				try
				{
					const decodedToken = jwt.verify(token[1], secret) as jwt.JwtPayload;
					console.log("Decoded Token ", decodedToken);
					// decodedToken.id
					profileId = decodedToken.id;

					this.logger.warn("ProfileId: ", profileId);

					const index = this.chatService.getIndexUserWithProfileId(profileId);
					if (index === -1)
					{
						this.logger.log("User not found");
						const userName = this.userService.getUsernameByProfileId(profileId) as string;
						const newUser = new User(userName, client, profileId);
						this.chatService.pushUser(newUser, client.id);
					}
					else
					{
						this.logger.log("User found");
						this.chatService.setSocketToUser(index, client);
						this.chatService.updateUserSocketInChannels(client);

						this.chatService.updateMemberSocketId(client.id, profileId);

						this.chatService.updateChannelsAdminSocketId(client.id, profileId);
						this.chatService.updateChannelOwner(client.id, profileId);
						this.chatService.updateUserInChannels(client.id, profileId);
						this.chatService.updateUserInChat(client.id, profileId);

						this.chatService.updateBannedInChannel(client.id, profileId);
						// this.chatService.checkOldSocketInChannels(client, oldSocketId);
					}
					this.chatService.updateDatabase();
					// console.log(this.chatService.getAllUsersArray());
				}
				catch (error)
				{
					if (error instanceof jwt.JsonWebTokenError)
					{
						this.logger.warn("A client try to connect without authenticate");
						client.disconnect();
						return ;
					}
					this.logger.error(error);
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
						uniqueId: client.id,
						privateMessage: this.chatService.getPrivateMessageMap(),
					}
				};
				client.emit("repopulate-on-reconnection", action);
			}
		}

		handleDisconnect(client: Socket)
		{
			// const	userIndex = this.chatService.searchUserIndex(client.id);
			// const	socketIndex = this.chatService.searchSocketIndex(client.id);
			// if (userIndex !== undefined)
			// {
				// this.chatService.deleteUser(userIndex, socketIndex);
				// this.chatService.updateDatabase();
			// }
		}

		// @SubscribeMessage("display-conversation")
		// handleDisplayConversationWindow(
		// 	@MessageBody() data: ActionSocket,
		// 	@ConnectedSocket() client: Socket
		// )
		// {
		// 	if (data.type === "display-conversation")
		// 	{
		// 		const action = {
		// 			type: "conversation",
		// 			payload:
		// 			{
		// 				sender: client.id,
		// 				// conversationId: chanName
		// 				privMsgMap: this.chatService.getPrivateMessageMap()
		// 			}
		// 		};
		// 		this.server.to(data.payload.chanName).emit("display-conversation", action);
		// 	}
		// }

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

		@SubscribeMessage("info")
		handleInformation(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "get-user-list")
			{
				const copyUsers = this.chatService.getAllUsers();
				const	searchUser = copyUsers.findIndex((elem) =>
				{
					return (client.id === elem.id);
				});
				copyUsers.splice(searchUser, 1);
				const action = {
					type: "sending-list-user",
					payload:
					{
						// arrayListUsers: this.chatService.getAllUsers(),
						arrayListUsers: copyUsers,
						kind: "privateMessage"
					}
				};
				client.emit("info", action);
			}

			if (data.type === "sent-message")
			{
				let	channel, kind;
				channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
				{
					channel = this.chatService.searchPrivateConvByName(data.payload.chanName);
					if (channel === undefined)
						return ;
					else
						kind = "privateMessage";
				}
				else
					kind = "channel";
				if (data.payload.message.trim().length === 0)
					return ;
				const	id = channel.messages.length;

				const newMessage: MessageModel = {
					sender: client.id,
					message: data.payload.message,
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
						kind: kind
					}
				};
				this.server.to(channel.name).emit("update-messages", action);
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
					const	searchUser = this.chatService.searchUserIndex(data.payload.activeId);
					let		chanName;
					let		searchConv;
					if (searchUser > -1 && data.payload.kind !== "channel")
					{
						chanName = this.chatService.createPrivateConvName(client.id, data.payload.activeId);
						const chanName1 = this.chatService.createPrivateConvName(data.payload.activeId, client.id);
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
							console.error("Error profile chat socket  event");
						const newChannel = new Channel(
							chanName,
							client,
							data.payload.chanMode,
							data.payload.chanPassword,
							kind,
							profileId
						);
						newChannel.chat = this.chatService.getChat();
						client.join(newChannel.name);
						// const userToChannel: MemberSocketIdModel = {
						// 	memberSocketId: client.id,
						// 	profileId: this.chatService.getProfileIdFromSocketId(client.id),
						// };
						// newChannel.users.push(userToChannel);
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
					else if (kind === "privateMessage")
					{
						if (searchConv === undefined && alreadyCreated === false)
						{
							const newPrivateMsg = new Channel(
								chanName,
								client,
								"",
								"",
								kind,
								this.chatService.getProfileIdFromSocketId(client.id)
							);
							newPrivateMsg.chat = this.chatService.getChat();
							const obj: MemberSocketIdModel = {
								memberSocketId: data.payload.activeId,
								profileId: this.chatService.getProfileIdFromSocketId(data.payload.activeId),
							};
							newPrivateMsg?.users.push(obj);
							// newPrivateMsg?.users.push(client.id);
							newPrivateMsg?.addAdmin(data.payload.activeId);
							// newPrivateMsg?.addAdmin(client.id);
							// we do not need to add the person who initiated the channel because the contructor does that already
							client.join(newPrivateMsg.name);
							this.chatService.addNewChannel(newPrivateMsg, data.payload.pmIndex, kind);
							this.chatService.updateDatabase();
						}
						const	action = {
							type: "add-new-channel",
							payload:
							{
								chanMap: undefined,
								kind: "privateMessage",
								privateMessageMap: this.chatService.getPrivateMessageMap()
							}
						};
						this.server.emit("display-channels", action);
					}
			}
			if (data.type === "destroy-channel")
			{
				const	searchChannel = this.chatService.searchChannelByName(data.payload.name);
// do the samed for private msg
				let isAdmin: boolean;
				if (searchChannel?.kind === "privateMessage")
					isAdmin = true;
				else
				{
					if (searchChannel?.isAdmin(client.id) === true)
						isAdmin = true;
					else
						isAdmin = false;
				}
				let	msg;
				if (data.payload.kind === "channel")
					msg = "";
				else if (data.payload.kind === "privateMessage")
					msg = "privateMessage";
				const	action = {
					type: "destroy-channel",
					payload: {
						chanMap: this.chatService.getChanMap(),
						message: msg,
						privateMessageMap: this.chatService.getPrivateMessageMap()
					}
				};
				if (isAdmin === true)
				{
					this.chatService.deleteChannel(data.payload.name);
					this.chatService.updateDatabase();
					this.server.emit("display-channels", action);
				}
				else
				{
					action.payload.message = "You are not the channel's admin !";
					client.emit("display-channels", action);
				}
			}

			if (data.type === "asked-join" && data.payload.kind !== "privateMessage")
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

				if (searchChannel.isMember(client.id) === true)
					action.payload.message = "You are already in this channel";
				if (searchChannel.mode === "private")
					action.payload.message = "This channel is private";
				if (searchChannel.isBanned(client.id) === true)
					action.payload.message = "You have been banned from this channel";
				client.emit("display-channels", action);
				if (action.payload.message === "")
				{
					client.join(data.payload.chanName);
					const id = searchChannel.messages.length + 1;
					const	messageText = "Welcome to the channel, " + client.id + " !";
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
						}
					};
					// const room = this.server.sockets.adapter.rooms.get(searchChannel.name);
					// if (room)
					// 	console.log("room members: " + room.size);
					this.server.to(searchChannel.name).emit("update-messages", messageAction);

					searchChannel.members++;
					const obj: MemberSocketIdModel = {
						memberSocketId: client.id,
						profileId: this.chatService.getProfileIdWithUserName(client.id) as string,
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
						correct: ""
					}
				};
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel?.password === data.payload.password)
				{
					// console.log("CORRECT PASSWORD");
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
				console.log(channel);
				if (channel.isMember(client.id) === false)
					action.payload.isInside = "You must first join the channel";
				client.emit("channel-info", action);
			}

			if (data.type === "leave-channel")
			{
				const channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				channel.leaveChannel(client);
				client.leave(channel.name);
				const message = client.id + "has left this channel.";
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
				channel.leaveChannel(targetClient);
				targetClient.leave(channel.name);
				const id = channel.messages.length + 1;
				const profId = this.chatService.getProfileIdFromSocketId(client.id);
				let message: string;
				if (data.type === "kick-member")
					message = data.payload.userName + " has been kicked.";
				else
				{
					message = data.payload.userName + " has been banned.";
					channel.addToBanned(data.payload.userName, profId);
				}
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
						message: message,
						messages: channel.messages,
						chanName: channel.name,
					}
				};
				this.server.to(channel.name).emit("update-messages", action);
				if (data.type === "kick-member")
					action.payload.message = "You have been kicked from " + channel.name;
				else
					action.payload.message = "You have been banned from " + channel.name;
				targetClient.emit("left-message", action);
				this.chatService.updateDatabase();
			}

			if (data.type === "member-list")
			{
				const channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	isAdmin = channel.isAdmin(client.id);
				const	memberList: MembersModel[] = [];
				for(const user of channel.users)
				{
					const profId = this.chatService.getProfileIdWithUserName(user.memberSocketId);
					if (profId === undefined)
						return ;
					const	userName = this.chatService.getUsernameWithSocketId(user.memberSocketId) as string;
					const newMember: MembersModel = {
						id: memberList.length + 1,
						name: user.memberSocketId,
						profileId: profId,
						userName: userName,
					};
					memberList.push(newMember);
				}
				const	action = {
					type: "display-members",
					payload: {
						memberList: memberList,
						isAdmin: isAdmin,
						uniqueId: client.id,
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
				const	userMe = this.chatService.getUserBySocketId(client.id);
				if (userMe === undefined)
					return ;
				let message: string;
				message = "";
				const	newFriend = this.chatService.getUsernameWithSocketId(data.payload.friendName) as string;
				const	profileId = this.chatService.getProfileIdFromSocketId(client.id);
				const friendArray: string[] = [];

				if (userMe.isFriend(profileId) === true)
					message = newFriend + " is already your friend";
				else
				{
					const	id = userMe?.friends.length + 1;
					const newMember: FriendsModel = {
						id: id,
						name: newFriend,
						profileId: profileId,
					};
					userMe?.friends.push(newMember);
					userMe.friends.forEach((friend) =>
					{
						friendArray.push(friend.name);
					});
				}
				const	action = {
					type: "add-friend",
					payload: {
						friendList: friendArray,
						newFriend: newFriend,
						alreadyFriend: message,
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
				const profId = this.chatService.getProfileIdFromSocketId(data.payload.blockedName);
				const blockedToAdd: MemberSocketIdModel = {
					memberSocketId: data.payload.blockedName,
					profileId: profId,
				};
				const arrayBlocked: string[] = [];
				userMe.blocked.forEach((blocked) =>
				{
					arrayBlocked.push(blocked.memberSocketId);
				});
				userMe.blocked.push(blockedToAdd);
				const	action = {
					type: "block-user",
					payload: {
						blockedList: arrayBlocked,
						newBlocked: this.chatService.getUsernameWithSocketId(data.payload.blockedName),
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
					}
				};
				targetClient.emit("user-info", action);
			}

			if (data.type === "invite-member")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	targetClient = this.chatService.searchUser(data.payload.userName)?.client;
				if (targetClient === undefined || targetClient === null)
					return ;
				const	action = {
					type: "invite-member",
					payload: {
						message: "",
					}
				};

				if (channel.isMember(targetClient.id) === true)
				{
					action.payload.message = targetClient.id + " is already in the channel.";
					client.emit("user-info", action);
				}
				if (channel.isMember(client.id) === false)
				{
					action.payload.message = "You are not in the channel " + channel.name;
					client.emit("user-info", action);
				}
				else if (channel.isBanned(targetClient.id) === true)
				{
					action.payload.message = targetClient.id + " has been banned from this channel.";
					client.emit("user-info", action);
				}
				else
				{
					action.payload.message = "You have been added to the channel " + data.payload.chanName
						+ " by " + client.id;
					targetClient.emit("user-info", action);
					action.payload.message = targetClient.id + " has been successfully added to the channel "
						+ data.payload.chanName;
					client.emit("user-info", action);

					targetClient.join(channel.name);
					channel.members++;
					channel.sockets.push(targetClient);
					const obj: MemberSocketIdModel = {
						memberSocketId: targetClient.id,
						profileId: this.chatService.getProfileIdWithUserName(targetClient.id) as string,
					};
					channel.users.push(obj);

					const id = channel.messages.length + 1;
					const newMessage: MessageModel = {
						sender: "server",
						message: targetClient.id + " has been added by " + client.id,
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
				const	targetClient = this.chatService.searchUser(data.payload.userName)?.client;
				if (targetClient === undefined || targetClient === null)
					return ;
				const	action = {
					type: "make-admin",
					payload: {
						message: "",
					}
				};

				if (channel.isAdmin(targetClient.id) === true)
				{
					action.payload.message = targetClient.id + " is already an admin.";
					client.emit("user-info", action);
				}
				else
				{
					action.payload.message = client.id + " has made you an admin of the channel " + channel.name;
					targetClient.emit("user-info", action);
					channel.addAdmin(targetClient.id);
				}

				const id = channel.messages.length + 1;
					const newMessage: MessageModel = {
						sender: "server",
						message: targetClient.id + " is now an admin.",
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
						}
					};
					this.server.to(channel.name).emit("update-messages", messageAction);
					this.chatService.updateDatabase();
			}
		}
	}
