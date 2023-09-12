/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";

import Game from "./Objects/Game";

import { io } from "socket.io-client";
import ConnectState from "./Component/ConnectState";


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

	const
	[
		readyPlayerCount,
		setReadyPlayerCount
	] = useState(0);
	const
	[
		connected,
		setConnected
	] = useState(false);
	const
	[
		frameNumber,
		setFrameNumber
	] = useState(0);
	const
	[
		numberOfUsers,
		setNumberOfUsers
	] = useState(0);

	const
	[
		serverDim,
	setServerDim
	] = useState(
	{
		width: 0,
	height: 0
	});

	const
	[
		ballPos,
		setBallPos
	] = useState(
	{
		x: 0,
		y: 0
	});

	const
	[
		scaleServer,
		setScaleServer
	] = useState(
	{
		width: 1,
		height: 1
	});

	const	socketRef = useRef<SocketIOClient.Socket | null>(null);

	const game = new Game();
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

		// change GameEvent to a more appropriate name
		const	updateGame = (data: any) =>
		{
			if (data.type === "game-data")
			{
				setFrameNumber(data.payload.frameNumber);
				const	ballPos = {
					x: (data.payload.ballPos.x / scaleServer.width),
					y: (data.payload.ballPos.y / scaleServer.height)
				};
				setBallPos(ballPos);
								// console.log("updateGame", ballPos);
				game.ball.move(ballPos.x, ballPos.y);
			}
		};

		const	initServerDim = (data: any) =>
		{
				setServerDim(
				{
					width: data.width,
					height: data.height
				});
				const	ratioWidth = data.width / game.board.dim.width;
				const	ratioHeight = data.height / game.board.dim.height;
				setScaleServer(
				{
					width: ratioWidth,
					height: ratioHeight
				});
				console.log("test");
		};

		const	playerInfo = (data: any) =>
		{
			console.log(data);
			switch (data.type)
			{
				case "connect":
				case "disconnect":
					setNumberOfUsers(data.payload.numberUsers);
					setReadyPlayerCount(data.payload.userReadyCount);
					break ;
				case "ready-player":
					setReadyPlayerCount(data.payload.userReadyCount);
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
	}, []);

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
				dimension width du client : {game.board.dim.width} <br />
				dimension height du client: {game.board.dim.height} <br />
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
