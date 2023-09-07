import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway(
{
	cors:
	{
		origin: "*"
	}
})
export class GameSocketEvents
{
	@WebSocketServer()
	server: Server;
	users: number;

	handleConnection(client: Socket)
	{
		console.log("A client is connected", client);
	}

	handleDisconnect(client: Socket)
	{
		console.log("A client disconnected", client);
	}
}
