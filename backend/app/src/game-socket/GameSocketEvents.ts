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
import { NodeAnimationFrame } from "./NodeAnimationFrame";
import e from "express";

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

			const	scorePlayerOne = instance.playerOne.score;
			const	scorePlayerTwo = instance.playerTwo.score;
			if (scorePlayerOne === instance.scoreLimit)
			{
				console.log("User one has won ");
			}
			if (scorePlayerTwo === instance.scoreLimit)
			{
				console.log("User two has won");
			}
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

	private isGameModeValid(gameMode: string): boolean
	{
		switch (gameMode)
		{
			case "classical":
				return (true);
			case "upside-down":
				return (true);
			default:
				return false;
		}
	}

	private	isTokenValid(inputToken: string)
		: {
			isValid: boolean,
			profileId: string
		}
	{
		const	secret = this.userService.getSecret();
		const	bearerToken = inputToken;
		const	token = bearerToken.split("Bearer ");
		const	result = {
			isValid: false,
			profileId: ""
		};
		if (token.length !== 2)
			return (result);
		try
		{
			const	decodedToken = jwt.verify(token[1], secret) as jwt.JwtPayload;
			result.profileId = decodedToken.id;
			result.isValid = true;
			console.log(result.profileId);
		}
		catch (error)
		{
			result.isValid = false;
			if (error instanceof jwt.JsonWebTokenError)
			{
				this.logger.warn("A client try to connect without authenticate");
			}
			this.logger.error(error);
			return (result);
		}
		return (result);
	}

	private	isHandshakeValid(client: Socket)
		: {
			isValid: boolean,
			gameMode: string,
		}
	{
		const	result = {
			isValid: false,
			gameMode: "classical"
		};

		if (client.handshake.auth)
		{
			if (client.handshake.auth.mode)
			{
				result.isValid = this.isGameModeValid(client.handshake.auth.mode)
				result.gameMode = client.handshake.auth.mode;
			}
			else
			{
				result.isValid = false;
				return (result);
			}
		}
		else
		{
			result.isValid = false;
			return (result);
		}
		return (result);
	}

	async handleConnection(client: Socket)
	{
		let		roomName: string;

		const	handShake = this.isHandshakeValid(client);
		if (handShake.isValid === false)
		{
			this.logger.warn("Client Failed handshake");
			client.disconnect();
			return ;
		}
		this.logger.verbose("Handshake is valid");
		const token = this.isTokenValid(client.handshake.auth.token);
		if (token.isValid === false)
		{
			this.logger.warn("Client try a wrong token");
			console.log(token);
			client.disconnect();
			return ;
		}
		this.logger.verbose("token is valid");
		const profileId = token.profileId;
		const gameModeRequest = handShake.gameMode;
		const	indexGameInstance = this.gameService.gameInstances.findIndex((instance) =>
		{
			return (
				instance.playerOne.profileId === profileId
				|| instance.playerTwo.profileId === profileId
			);
		});
		// Can be only use to random party
		if (indexGameInstance === -1)
		{
			this.logger.verbose("User dont have a game instance running");
		}
		else
		{
			this.logger.verbose("User have a game instance running");
			this.logger.verbose("Game mode requested: " + gameModeRequest);
			// User have an instance
			// check game mode
			// 		if same game mode
			//			continue partie
			//		else
			// 			ask to continue same game mode || ask to remove the instance (by emit with sockets  waiting component in front)
		}
			const	indexSocketId = this.gameService.findIndexSocketIdUserByProfileId(profileId);
			if (indexSocketId === -1)
				this.gameService.pushClientIdIntoSocketIdUsers(client.id, profileId);
			else
			{
				this.logger.debug("User has already logged, will now if a game is active");
				if (indexGameInstance !== -1)
				{
					if (this.gameService.gameInstances[indexGameInstance].playerOne.profileId === profileId)
					{
						if (this.gameService.gameInstances[indexGameInstance].playerOne.socketId === "disconnected")
						{
							// accept the renew connection
							this.gameService.socketIdUsers[indexSocketId].socketId = client.id;
							this.gameService.gameInstances[indexGameInstance].playerOne.socketId = client.id;
							this.gameService.gameInstances[indexGameInstance].userConnected += 1;
						}
						else
						{
							// disconnect
							this.logger.error("No multiple connection allowed for a user");
							client.disconnect();
							return ;
						}
					}
					if (this.gameService.gameInstances[indexGameInstance].playerTwo.profileId === profileId)
					{
						if (this.gameService.gameInstances[indexGameInstance].playerTwo.socketId === "disconnected")
						{
							// accept the renew connection
							this.gameService.socketIdUsers[indexSocketId].socketId = client.id;
							this.gameService.gameInstances[indexGameInstance].playerTwo.socketId = client.id;
							this.gameService.gameInstances[indexGameInstance].userConnected += 1;
						}
						else
						{
							this.logger.error("No multiple connection allowed for a user");
							client.disconnect();
							return ;
						}
					}
				}
			}
			if (indexGameInstance === -1)
			{
				this.logger.verbose("The User has no game started");
				this.logger.verbose("Selecting a game that have user alone");
				// this method check player two if undefined in one game.
				const	indexGamePlayerAlone = this.gameService.findIndexGameInstanceAlonePlayer();
				if (indexGamePlayerAlone === -1)
				{
					this.logger.verbose("There are  no player alone");
					this.gameService.increaseRoomCount();
					roomName = "room"
						+ this.gameService.getRoomCount().toString();
					await client.join(roomName);
					const newRoom = new GameServe(roomName);
					newRoom.ball.game = newRoom;
					newRoom.board.game = newRoom;
					newRoom.net.game = newRoom;
					newRoom.playerOne.socketId = client.id;
					newRoom.playerOne.profileId = profileId;
					newRoom.userConnected += 1;
					newRoom.board.init();
					newRoom.loop = new NodeAnimationFrame();
					newRoom.loop.game = newRoom;
					newRoom.loop.callbackFunction = this.printPerformance;
					newRoom.loop.update(performance.now());
					this.gameService.pushGameServeToGameInstance(newRoom);
					this.logger.verbose("User is created as player One");
				}
				else
				{
					this.logger.verbose("We have a player one alone");
					this.gameService.gameInstances[indexGamePlayerAlone].playerTwo.socketId = client.id;
					this.gameService.gameInstances[indexGamePlayerAlone].playerTwo.profileId = profileId;
					this.gameService.gameInstances[indexGamePlayerAlone].userConnected += 1;
					this.logger.verbose("User is created as player Two");
					roomName = this.gameService.gameInstances[indexGamePlayerAlone].roomName;
					await client.join(roomName);
				}
			}
			else
			{
				this.logger.verbose("A game is already played by this user but socket different");
				this.logger.verbose("Determine if user One Or user Two");

				const	isplayerOne = this.gameService
					.isProfileIdUserOne(indexGameInstance, profileId);
				const	isplayerTwo = this.gameService
					.isProfileIdUserTwo(indexGameInstance, profileId);
				this.logger.verbose("The profile is player one : " + isplayerOne);
				this.logger.verbose("The profile is player Two : " + isplayerTwo);
				if (isplayerOne)
				{
					// check if user has many socket at same time
					if (this.gameService.gameInstances[indexGameInstance].playerOne.socketId === "disconnected")
					{
						this.gameService.gameInstances[indexGameInstance].playerOne.socketId = client.id;
						this.gameService.gameInstances[indexGameInstance].playerOne.profileId = profileId;
						this.gameService.gameInstances[indexGameInstance].userConnected += 1;
					}
					else
					{
						this.logger.warn("User try a  random game with same profileId, disconnected");
						client.disconnect();
						return ;
					}
				}
				else if (isplayerTwo)
				{
					if (this.gameService.gameInstances[indexGameInstance].playerOne.socketId === "disconnected")
					{
						this.gameService.gameInstances[indexGameInstance].playerTwo.socketId = client.id;
						this.gameService.gameInstances[indexGameInstance].playerTwo.profileId = profileId;
						this.gameService.gameInstances[indexGameInstance].userConnected += 1;
					}
					else
					{
						this.logger.warn("User try a  random game with same profileId, disconnected");
						client.disconnect();
						return ;
					}
				}
				else
					this.logger.error("See this error: user already played");
				roomName = this.gameService.gameInstances[indexGameInstance].roomName;
				await client.join(roomName);
			}
			this.gameService.increaseUsers();
			this.gameService.increaseTotalUsers();
			const roomInfo = this.server.sockets.adapter.rooms.get(roomName);
			console.log("Room infos", roomInfo);
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
			const	indexInstance = this.gameService.findIndexGameInstanceByRoomName(roomName);
			if (this.gameService.isProfileIdUserOne(indexInstance, profileId))
				userMessage.type = "player-one";
			else
				userMessage.type = "player-two";
			client.emit("init-message", userMessage);
			const	instance = this.gameService
				.findGameInstanceWithClientId(client.id);
			if (instance === undefined)
			{
				this.logger.error("Must have a game instance");
				return ;
			}
			let	playerOnePicture: string;
			let	playerTwoPicture: string;
			const	userOne = this.userService.getUserById(instance.playerOne.profileId);
			if (userOne === undefined)
				playerOnePicture = "undefined";
			else
				playerOnePicture = userOne.avatar;
			const	userTwo = this.userService.getUserById(instance.playerTwo.profileId);
			if (userTwo === undefined)
				playerTwoPicture = "undefined";
			else
				playerTwoPicture = userTwo.avatar;
			const	action = {
				type: "connect",
				payload: {
					numberUsers: instance.userConnected,
					userReadyCount: this.gameService.getUserReadyNumber(),
					socketId: client.id,
					playerOneProfileId: instance.playerOne.profileId,
					playerTwoProfileId: instance.playerTwo.profileId,
					playerOnePicture: playerOnePicture,
					playerTwoPicture: playerTwoPicture
				}
			};
			this.server.to(roomName).emit("player-info", action);
	}

	handleDisconnect(client: Socket)
	{
		// set pause if client id is in a game
		const	profileId = this.gameService.findProfileIdFromSocketId(client.id)?.profileId;
		if (profileId === undefined)
			this.logger.error("Profile id not found");
		const	indexInstance = this.gameService.findIndexGameInstanceWithClientId(client.id);
		if (indexInstance === -1)
			this.logger.error("game instance not fouded for disconnect user");
		if (this.gameService.isProfileIdUserOne(indexInstance, profileId as string))
			this.gameService.gameInstances[indexInstance].playerOne.socketId = "disconnected";
		if (this.gameService.isProfileIdUserTwo(indexInstance, profileId as string))
			this.gameService.gameInstances[indexInstance].playerTwo.socketId = "disconnected";
		this.gameService.setGameActiveToFalse(indexInstance);

		// remove the user from the list of users
		const userIndex = this.gameService.findIndexSocketIdUserByClientId(client.id);
		this.gameService.removeOneSocketIdUserWithIndex(userIndex);
		this.gameService.decreaseUsers();

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
		this.logger.error("User with id: " + client.id + " is quitting pprofile id is: " + profileId);

		const indexGameInstance = this.gameService.findIndexGameInstanceWithProfileId(profileId as string);
		if (indexGameInstance === -1)
			this.logger.error("Index game instance failure ");
		else
		{
			this.gameService.gameInstances[indexGameInstance].userConnected -= 1;
			if (this.gameService.gameInstances[indexGameInstance].userConnected === 0)
			{
				this.gameService.removeGameInstance(indexGameInstance);
				if (this.gameService.gameInstances.length === 0)
				{
					this.gameService.roomCount = 0;
				}
			}
		}
		const instance = this.gameService.findGameInstanceWithClientId(client.id);
		if (instance)
		{
			this.logger.error("Test deeead code");
			this.server.to(instance.roomName).emit("player-info", action);
		}
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
