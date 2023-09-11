/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

// eslint-disable-next-line max-classes-per-file
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

import { Server, Socket } from "socket.io";
import GameServe from "./Objects/GameServe";
import { exit } from "process";

// class	GameServe
// {
// 	constructor()
// 	{

// 	}
// }

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
	update: () => void;

	public	constructor()
	{
		this.update = () =>
		{
			this.gameServe.playerOne.updatePlayerPosition();
			this.gameServe.playerTwo.updatePlayerPosition();

			this.gameServe.ball.update();
		};

		this.printPerformance = (timestamp: number, frame: number) =>
		{
			// console.log(timestamp, frame);
			// // console.log(frame);
			// console.log("x: ", this.gameServe.ball.pos.x);
			// console.log("y: ", this.gameServe.ball.pos.y);

			this.update();
			// console.log(this.gameServe);
			// exit(1);
			this.server.volatile.emit("game-event",
			{
				frameNumber: frame,
				ballPos: {
					x: this.gameServe.ball.pos.x,
					y: this.gameServe.ball.pos.y,
				}
			});
		};
	}

	afterInit(server: Server)
	{
		this.server = server;
		this.users = 0;
		this.loop = new NodeAnimationFrame();
		// console.log("DEBUG: Server gateway initialized :", server);
		this.loop.callbackFunction = this.printPerformance;
		this.gameServe = new GameServe();
		this.gameServe.ball.game = this.gameServe;
		this.gameServe.board.game = this.gameServe;
		this.gameServe.net.game = this.gameServe;
		this.gameServe.board.init();
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
		// if (this.users > 0)
		this.users -= 1;
	}

	@SubscribeMessage("info")
	handleInfo(
		@MessageBody() data: string,
		@ConnectedSocket() client: Socket)
	{
		// console.log(data);
		if (data === "Get board size")
			client.emit("info", this.gameServe.board.dim);
	}
}
