/* eslint-disable max-depth */
/* eslint-disable max-len */
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
import { LargeNumberLike } from "crypto";
import { async } from "rxjs/internal/scheduler/async";

export class	NodeAnimationFrame
{
	public frameRate: number;
	public frameNumber: number;
	public gameActive: boolean;
	public game: GameServe | undefined;
	public requestFrame: (callbackFunction: any) => void;
	public callbackFunction:
		((timestamp: number, frame: number, game: GameServe) => void) | null;
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
			if (this.game)
				this.callbackFunction(timestamp, this.frameNumber, this.game);
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
	userReady: number;
	socketIdReady: string[] = [];
	gameInstances: GameServe[] = [];
	printPerformance: (timestamp: number, frame: number, instance: GameServe) => void;
	update: (instance: GameServe) => void;

	public	constructor()
	{
		this.userReady = 0;
		this.update = (instance: GameServe) =>
		{
			instance.playerOne.updatePlayerPosition();
			instance.playerTwo.updatePlayerPosition();

			instance.ball.update();
		};

		this.printPerformance = (timestamp: number, frame: number, instance: GameServe) =>
		{
			if (instance.loop && instance.loop.gameActive === false)
				return ;
			this.update(instance);
			const action = {
				type: "game-data",
				payload:
				{
					frameNumber: frame,
					ballPos: {
						x: instance.ball.pos.x,
						y: instance.ball.pos.y,
					},
					playerOne:
					{
						pos: {
							x: instance.playerOne.pos.x,
							y: instance.playerOne.pos.y,
						}
					},
					playerTwo:
					{
						pos: {
							x: instance.playerTwo.pos.x,
							y: instance.playerTwo.pos.y,
						}
					},
					plOneScore: instance.playerOne.score,
					plTwoScore: instance.playerTwo.score,
				}
			};
			this.server.to(instance.roomName).emit("game-event", action);
			if (instance.loop && (instance.playerOne.score === instance.scoreLimit
				|| instance.playerTwo.score === instance.scoreLimit))
				instance.loop.gameActive = false;
		};
	}

	afterInit(server: Server)
	{
		this.server = server;
		this.users = 0;
		this.totalUsers = 0;
	}

	async handleConnection(client: Socket)
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
			roomName = "room" + (Math.round(this.totalUsers / 2)).toString();
			await client.join(roomName);
			if (this.totalUsers % 2 !== 0)
			{
				const newRoom = new GameServe(roomName);
				newRoom.ball.game = newRoom;
				newRoom.board.game = newRoom;
				newRoom.net.game = newRoom;
				newRoom.playerOne.socketId = client.id;
				newRoom.board.init();
				newRoom.loop = new NodeAnimationFrame();
				newRoom.loop.game = newRoom;
				newRoom.loop.callbackFunction = this.printPerformance;
				newRoom.loop.update(performance.now());
				this.gameInstances.push(newRoom);
			}
			else
			{
				for (const instance of this.gameInstances)
				{
					if (instance.roomName === roomName)
						instance.playerTwo.socketId = client.id;
				}
			}
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

		// This will send the right message to each player but it will
		// also create a room instance on the client side
		const	userMessage = {
			type: "",
			payload: {
				roomName: roomName,
				roomSize: roomSize
			}
		};

		for (const instance of this.gameInstances)
		{
			if (instance.roomName === roomName)
			{
				if (roomSize === 1)
					userMessage.type = "player-one";
				else if (roomSize === 2)
					userMessage.type = "player-two";
				else
					userMessage.type = "visitor";
				client.emit("init-message", userMessage);

				const	action = {
					type: "connect",
					payload: {
						numberUsers: this.users,
						userReadyCount: this.userReady,
						socketId: client.id,
					}
				};
				this.server.to(roomName).emit("player-info", action);
			}
		}
	}

	handleDisconnect(client: Socket)
	{
		for (const instance of this.gameInstances)
		{
			if (instance.loop && (instance.playerOne.socketId === client.id
				|| instance.playerTwo.socketId === client.id))
				instance.loop.gameActive = false;
		}

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

		const	action = {
			type: "disconnect",
			payload: {
				numberUsers: this.users,
				userReadyCount: this.userReady
			}
		};
		for (const instance of this.gameInstances)
		{
			if (instance.playerOne.socketId === client.id
				|| instance.playerTwo.socketId === client.id)
				this.server.to(instance.roomName).emit("player-info", action);
		}
	}

	@SubscribeMessage("info")
	handleInfo(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		for (const instance of this.gameInstances)
		{
			if (instance.playerOne.socketId === client.id
				|| instance.playerTwo.socketId === client.id)
			{
				if (data.type === "GET_BOARD_SIZE")
				{
					const	action = {
						type: "serverBoard_info",
						payload:
						{
							serverBoardDim:
							{
								width: instance.board.dim.width,
								height: instance.board.dim.height
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
								width: instance.board.dim.width,
								height: instance.board.dim.height
							}
						}
					};
					client.emit("info", action);
					return;
				}
			}
		}
	}

	@SubscribeMessage("game-event")
	handleGameEvent(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		let	userRoom: string;
		userRoom = "";
		this.server.sockets.adapter.rooms.forEach((room, roomName) =>
		{
			// Check if the socket ID is in the room
			if (room.has(client.id) && roomName !== client.id)
				userRoom = roomName;
		});
		if (!userRoom)
		{
			console.log("An error occured with socket.io");
			return ;
		}
		const roomInfo = this.server.sockets.adapter.rooms.get(userRoom);
		if (!roomInfo)
		{
			console.log("An error occured with socket.io");
			return ;
		}
		const socketIdsInRoom = Array.from(roomInfo.keys());

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

				// check and add the user to the ready list

				let	countReadyInRoom: number;
				countReadyInRoom = 0;
				for (const socketId of socketIdsInRoom)
				{
					const	searchReady = this.socketIdReady.find((element) =>
					{
						return (element === socketId);
					});
					if (searchReady !== undefined)
						countReadyInRoom++;
				}

				const	action = {
					type: "ready-player",
					payload: {
						userReadyCount: this.userReady
					}
				};

				this.server.to(userRoom).emit("player-info", action);

				if (countReadyInRoom === 2)
				{
					this.server.to(userRoom).emit("game-active", action);
					for (const instance of this.gameInstances)
					{
						if (instance.loop && (instance.playerOne.socketId === client.id
							|| instance.playerTwo.socketId === client.id))
							instance.loop.gameActive = true;
					}
				}
			}
		}

		// Determine whether the player is right or left player
		let	playerIndex: number;
		playerIndex = 0;
		for (const socketId of socketIdsInRoom)
		{
			if (socketId === client.id)
				playerIndex = 1;
			else
				playerIndex = 2;
			break ;
		}

		for (const instance of this.gameInstances)
		{
			if (instance.roomName === userRoom)
			{
				if (data.type === "arrow-up")
				{
					if (playerIndex === 1)
						instance.actionKeyPress = 38;
					else if (playerIndex === 2)
						instance.actionKeyPress = 87;
				}
				if (data.type === "arrow-down")
				{
					if (playerIndex === 1)
						instance.actionKeyPress = 40;
					else if (playerIndex === 2)
						instance.actionKeyPress = 83;
				}
				if (data.type === "stop-key")
					instance.actionKeyPress = -1;
			}
		}
	}
}
