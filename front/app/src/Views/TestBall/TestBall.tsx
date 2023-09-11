/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";

import Game from "./Objects/Game";

import { io } from "socket.io-client";

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

	const	update = () =>
	{
		// will Update data from backend;
		game.playerOne.updatePlayerPosition();
		game.playerTwo.updatePlayerPosition();

		game.ball.update();
	};

	const clear = () =>
	{
		if (game.board.ctx)
		{
			console.log("clear executed from testball");
			game.board.ctx.fillStyle = "#fff";
			// game.board.ctx?.clearRect(0, 0,
			// 	game.board.dim.width, game.board.dim.height);
		}
	};

	const pauseButtonRef = useRef<HTMLInputElement>(null);
	const resumeButtonRef = useRef<HTMLInputElement>(null);

	// useEffect(() =>
	// {
	// 	setDim(
	// 	{
	// 		width: game.board.dim.width,
	// 		height: game.board.dim.height
	// 	});
	// }, []);

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

		const	render = () =>
		{
			clear();
			update();

			game.board.ctx?.beginPath();
			if (game.board.ctx)
			{
				game.board.ctx.fillStyle = "#F5F5DC";
				game.board.ctx.fillRect(0, 0, game.board.dim.width,
					game.board.dim.height);
			}
			game.net.render();
			game.ball.render();
			game.playerOne.render();
			game.playerTwo.render();
			game.playerOne.renderScore();
			game.playerTwo.renderScore();
		};

		const	gameEvent = (data: any) =>
		{
			// console.log(data);
			setFrameNumber(data.frameNumber);
			game.ball.move(
				data.ballPos.x / scaleServer.width,
				data.ballPos.y / scaleServer.height);
			// render();
		};

		const	setServerDimEvent = (data: any) =>
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
		// addEventListener("resize", setServerDimEvent);

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("game-event", gameEvent);
		socket.on("info", setServerDimEvent);
		socket.connect();
		return (() =>
		{
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("game-event", gameEvent);
			socket.off("info", setServerDimEvent);
			// removeEventListener("resize", setServerDimEvent);
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
		// addEventListener("keydown", keyHookDown);
		// addEventListener("keyup", keyHookReleased);
		// addEventListener("keypress", keyEnter);

		const	render = () =>
		{
			clear();
			update();

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

	const	ConnectStateOn = () =>
	{
		return (
			<>
				online
			</>
		);
	};

	const	ConnecStateOff = () =>
	{
		return (
			<>
				offline
			</>
		);
	};

	return (
		<>
			<div style={{textAlign: "center"}}>
				FT_TRANSCENDANCE
			</div>
			<div style={{textAlign: "center"}}>
				Your connection :
				{
					(connected)
					? <ConnectStateOn />
					: <ConnecStateOff />
				}
			</div>
			<div style={{textAlign: "center"}} >
				number of client connected :
			</div>
			<div style={{textAlign: "center"}} >
				frame number: {frameNumber}
			</div>
			<br></br>
			<div style={{textAlign: "center"}} >
				dimension width du server: {serverDim.width} <br />
				dimension height du server: {serverDim.height} <br />
				dimension width du client : {game.board.canvas?.width} <br />
				dimension height du client: {game.board.canvas?.height} 
			</div>
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
