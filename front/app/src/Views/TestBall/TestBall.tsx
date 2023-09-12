/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";

import Game from "./Objects/Game";

import { io } from "socket.io-client";
import ConnectState from "./Component/ConnectState";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import {
	setBallPosition,
	setBoardDimension,
	setFrameNumber,
	setNumberOfUsers,
	setPlayerOnePos,
	setPlayerTwoPos,
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

	const	dispatch = useAppDispatch();
	const	serverDim = useAppSelector((state) =>
	{
		return (state.gameEngine.server.dimension);
	});
	const	scaleServer = useAppSelector((state) =>
	{
		return (state.gameEngine.server.scaleServer);
	});
	const	boardDim = useAppSelector((state) =>
	{
		return (state.gameEngine.board.dimension);
	});
	const	numberOfUsers = useAppSelector((state) =>
	{
		return (state.gameEngine.server.numberOfUser);
	});
	const	readyPlayerCount = useAppSelector((state) =>
	{
		return (state.gameEngine.server.readyPlayerCount);
	});
	const	frameNumber = useAppSelector((state) =>
	{
		return (state.gameEngine.server.frameNumber);
	});
	const	ballPos = useAppSelector((state) =>
	{
		return (state.gameEngine.board.ball.position);
	});
	const	playerOnePos = useAppSelector((state) =>
	{
		return (state.gameEngine.board.playerOne.position);
	});
	const	playerTwoPos = useAppSelector((state) =>
	{
		return (state.gameEngine.board.playerTwo.position);
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
				// console.log(data.payload.ballPos);
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
			console.log(data);
			switch (data.type)
			{
				case "connect":
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

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("game-event", updateGame);
		socket.on("info", initServerDim);
		socket.on("player-info", playerInfo);
		socket.connect();

		return (() =>
		{
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("game-event", updateGame);
			socket.off("info", initServerDim);
			socket.off("player-info", playerInfo);
		});
	}, []);

	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;

		const ctx = canvas?.getContext("2d");
		game.board.canvas = canvas;
		game.board.ctx = ctx;
		game.board.init();

		const	render = () =>
		{
			// update fix
			game.ball.move(ballPos.x, ballPos.y);
			game.board.ctx?.beginPath();
			if (game.board.ctx)
			{
				game.board.ctx.fillStyle = "#F5F5DC";
				game.board.ctx.fillRect(0, 0, game.board.dim.width,
					game.board.dim.height);
			}
			game.net.render();
			game.ball.render();
			requestId = requestAnimationFrame(render);
		};
		requestId = requestAnimationFrame(render);
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	},
	[
		ballPos,
	]);

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

	const	displayStyle: React.CSSProperties = {
		textAlign: "center",
		fontSize: "8px"
	};

	return (
		<>
			<div style={displayStyle}>
				FT_TRANSCENDANCE
			</div>

			{/* This part show the connection to the websocket */}
			<div style={displayStyle}>
				<ConnectState connected={connected} />
			</div>

			{/* This part show the number of client connected */}
			<div style={displayStyle}>
				number of client connected : {numberOfUsers}<br/>
				number of client ready : {readyPlayerCount}
			</div>

			{/* This part show the frame number */}
			<div style={displayStyle}>
				frame number (time server): {frameNumber} <br/>
			</div>

			{/* /* This part show more information */ }
			<div style={displayStyle}>
				position ball x: {ballPos.x} <br />
				position ball y: {ballPos.y} <br />
				dimension width du server: {serverDim.width} <br />
				dimension height du server: {serverDim.height} <br />
				scale to server :
					scale_width: {scaleServer.width},
					scale_height: {scaleServer.height} <br />
				dimension width du client : {boardDim.width} <br />
				dimension height du client: {boardDim.height} <br />
				position du player 1: {JSON.stringify(playerOnePos)} <br />
				position du player 2: {JSON.stringify(playerTwoPos)} <br />
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
