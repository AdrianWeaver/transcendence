/* eslint-disable curly */
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
		this.frameRate = 60;
		this.frameNumber = 0;
		this.gameActive = false;
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
			if (this.gameActive === true)
				this.frameNumber++;
			this.requestFrame(this.update);
		};
	}
}

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
export class GameSocketEvents
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	users: number;
	totalUsers: number;
	socketIdUsers: string[] = [];
	rooms: string[][] = [];
	userReady: number;
	socketIdReady: string[] = [];
	loop: NodeAnimationFrame;
	gameServe: GameServe;
	printPerformance: (timestamp: number, frame: number) => void;
	update: () => void;

	public	constructor()
	{
		this.userReady = 0;
		this.update = () =>
		{
			this.gameServe.playerOne.updatePlayerPosition();
			this.gameServe.playerTwo.updatePlayerPosition();

			this.gameServe.ball.update();
		};

		this.printPerformance = (timestamp: number, frame: number) =>
		{
			if (this.loop.gameActive === false)
				return ;
			this.update();
			const action = {
				type: "game-data",
				payload:
				{
					frameNumber: frame,
					ballPos: {
						x: this.gameServe.ball.pos.x,
						y: this.gameServe.ball.pos.y,
					},
					playerOne:
					{
						pos: {
							x: this.gameServe.playerOne.pos.x,
							y: this.gameServe.playerOne.pos.y,
						}
					},
					playerTwo:
					{
						pos: {
							x: this.gameServe.playerTwo.pos.x,
							y: this.gameServe.playerTwo.pos.y,
						}
					},
					plOneScore: this.gameServe.playerOne.score,
					plTwoScore: this.gameServe.playerTwo.score,
				}
			};
			this.server.volatile.emit("game-event", action);
			if (this.gameServe.playerOne.score === this.gameServe.scoreLimit
				|| this.gameServe.playerTwo.score === this.gameServe.scoreLimit)
			{
				this.loop.gameActive = false;
			}
		};
	}

	afterInit(server: Server)
	{
		this.server = server;
		this.users = 0;
		this.totalUsers = 0;
		this.loop = new NodeAnimationFrame();
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
		let roomName: string;
		const searchUser = this.socketIdUsers.find((element) =>
		{
			return (element === client.id);
		});
		if (searchUser === undefined)
		{
			this.socketIdUsers.push(client.id);
			this.users += 1;
			this.totalUsers += 1;
			// We will create each time a new room
			// There can be each time only two players in the same room
			roomName = "Room " + (Math.round(this.totalUsers / 2)).toString();
			client.join(roomName);
			// Check whether a client is present in a room:
			// const room = this.server.sockets.adapter.rooms.get(roomName);
			// if (room)
			// {
			// 	if (room.has(client.id))
			// 		console.log("User is in the room");
			// 	else
			// 		console.log("User is not in the room");
			// }
			// else
			// 	console.log("Room does not exist");
		}
		else
		{
			console.log("Something odd happened");
			return ;
		}

		// Count number of users in a room
		const roomInfo = this.server.sockets.adapter.rooms.get(roomName);
		let	roomSize: number;
		if (roomInfo)
			roomSize = roomInfo.size;
		else
		{
			console.log("An error occured due to rooms");
			return ;
		}

		const	userMessage = {
			type: "",
			payload: ""
		};

		if (roomSize === 1)
		{
			this.gameServe.playerOne.socketId = client.id;
			userMessage.type = "player-one";
			userMessage.payload = roomName;
		}
		else if (roomSize === 2)
		{
			this.gameServe.playerTwo.socketId = client.id;
			userMessage.type = "player-two";
			userMessage.payload = roomName;
		}
		else
			userMessage.type = "visitor";
		client.emit("init-message", userMessage);

		const	action = {
			type: "connect",
			payload: {
				numberUsers: this.users,
				userReadyCount: this.userReady,
				socketId: client.id
			}
		};

		this.server.emit("player-info", action);
	}

	handleDisconnect(client: Socket)
	{
		const userIndex = this.socketIdUsers.findIndex((element) =>
		{
			return (element === client.id);
		});
		if (userIndex !== -1)
		{
			this.socketIdUsers.splice(userIndex, 1);
			this.users -= 1;
		}

		const	wasReadyIndex = this.socketIdReady.findIndex((element) =>
		{
			return (element === client.id);
		});
		if (wasReadyIndex !== -1)
		{
			this.socketIdReady.splice(wasReadyIndex, 1);
			this.userReady--;
		}
		this.loop.gameActive = false;

		const	action = {
			type: "disconnect",
			payload: {
				numberUsers: this.users,
				userReadyCount: this.userReady
			}
		};
		this.server.emit("player-info", action);
	}

	@SubscribeMessage("info")
	handleInfo(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		if (data.type === "GET_BOARD_SIZE")
		{
			const	action = {
				type: "serverBoard_info",
				payload:
				{
					serverBoardDim:
					{
						width: this.gameServe.board.dim.width,
						height: this.gameServe.board.dim.height
					}
				}
			};
			client.emit("info", action);
			return ;
		}
		if (data.type === "resize")
		{
			const action = {
				type: "reset_your_scale",
				payload:
				{
					serverBoardDim:
					{
						width: this.gameServe.board.dim.width,
						height: this.gameServe.board.dim.height
					}
				}
			};
			client.emit("info", action);
			return;
		}
	}

	@SubscribeMessage("game-event")
	handleGameEvent(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		if (data.type === "ready")
		{
			const	search = this.socketIdReady.find((element) =>
			{
				return (element === client.id);
			});
			if (search === undefined)
			{
				this.socketIdReady.push(client.id);
				this.userReady++;

				const	action = {
					type: "ready-player",
					payload: {
						userReadyCount: this.userReady
					}
				};
				this.server.emit("player-info", action);
				if (this.userReady === 2)
				{
					this.server.emit("game-active", action);
					this.loop.gameActive = true;
				}
			}
		}
		if (data.type === "arrow-up")
		{
			if (client.id === this.gameServe.playerOne.socketId)
				this.gameServe.actionKeyPress = 38;
			else if (client.id === this.gameServe.playerTwo.socketId)
				this.gameServe.actionKeyPress = 87;
		}
		if (data.type === "arrow-down")
		{
			if (client.id === this.gameServe.playerOne.socketId)
				this.gameServe.actionKeyPress = 40;
			else if (client.id === this.gameServe.playerTwo.socketId)
				this.gameServe.actionKeyPress = 83;
		}
		if (data.type === "stop-key")
			this.gameServe.actionKeyPress = -1;
	}
}
