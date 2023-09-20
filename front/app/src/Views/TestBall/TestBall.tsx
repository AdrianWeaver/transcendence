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

	const	game = new Game();
	const	gameRef = useRef<Game>(game);
	gameRef.current = game;
	game.board.game = game;
	game.ball.game = game;
	game.net.game = game;
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	game.board.canvasRef = canvasRef;

	useEffect(() =>
	{
		const socket = io(URL,
		{
			autoConnect: false,
			reconnectionAttempts: 5,
		});

		socketRef.current = socket;
		game.board.socket = socketRef.current;

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
			const	ratioWidth = serverBoardDim.width / game.board.dim.width;
			const	ratioHeight = serverBoardDim.height / game.board.dim.height;
			dispatch(
				setBoardDimension(
					game.board.dim.width,
					game.board.dim.height
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
					if (game.playerOne.socketId === undefined)
					{
						game.playerOne.socketId = data.payload.socketId;
						dispatch(setPlOneSocket(data.payload.socketId));
					}
					else if (game.playerOne.socketId
								&& game.playerTwo.socketId === undefined)
					{
						game.playerTwo.socketId = data.payload.socketId;
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
			game.renderInitMessage(text);
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
			type: ""
		};
		socketRef.current?.emit("game-event", action);
		switch (e.code)
		{
			case "ArrowUp":
				game.actionKeyPress = 38;
				action.type = "arrow-up";
				socketRef.current?.emit("game-event", action);
				break;
			case "ArrowDown":
				game.actionKeyPress = 40;
				action.type = "arrow-down";
				socketRef.current?.emit("game-event", action);
				break;
			default:
				break;
		}
	};

	const	keyHookReleased = () =>
	{
		game.actionKeyPress = -1;
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
			console.log("ready action", action);
			socketRef.current?.emit("game-event", action);
			setReadyPlayer(true);
		}
		// just for understanding the code 
		else
			console.log("You are already ready !");
	};

	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;

		const ctx = canvas?.getContext("2d");
		game.board.canvas = canvas;
		game.board.ctx = ctx;
		game.board.init();
		addEventListener("keydown", keyHookDown);
		addEventListener("keyup", keyHookReleased);

		const clear = () =>
		{
			if (game.board.ctx)
			{
				game.board.ctx.fillStyle = "#fff";
				game.board.ctx?.clearRect(0, 0,
					game.board.dim.width, game.board.dim.height);
			}
		};

		const	render = () =>
		{
			clear();
			game.board.ctx?.beginPath();
			if (game.board.ctx)
			{
				game.board.ctx.fillStyle = "#F5F5DC";
				game.board.ctx.fillRect(0, 0, game.board.dim.width,
					game.board.dim.height);
			}
			if (gameActive === false)
			{
				const border = game.board.dim.width * 0.01;
				game.playerOne.pos.x = border;
				game.playerOne.pos.y = game.board.dim.height / 2;
				game.playerOne.racket.defineRacketSize();
				game.playerOne.pos.y -= game.playerOne.racket.dim.height / 2;
				game.playerTwo.racket.dim = game.playerOne.racket.dim;
				game.playerTwo.pos.x = game.board.dim.width - border
					- game.playerTwo.racket.dim.width;
				game.playerTwo.pos.y = game.board.dim.height / 2;
				game.playerTwo.racket.defineRacketSize();
				game.playerTwo.pos.y -= game.playerTwo.racket.dim.height / 2;
				game.playerOne.render();
				game.playerTwo.render();
			}
			else
			{
				game.playerOne.pos.setCoordinateXYZ(
					theBoard.playerOne.position.x,
					theBoard.playerOne.position.y);
				game.playerOne.racket.defineRacketSize();
				game.playerTwo.pos.setCoordinateXYZ(
					theBoard.playerTwo.position.x,
					theBoard.playerTwo.position.y);
				game.playerTwo.racket.defineRacketSize();
				game.playerOne.render();
				game.playerTwo.render();
				game.ball.move(theBoard.ball.position.x,
								theBoard.ball.position.y);
			}
			game.net.render();
			game.ball.render();
			game.playerOne.renderScore(theBoard.plOneScore);
			game.playerTwo.renderScore(theBoard.plTwoScore);
			if (game.playerOne.score === game.scoreLimit
				|| game.playerTwo.score === game.scoreLimit)
				game.displayEndMessage();
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
				FT_TRANSCENDANCE
			</div>

			{/* This part show the connection to the websocket */}
			<div style={displayStyle}>
				<ConnectState connected={connected} />
			</div>

			{/* This part show the number of client connected */}
			<div style={displayStyle}>
				number of client connected : {theServer.numberOfUser}<br/>
				number of client ready : {theServer.readyPlayerCount}
			</div>

			{/* This part show the frame number */}
			<div style={displayStyle}>
				frame number (time server): {theServer.frameNumber} <br/>
			</div>

			{/* /* This part show more information */ }
			<div style={displayStyle}>
				position ball x: {theBoard.ball.position.x} <br />
				position ball y: {theBoard.ball.position.y} <br />
				dimension width du server: {theServer.dimension.width} <br />
				dimension height du server: {theServer.dimension.height} <br />
				scale to server :
					scale_width: {theServer.scaleServer.width},
					scale_height:
								{theServer.scaleServer.height} <br />
				dimension width du client : {theBoard.dimension.width} <br />
				dimension height du client: {theBoard.dimension.height} <br />
				position du player 1:
							{JSON.stringify(theBoard.playerOne.position)} <br />
				position du player 2:
							{JSON.stringify(theBoard.playerTwo.position)} <br />
			</div>
			<div style={displayStyle}>
				<button onClick={setReadyAction}>I'm ready</button>
			</div>
			{/* This is the canvas part */}
			<div style={{textAlign: "center"}}>
				<canvas
					height={game.board.canvas?.height}
					width={game.board.canvas?.width}
					ref={game.board.canvasRef}
				>
				</canvas>
			</div>
		</>
	);
};

export default TestBall;
