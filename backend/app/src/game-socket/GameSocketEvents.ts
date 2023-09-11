/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

// eslint-disable-next-line max-classes-per-file
import
{
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

class	GameServe
{
	// constructor()
	// {

	// }
}

class	NodeAnimationFrame
{
	public frameRate: number;
	public frameNumber: number;
	public gameActive: boolean;
	public game: undefined;
	public requestFrame: (callbackFunction: any) => void;
	public callbackFunction:
		((timestamp: number, frame: number) => void) | null;
	public update: (timestamp: number) => void;

	// eslint-disable-next-line max-statements
	constructor()
	{
		this.frameRate = 30;
		this.frameNumber = 0;
		this.gameActive = true;
		this.game = undefined;
		this.requestFrame = (callbackFunction) =>
		{
			if (this.frameNumber === (Number.MAX_VALUE - 1))
				this.frameNumber = 0;
			setTimeout(() =>
			{
				callbackFunction(performance.now());
			}, 1000 / (this.frameRate));
		};
		this.callbackFunction = null;
		this.update = (timestamp) =>
		{
			if (this.callbackFunction === null)
			{
				console.log("Error: no callback function provided");
				return ;
			}
			this.callbackFunction(timestamp, this.frameNumber);
			this.frameNumber++;
			this.requestFrame(this.update);
		};
	}
}

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
	loop: NodeAnimationFrame;
	gameServe: GameServe;
	printPerformance: (timestamp: number, frame: number) => void;

	public	constructor()
	{
		this.printPerformance = (timestamp: number, frame: number) =>
		{
			// console.log(timestamp, frame);
			// console.log(frame);
			this.server.volatile.emit("game-event", {data: frame});
		};
	}

	afterInit(server: Server)
	{
		this.server = server;
		this.users = 0;
		this.loop = new NodeAnimationFrame();
		// console.log("DEBUG: Server gateway initialized :", server);
		this.loop.callbackFunction = this.printPerformance;
		this.loop.update(performance.now());
	}

	handleConnection(client: Socket)
	{
		console.log("DEBUG: A client is connected: " + client.id);
		this.users += 1;
	}

	handleDisconnect(client: Socket)
	{
		// console.log("DEBUG: A client disconnected", client);
		this.users -= 1;
	}


}
