import { Server, Socket } from "socket.io";

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
		users: number;
		socketIdUsers: string[] = [];
		update: () => void;
	
		public	constructor()
		{
			
		};

		afterInit(server: any) {
			
		}

		handleConnection(client: Socket)
		{
			// const searchUser = this.socketIdUsers.find((element) =>
			// {
			// 	return (element === client.id);
			// });
			// if (searchUser === undefined)
			// {
			// 	this.socketIdUsers.push(client.id);
			// 	this.users += 1;
			// }

			// const	action = {
			// 	type: "connect",
			// 	payload: {
			// 		numberUsers: this.users,
			// 		socketId: client.id
			// 	}
			// }
		}

		handleDisconnect(client: Socket) {
			
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

