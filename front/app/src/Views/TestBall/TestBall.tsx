/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";

import Game from "./Objects/Game";

import { io } from "socket.io-client";
import ConnectState from "./Component/ConnectState";

const	URL = "http://localhost:3000";

const	TestBall = () =>
{
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
		serverDim,
		setServerDim
	] = useState(
	{
		width: 0,
		height: 0
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

	const game = new Game();
	game.board.game = game;
	game.ball.game = game;
	game.net.game = game;
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	game.board.canvasRef = canvasRef;

	// cleaned 
	const clear = () =>
	{
		return ;
	};

	useEffect(() =>
	{
		const socket = io(URL,
		{
			autoConnect: false,
			reconnectionAttempts: 5,
		});

		const connect = () =>
		{
			console.log("ws connected");
			socket.emit("info", "Get board size");
			setConnected(true);
		};

		const disconnect = () =>
		{
			console.log("ws disconnected");
			setConnected(false);
		};

		const	connectError = (error: Error) =>
		{
			console.error("ws_connect_error", error);
		};

		// change GameEvent 
		//   to a more appropriate name
		const	updateGame = (data: any) =>
		{
			setFrameNumber(data.frameNumber);
			game.ball.move(
				data.ballPos.x / scaleServer.width,
				data.ballPos.y / scaleServer.height);
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
			console.log("Ration Width and height", ratioWidth, ratioHeight);
			setScaleServer(
			{
				width: ratioWidth,
				height: ratioHeight
			}
			);
		};

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("game-event", updateGame);
		socket.on("info", initServerDim);
		socket.connect();

		return (() =>
		{
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("game-event", updateGame);
			socket.off("info", initServerDim);
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
			clear();

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

	return (
		<>
			<div style={{textAlign: "center"}}>
				FT_TRANSCENDANCE
			</div>

			{/* This part show the connection to the websocket */}
			<div style={{textAlign: "center"}}>
				<ConnectState connected={connected} />
			</div>

			{/* This part show the number of client connected */}
			<div style={{textAlign: "center"}} >
				number of client connected :
			</div>

			{/* /* This part show the frame number (the time of the server) */}
			<div style={{textAlign: "center"}} >
				frame number: {frameNumber} <br/>
			</div>

			{/* /* This part show more information */ }
			<div style={{textAlign: "center"}} >
				dimension width du server: {serverDim.width} <br />
				dimension height du server: {serverDim.height} <br />
				scale to server :
					scale_width: {scaleServer.width},
					scale_height: {scaleServer.height} <br />
				dimension width du client : {game.board.dim.width} <br />
				dimension height du client: {game.board.dim.height} <br />
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
