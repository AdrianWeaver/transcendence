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
import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import GameServe from "./Objects/GameServe";
import { GameService } from "./Game.service";
import { Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";

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

	public	getSerializable: () => any;
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
		this.getSerializable = () =>
		{
			return ({
				frameRate: this.frameRate,
				frameNumber: this.frameNumber,
				gameActive: this.gameActive,
				// game: this.game
			});
		};
	}
}

type	ActionSocket = {
	type: string,
	payload?: any
};

@WebSocketGateway(
{
	path: "/socket-game/random",
	cors:
	{
		origin: "*"
	},
})
export class GameSocketEvents
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server				: Server;
	private readonly	logger = new Logger("game-socket-event");
	printPerformance	: (timestamp: number, frame: number, instance: GameServe) => void;
	update				: (instance: GameServe) => void;

	afterInit(server: Server)
	{
		this.server = server;
		this.gameService.setUsers(0);
		this.gameService.setTotalUsers(0);
	}

	public	constructor(
		private readonly gameService: GameService,
		private readonly userService: UserService
	)
	{
		this.logger.error("I am using service game with id: " + this.gameService.getInstanceId());
		this.logger.error("I am using service user with id: " + this.userService.getUuidInstance());
		this.gameService.setUserReadyNumber(0);
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
			{
				const	gameActive = {
					type: "desactivate",
					payload: {
						gameActive: false
					}
				};
				this.server.to(instance.roomName).emit("game-active", gameActive);
				instance.loop.gameActive = false;
			}
		};
	}

	async handleConnection(client: Socket)
	{
		// console.log("handshake du client:", client.handshake);
		let	profileId: string;
		if (client.handshake.auth)
		{
			const	secret = this.userService.getSecret();
			const	bearerToken: string = client.handshake.auth.token;
			const	token = bearerToken.split("Bearer ");
			if (token.length !== 2)
			{
				this.logger.warn("Client try a wrong token");
				client.disconnect();
				return ;
			}
			try
			{
				const	decodedToken = jwt.verify(token[1], secret) as jwt.JwtPayload;
				profileId = decodedToken.id;
				console.log(profileId);
				// const index = this.gameService.find
			}
			catch (error)
			{
				if (error instanceof jwt.JsonWebTokenError)
					{
						this.logger.warn("A client try to connect without authenticate");
						client.disconnect();
						return ;
					}
					this.logger.error(error);
					return ;
			}
			let roomName: string;
			const searchUser = this.gameService
				.findSocketIdUserByClientId(client.id);
			if (searchUser === undefined)
			{
				this.gameService.pushClientIdIntoSocketIdUsers(client.id, profileId);
				this.gameService.increaseUsers();
				this.gameService.increaseTotalUsers();
				roomName = "room"
					+ (Math.round(this.gameService.getTotalUsers() / 2)).toString();
				await client.join(roomName);
				if (this.gameService.getTotalUsers() % 2 !== 0)
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
					this.gameService.pushGameServeToGameInstance(newRoom);
				}
				else
				{
					for (const instance of this.gameService.getGameInstances())
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
				payload: {
					roomName: roomName,
					roomSize: roomSize
				}
			};

			for (const instance of this.gameService.getGameInstances())
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
							numberUsers: this.gameService.getUsers(),
							userReadyCount: this.gameService.getUserReadyNumber(),
							socketId: client.id,
						}
					};
					this.server.to(roomName).emit("player-info", action);
				}
			}
		}
		else
		{
			this.logger.warn("A client try to connect without authenticate, kicked");
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket)
	{
		// set pause if client id is in a game
		const indexInstance = this.gameService
				.findIndexGameInstanceWithClientId(client.id);
		this.gameService.setGameActiveToFalse(indexInstance);

		// remove the user from the list of users
		const userIndex = this.gameService.findIndexSocketIdUserByClientId(client.id);
		// if (userIndex !== -1)
		// {
		this.gameService.removeOneSocketIdUserWithIndex(userIndex);
		this.gameService.decreaseUsers();
		// }

		// remove the user from the list of users ready
		const	wasReadyIndex = this.gameService
			.findIndexSocketIdReadyWithSocketId(client.id);
		if (wasReadyIndex !== -1)
		{
			this.gameService.removeOneSocketIdReadyWithIndex(wasReadyIndex);
			this.gameService.decreaseUserReadyNumber();
		}

		// send the new number of users and users ready
		const	action = {
			type: "disconnect",
			payload: {
				numberUsers: this.gameService.getUsers(),
				userReadyCount: this.gameService.getUserReadyNumber()
			}
		};
		const instance = this.gameService.findGameInstanceWithClientId(client.id);
		if (instance)
			this.server.to(instance.roomName).emit("player-info", action);
	}

	@SubscribeMessage("info")
	handleInfo(
		@MessageBody() data: ActionSocket,
		@ConnectedSocket() client: Socket
	)
	{
		let		actionType: string;
		const	instance = this.gameService
			.getGameInstances()
			.find((instance) =>
			{
				return (instance.playerOne.socketId === client.id
					|| instance.playerTwo.socketId === client.id);
			});
		if (instance)
		{
			if (data.type === "GET_BOARD_SIZE")
				actionType = "serverBoard_info";
			else if (data.type === "resize")
				actionType = "reset_your_scale";
			else
				actionType = "";
			if (actionType !== "")
			{
				const	action = {
					type: actionType,
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
			const	search = this.gameService.findSocketIdReadyWithSocketId(client.id);
			if (search === undefined)
			{
				const	profileId = this.gameService.findProfileIdFromSocketId(client.id)?.profileId as string;
				this.gameService.pushClientIdIntoSocketIdReady(client.id, profileId);
				this.gameService.increaseUserReadyNumber();

				// check and add the user to the ready list

				let	countReadyInRoom: number;
				countReadyInRoom = 0;
				for (const socketId of socketIdsInRoom)
				{
					const	searchReady = this.gameService
						.findSocketIdReadyWithSocketId(socketId);
					if (searchReady !== undefined)
						countReadyInRoom++;
				}

				const	action = {
					type: "ready-player",
					payload: {
						userReadyCount: this.gameService.getUserReadyNumber(),
						gameActive: true
					}
				};

				this.server.to(userRoom).emit("player-info", action);

				if (countReadyInRoom === 2)
				{
					this.server.to(userRoom).emit("game-active", action);
					for (const instance of this.gameService.getGameInstances())
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

		for (const instance of this.gameService.getGameInstances())
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
