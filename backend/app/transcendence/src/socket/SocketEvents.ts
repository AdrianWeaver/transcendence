import
{
	MessageBody,
	ConnectedSocket,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(
{
	cors:
	{
		origin: "*"
	},
})

export class SocketEvents
{
	@WebSocketServer()
	server: Server;

	stateWrite: boolean;
	lastWrite: number;

	// connection
	handleConnection(client: Socket)
	{
		console.log("Client connect to socket.io:", client.id);
		this.server.emit("stateWrite", false);
		this.stateWrite = false;
		this.lastWrite = Date.now();
	}

	// Disconnect
	handleDisconnect(client: Socket)
	{
		console.log("Client disconnect: ", client.id);
	}

	// Recevoir un event 
	@SubscribeMessage("message")
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket)
	{
		// Send event
		this.server.emit("message", client.id, data);
	}
}
