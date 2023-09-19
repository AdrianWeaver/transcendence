/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";

import Game from "./Objects/Game";

import MenuBar from "../../Component/MenuBar/MenuBar";

import { io } from "socket.io-client";
import ConnectState from "./Component/ConnectState";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import {
	setBallPosition,
	setBoardDimension,
	setFrameNumber,
	setNumberOfUsers,
	setPlOneSocket,
	setPlTwoSocket,
	setPlayerOnePos,
	setPlayerTwoPos,
	setPlOneScore,
	setPlTwoScore,
	setReadyPlayerCount,
	setScaleServer,
	setServerDimension
} from "../../Redux/store/gameEngineAction";

const	URL = "http://localhost:3000";

type	ActionSocket = {
	type: string,
	payload?: any
};

const	TestBall = () =>
{
	/* local state */
	const
	[
		readyPlayer,
		setReadyPlayer
	] = useState(false);

	/* local state */
	const
	[
		connected,
		setConnected
	] = useState(false);

	/* local state */

	const
	[
		gameActive,
		setGameActive
	] = useState(false);

	const	dispatch = useAppDispatch();

	const	theServer = useAppSelector((state) =>
	{
		return (state.gameEngine.server);
	});

	const theBoard = useAppSelector((state) =>
	{
		return (state.gameEngine.board);
	});

	const	socketRef = useRef<SocketIOClient.Socket | null>(null);

	const gameInstances: Game[] = [];
	const	game0 = new Game("room0");
	gameInstances.push(game0);
	const	gameRef = useRef<Game>(gameInstances[0]);
	gameRef.current = gameInstances[0];
	gameInstances[0].board.game = gameInstances[0];
	gameInstances[0].ball.game = gameInstances[0];
	gameInstances[0].net.game = gameInstances[0];
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	gameInstances[0].board.canvasRef = canvasRef;

	const	createNewInstance = (roomName: string) =>
	{
		const newRoom = new Game(roomName);
		gameInstances.push(newRoom);
		for (const instance of gameInstances)
		{
			if (instance.roomName === roomName)
			{
				instance.board.game = instance;
				instance.ball.game = instance;
				instance.net.game = instance;
				instance.board.canvasRef = canvasRef;
			}
		}
	};

	useEffect(() =>
	{
		const socket = io(URL,
		{
			autoConnect: false,
			reconnectionAttempts: 5,
		});

		socketRef.current = socket;
		gameInstances[0].board.socket = socketRef.current;

		const connect = () =>
		{
			const	action = {
				type: "GET_BOARD_SIZE"
			};
			socket.emit("info", action);
			setConnected(true);
		};

		const disconnect = () =>
		{
			// console.log("ws disconnected");
			setConnected(false);
		};

		const	connectError = (error: Error) =>
		{
			console.error("ws_connect_error", error);
		};

		const	updateGame = (data: any) =>
		{
			if (data.type === "game-data")
			{
				dispatch(setFrameNumber(data.payload.frameNumber));
				dispatch(
					setBallPosition(
						data.payload.ballPos.x,
						data.payload.ballPos.y
					)
				);
				dispatch(
					setPlayerOnePos(
						(data.payload.playerOne.pos.x),
						(data.payload.playerOne.pos.y)
					)
				);
				dispatch(
					setPlayerTwoPos(
						(data.payload.playerTwo.pos.x),
						(data.payload.playerTwo.pos.y)
					)
				);
				dispatch(
					setPlOneScore(data.payload.plOneScore)
				);
				dispatch(
					setPlTwoScore(data.payload.plTwoScore)
				);
			}
		};

		const	initServerDim = (data: ActionSocket) =>
		{
			const	serverBoardDim = data.payload.serverBoardDim;
			dispatch(
				setServerDimension(
					serverBoardDim.width,
					serverBoardDim.height
				)
			);
			const	ratioWidth = serverBoardDim.width / gameInstances[0].board.dim.width;
			const	ratioHeight = serverBoardDim.height / gameInstances[0].board.dim.height;
			dispatch(
				setBoardDimension(
					gameInstances[0].board.dim.width,
					gameInstances[0].board.dim.height
				)
			);
			dispatch(
				setScaleServer(
					ratioWidth,
					ratioHeight
				)
			);
		};

		const	playerInfo = (data: any) =>
		{
			switch (data.type)
			{
				case "connect":
					dispatch(setNumberOfUsers(data.payload.numberUsers));
					dispatch(setReadyPlayerCount(data.payload.userReadyCount));
					if (gameInstances[0].playerOne.socketId === undefined)
					{
						gameInstances[0].playerOne.socketId = data.payload.socketId;
						dispatch(setPlOneSocket(data.payload.socketId));
					}
					else if (gameInstances[0].playerOne.socketId
								&& gameInstances[0].playerTwo.socketId === undefined)
					{
						gameInstances[0].playerTwo.socketId = data.payload.socketId;
						dispatch(setPlTwoSocket(data.payload.socketId));
					}
					break ;
				case "disconnect":
					dispatch(setNumberOfUsers(data.payload.numberUsers));
					dispatch(setReadyPlayerCount(data.payload.userReadyCount));
					break ;
				case "ready-player":
					dispatch(setReadyPlayerCount(data.payload.userReadyCount));
					break ;
				default:
					break ;
			}
		};

		const	sendInitMessageToPlayers = (data: any) =>
		{
			let text: string;
			text = "";
			switch (data.type)
			{
				case "player-one":
					text = "You are player one in " + data.payload.roomName;
					createNewInstance(data.payload.roomName);
					break ;
				case "player-two":
					text = "You are player two in " + data.payload.roomName;
					break ;
				case "visitor":
					text = "You are a visitor";
					break ;
				default:
					break ;
			}
			gameInstances[0].renderInitMessage(text);
		};

		const	activateGame = (data: any) =>
		{
			setGameActive(true);
		};

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("game-event", updateGame);
		socket.on("info", initServerDim);
		socket.on("player-info", playerInfo);
		socket.on("init-message", sendInitMessageToPlayers);
		socket.on("game-active", activateGame);
		socket.connect();

		return (() =>
		{
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("game-event", updateGame);
			socket.off("info", initServerDim);
			socket.off("player-info", playerInfo);
			socket.off("init-message", sendInitMessageToPlayers);
			socket.off("game-active", activateGame);
		});
	}, []);

	const	keyHookDown = (e: KeyboardEvent) =>
	{
		const	action = {
			type: "",
		};
		socketRef.current?.emit("game-event", action);
		switch (e.code)
		{
			case "ArrowUp":
				action.type = "arrow-up";
				socketRef.current?.emit("game-event", action);
				break;
			case "ArrowDown":
				action.type = "arrow-down";
				socketRef.current?.emit("game-event", action);
				break;
			default:
				break;
		}
	};

	const	keyHookReleased = () =>
	{
		gameInstances[0].actionKeyPress = -1;
		const	action = {
			type: ""
		};
		action.type = "stop-key";
		socketRef.current?.emit("game-event", action);
	};

	// this can be used for showing a start and waiting ]
	// for all player to be ready before starting the game
	// client.id checked on backend to avoid cheating
	const	setReadyAction = () =>
	{
		if (readyPlayer === false)
		{
			const	action = {
				type: "ready"
			};
			socketRef.current?.emit("game-event", action);
			setReadyPlayer(true);
		}
		else
			console.log("You are already ready !");
	};

	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;

		const ctx = canvas?.getContext("2d");
		gameInstances[0].board.canvas = canvas;
		gameInstances[0].board.ctx = ctx;
		gameInstances[0].board.init();
		addEventListener("keydown", keyHookDown);
		addEventListener("keyup", keyHookReleased);

		const clear = () =>
		{
			if (gameInstances[0].board.ctx)
			{
				gameInstances[0].board.ctx.fillStyle = "#fff";
				gameInstances[0].board.ctx?.clearRect(0, 0,
					gameInstances[0].board.dim.width, gameInstances[0].board.dim.height);
			}
		};

		const	render = () =>
		{
			clear();
			gameInstances[0].board.ctx?.beginPath();
			if (gameInstances[0].board.ctx)
			{
				gameInstances[0].board.ctx.fillStyle = "#F5F5DC";
				gameInstances[0].board.ctx.fillRect(0, 0, gameInstances[0].board.dim.width,
					gameInstances[0].board.dim.height);
			}
			if (gameActive === false)
			{
				const border = gameInstances[0].board.dim.width * 0.01;
				gameInstances[0].playerOne.pos.x = border;
				gameInstances[0].playerOne.pos.y = gameInstances[0].board.dim.height / 2;
				gameInstances[0].playerOne.racket.defineRacketSize();
				gameInstances[0].playerOne.pos.y -= gameInstances[0].playerOne.racket.dim.height / 2;
				gameInstances[0].playerTwo.racket.dim = gameInstances[0].playerOne.racket.dim;
				gameInstances[0].playerTwo.pos.x = gameInstances[0].board.dim.width - border
					- gameInstances[0].playerTwo.racket.dim.width;
				gameInstances[0].playerTwo.pos.y = gameInstances[0].board.dim.height / 2;
				gameInstances[0].playerTwo.racket.defineRacketSize();
				gameInstances[0].playerTwo.pos.y -= gameInstances[0].playerTwo.racket.dim.height / 2;
				gameInstances[0].playerOne.render();
				gameInstances[0].playerTwo.render();
			}
			else
			{
				gameInstances[0].playerOne.pos.setCoordinateXYZ(
					theBoard.playerOne.position.x,
					theBoard.playerOne.position.y);
				gameInstances[0].playerOne.racket.defineRacketSize();
				gameInstances[0].playerTwo.pos.setCoordinateXYZ(
					theBoard.playerTwo.position.x,
					theBoard.playerTwo.position.y);
				gameInstances[0].playerTwo.racket.defineRacketSize();
				gameInstances[0].playerOne.render();
				gameInstances[0].playerTwo.render();
				gameInstances[0].ball.move(theBoard.ball.position.x,
								theBoard.ball.position.y);
			}
			gameInstances[0].net.render();
			gameInstances[0].ball.render();
			gameInstances[0].playerOne.renderScore(theBoard.plOneScore);
			gameInstances[0].playerTwo.renderScore(theBoard.plTwoScore);
			if (gameInstances[0].playerOne.score === gameInstances[0].scoreLimit
				|| gameInstances[0].playerTwo.score === gameInstances[0].scoreLimit)
				gameInstances[0].displayEndMessage();
			requestId = requestAnimationFrame(render);
		};
		requestId = requestAnimationFrame(render);
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	},
	[ theBoard.ball.position ]);

	const	displayStyle: React.CSSProperties = {
		textAlign: "center",
		fontSize: "8px"
	};

	return (
		<>
			< MenuBar />
			<div style={displayStyle}>
				<ConnectState connected={connected} />
			</div>

			{/* This part show the number of client connected */}
			<div style={displayStyle}>
				number of client connected : {theServer.numberOfUser}<br/>
				number of client ready : {theServer.readyPlayerCount}
			</div>
			<div style={displayStyle}>
				<button onClick={setReadyAction}>I'm ready</button>
			</div>
			{/* This is the canvas part */}
			<div style={{textAlign: "center"}}>
				<canvas
					height={gameInstances[0].board.canvas?.height}
					width={gameInstances[0].board.canvas?.width}
					ref={gameInstances[0].board.canvasRef}
				>
				</canvas>
			</div>
		</>
	);
};

export default TestBall;
