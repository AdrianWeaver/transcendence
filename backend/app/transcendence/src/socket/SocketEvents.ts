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

	// receive an event 
	@SubscribeMessage("message")
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket)
	{
		// Send event
		this.server.emit("message", client.id, data);
	}

	@SubscribeMessage("stateWriteServ")
	handleWriteState()
	{
		console.log((Date.now() - this.lastWrite > 2000));
		if (Date.now() - this.lastWrite > 2000)
			this.stateWrite = true;
		else
			this.stateWrite = false;
		this.server.emit("stateWrite", this.stateWrite);
	}

	@SubscribeMessage("enableStateWrite")
	handleEnableWriteState()
	{
		this.lastWrite = Date.now();
		this.stateWrite = true;
	}
}
