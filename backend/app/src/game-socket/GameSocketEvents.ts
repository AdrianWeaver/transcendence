
import
{
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
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
	// namespace: "/game-engine-v2d"
})
export class GameSocketEvents
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	users: number;

	afterInit(server: Server)
	{
		this.server = server;
		this.users = 0;
		// console.log("DEBUG: Server gateway initialized :", server);
	}

	handleConnection(client: Socket)
	{
		// console.log("DEBUG: A client is connected", client);
	}

	handleDisconnect(client: Socket)
	{
		// console.log("DEBUG: A client disconnected", client);
	}
}
