/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import { Server, Socket } from "socket.io";
import Chat from "./Objects/Chat";
import User from "./Objects/User";
import Channel from "./Objects/Channel";

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

type	ActionSocket = {
	type: string,
	payload?: any
};

type MessageModel =
{
	sender: string,
	message: string,
	id: number
}

type	MembersModel =
{
	id: number,
	name: string
}

@WebSocketGateway(
{
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
		// chat: Chat;

		public	constructor(private readonly chatService: ChatService)
		{
		}

		afterInit(server: any)
		{
		}

		handleConnection(client: Socket)
		{
			const searchUser = this.chatService.searchUser(client.id);
			if (searchUser === undefined)
			{
				const newUser = new User("test", client);
				this.chatService.pushUser(newUser, client.id);
				const	action = {
					type: "init-channels",
					payload: {
						channels: this.chatService.getChanMap(),
						uniqueId: client.id,
						privateMessage: this.chatService.getPrivateMessageMap()
					}
				};
				client.emit("display-channels", action);
			}
		}

		handleDisconnect(client: Socket)
		{
			const	userIndex = this.chatService.searchUserIndex(client.id);
			const	socketIndex = this.chatService.searchSocketIndex(client.id);
			if (userIndex !== undefined)
				this.chatService.deleteUser(userIndex, socketIndex);
		}

		@SubscribeMessage("display-conversation")
		handleDisplayConversationWindow(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
				if (data.type === "display-conversation")
				{
					// const chanName = this.chatService.createPrivateConvName(client.id, data.payload.id);
					// const chanName1 = this.chatService.createPrivateConvName(data.payload.id, client.id);
					// // const kind = "privateMessage";
					// const searchConv = this.chatService.searchPrivateConvByUsers(chanName, data.payload.id, client.id);
					// const searchConv1 = this.chatService.searchPrivateConvByUsers(chanName1, data.payload.id, client.id);
					// if (searchConv !== undefined)
					// {
					// 	const action = {
					// 		type: "conversation",
					// 		payload:
					// 		{
					// 			sender: client.id,
					// 			conversationId: searchConv
					// 		}
					// 	};
					// 	this.server.to(data.payload.chanName).emit("display-conversation", action);
					// }
					// else if (searchConv1 !== undefined)
					// {
					// 	const action = {
					// 		type: "conversation",
					// 		payload:
					// 		{
					// 			sender: client.id,
					// 			conversationId: searchConv1
					// 		}
					// 	};
					// 	this.server.to(data.payload.chanName).emit("display-conversation", action);
					// }
					// else
					// {
						const action = {
							type: "conversation",
							payload:
							{
								sender: client.id,
								// conversationId: chanName
							}
						};
						this.server.to(data.payload.chanName).emit("display-conversation", action);
					// }
				}
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

		@SubscribeMessage("info")
		handleInformation(
			@MessageBody() data: ActionSocket,
			@ConnectedSocket() client: Socket
		)
		{
			if (data.type === "get-user-list")
			{
				console.log(data);
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
			// console.log(data);
			// console.log(this.chatService.getAllUsers());
			// switch (data.type)
			// {
			// 	case "get-user-list":
			// 		client.emit("info", this.chatService.getAllUsers());
			// 		// console.log(this.chatService.getAllUsers());
			// 		break;
			// 	default:
			// 		break;
			// }

			if (data.type === "sent-message")
			{
				const	channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				if (data.payload.message.trim().length === 0)
					return ;
				const	id = channel.messages.length + 1;
				const newMessage: MessageModel = {
					sender: client.id,
					message: data.payload.message,
					id: id
				};
				channel.addNewMessage(newMessage);
				const	action = {
					type: "update-messages",
					payload: {
						messages: channel.messages,
						chanName: channel.name,
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
				// const	isCreated = this.chatService.searchChannelByName(data.payload.chanName);
				// if (isCreated === undefined)
				// {
					let kind;
					console.log(" TEST 245 event ", data.payload);
					const	searchUser = this.chatService.searchUserIndex(data.payload.activeId);
					let		chanName;
					let		searchConv;
					if (searchUser > -1)
					{
						chanName = this.chatService.createPrivateConvName(client.id, data.payload.activeId);
						const chanName1 = this.chatService.createPrivateConvName(data.payload.activeId, client.id);
						searchConv = this.chatService.searchPrivateConvByUsers(chanName, data.payload.activeId, client.id);
						if (searchConv === undefined)
							searchConv = this.chatService.searchPrivateConvByUsers(chanName1, data.payload.activeId, client.id);
						if (searchConv === undefined)
							searchConv = this.chatService.searchPrivateConvByName(chanName);
						kind = "privateMessage";
					}
					else
					{
						chanName = data.payload.chanName;
						kind = "channel";
					}
					// TEST
					console.log("socketEvent ", chanName);
					console.log(" searchUser ", searchUser);
					if (kind === "channel")
					{
						console.log(" is chan ? " + searchConv);
						const newChannel = new Channel(chanName,
						client,
						data.payload.chanMode,
						data.payload.chanPassword,
						kind);
						newChannel.chat = this.chatService.getChat();
						client.join(newChannel.name);
						this.chatService.addNewChannel(newChannel, data.payload.chanId, kind);
						const	action = {
							type: "add-new-channel",
							payload:
							{
								chanMap: this.chatService.getChanMap(),
								kind: kind,
								privateMessageMap: this.chatService.getPrivateMessageMap()
							}
						};
						this.server.emit("display-channels", action);
					}
					if (kind === "privateMessage")
					{
						if (searchConv === undefined)
						{
							const newPrivateMsg = new Channel(chanName,
							client,
							"",
							"",
							kind);
							newPrivateMsg.chat = this.chatService.getChat();
							newPrivateMsg?.users.push(data.payload.activeId);
							newPrivateMsg?.users.push(client.id);
							newPrivateMsg?.addAdmin(data.payload.activeId);
							newPrivateMsg?.addAdmin(client.id);
							client.join(newPrivateMsg.name);
							this.chatService.addNewChannel(newPrivateMsg, data.payload.pmIndex, kind);
						}
						const	action = {
							type: "add-new-channel",
							payload:
							{
								chanMap: this.chatService.getChanMap(),
								kind: kind,
								privateMessageMap: this.chatService.getPrivateMessageMap()
							}
						};
						this.server.emit("display-channels", action);
						// newChannel?.addAdmin(client.id);
					}
				// }
				// else
				// {
				// 	const	action = {
				// 		type: "add-new-channel",
				// 		payload:
				// 		{
				// 			chanMap: this.chatService.getChanMap(),
				// 			kind: "undefined",
				// 			privateMessageMap: this.chatService.getPrivateMessageMap()
				// 		}
				// 	};
				// 	this.server.emit("display-channels", action);
				// }
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
					this.server.emit("display-channels", action);
				}
				else
				{
					action.payload.message = "You are not the channel's admin !";
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
				if (searchChannel.isMember(client.id) === true)
					action.payload.message = "You are already in this channel.";
				if (searchChannel.mode === "private")
					action.payload.message = "This channel is private";
				if (searchChannel.isBanned(client.id) === true)
					action.payload.message = "You have been banned from this channel";
				client.emit("display-channels", action);
				if (action.payload.message === "")
				{
					client.join(data.payload.chanName);
					const id = searchChannel.messages.length + 1;
					const messageText = "Welcome to the channel, " + client.id + " !";
					const newMessage: MessageModel = {
						sender: "server",
						message: messageText,
						id: id
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
					searchChannel?.users.push(client.id);
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
					action.payload.correct = "true";
				client.emit("display-channels", action);
			}

			if (data.type === "did-I-join")
			{
				let	channel;
				channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					channel = this.chatService.searchPrivateConvByName(data.payload.chanName);
				const	action = {
					type: "confirm-is-inside-channel",
					payload: {
						chanName: data.payload.chanName,
						isInside: "",
						chanMessages: channel?.messages,
					}
				};
				// if (channel?.kind === "privateMessage")
				// 	channel?.isMember(client.id) === true;
				if (channel?.isMember(client.id) === false)
					action.payload.isInside = "You must first join the channel";
				client.emit("channel-info", action);
			}

			if (data.type === "leave-channel")
			{
				const channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				channel.leaveChannel(client);
				const message = client.id + "has left this channel.";
				const id = channel.messages.length + 1;
				const newMessage: MessageModel = {
					sender: "server",
					message: message,
					id: id
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
			}

			if (data.type === "member-list")
			{
				const channel = this.chatService.searchChannelByName(data.payload.chanName);
				if (channel === undefined)
					return ;
				const	memberList: MembersModel[] = [];
				for(const user of channel.users)
				{
					const newMember: MembersModel = {
						id: memberList.length + 1,
						name: user,
					};
					memberList.push(newMember);
				}
				const	action = {
					type: "display-members",
					payload: {
						memberList: memberList,
					}
				};
				client.emit("channel-info", action);
			}
		}
	}
