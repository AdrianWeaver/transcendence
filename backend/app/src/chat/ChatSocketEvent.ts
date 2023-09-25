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
} from "@nestjs/websockets";

type	ActionSocket = {
	type: string,
	payload?: any
};

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
		chat: Chat;

		public	constructor()
		{
			this.chat = new Chat();
		};

		afterInit(server: any) {
		}

		handleConnection(client: Socket)
		{
			const searchUser = this.chat.users.find((element) =>
			{
				return (element.id === client.id);
			});
			if (searchUser === undefined)
			{
				const newUser = new User("test", client);
				this.chat.users.push(newUser);
				this.chat.memberSocketIds.push(client.id);
			}
		}

		handleDisconnect(client: Socket)
		{
			const	searchUser = this.chat.users.findIndex((element) =>
			{
				return (element.id === client.id);
			});
			const	searchUserSocket = this.chat.memberSocketIds.findIndex((element) =>
			{
				return (element === client.id);
			});
			if (searchUser !== undefined)
			{
				this.chat.users.splice(searchUser, 1);
				this.chat.memberSocketIds.splice(searchUserSocket, 1);
			}
		}
		// @SubscribeMessage("pseudo-message")
		// handlePseudoMessage(
		// 	@MessageBody() data: ActionSocket,
		// 	@ConnectedSocket() client: Socket
		// )
		// {
		// 	chatServe.pseudo = data.payload.chatPseudo;
		// }
	}
