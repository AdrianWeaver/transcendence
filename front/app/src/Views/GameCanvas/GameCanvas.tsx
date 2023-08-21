/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef } from "react";

// if we don't import all objects, the game will not work
import Game from "./objects/Game";
import Board from "./objects/Board";
import Ball from "./objects/Ball";
import Net from "./objects/Net";
import Player from "./objects/Player";
import Racket from "./objects/Racket";
import Position from "./objects/Position";
import Dimension from "./objects/Dimension";

const	GameCanvas = () =>
{
	const game = new Game();
	game.board.game = game;

	game.ball.game = game;
	game.net.game = game;

	const	canvasRef = useRef<HTMLCanvasElement>(null);
	game.board.canvasRef = canvasRef;
	const	update = () =>
	{
		game.playerOne.updatePlayerPosition();
		game.playerTwo.updatePlayerPosition();
		game.ball.update();
	};

	const clear = () =>
	{
		if (game.board.ctx)
		{
			game.board.ctx.fillStyle = "#fff";
			game.board.ctx?.clearRect(0, 0,
				game.board.dim.width, game.board.dim.height);
		}
	};

	// I don't know what type we need to put here
	const	keyHookDown = (e) =>
	{
		switch (e.keyCode)
		{
			case 38:
				game.actionKeyPress = 38;
				break;
			case 40:
				game.actionKeyPress = 40;
				break;
			case 83:
				game.actionKeyPress = 83;
				break;
			case 87:
				game.actionKeyPress = 87;
				break;
			default:
				break;
		}
	};

	const	keyHookReleased = () =>
	{
		game.actionKeyPress = -1;
	};

	const keyEnter = () =>
	{
		game.continueAnimating = true;
		game.startDisplayed = false;
	};

	const pauseButtonRef = useRef<HTMLInputElement>(null);
	const resumeButtonRef = useRef<HTMLInputElement>(null);


	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;
		const pauseButton = pauseButtonRef.current;
		const resumeButton = resumeButtonRef.current;

		const ctx = canvas?.getContext("2d");
		game.board.canvas = canvas;
		game.board.ctx = ctx;
		game.board.init();
		addEventListener("keydown", keyHookDown);
		addEventListener("keyup", keyHookReleased);
		addEventListener("keydown", keyEnter);

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
			if (game.startDisplayed === true)
				game.displayStartMessage();
			if (game.startDisplayed === false)
			{
			pauseButton?.addEventListener("click", function()
			{
				game.continueAnimating = false;
			});
			resumeButton?.addEventListener("click", function()
			{
				game.continueAnimating = true;
			});
			}
			requestId = requestAnimationFrame(render);
		};
		requestId = requestAnimationFrame(render);
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	});

	return (
		<>
			<div style={{textAlign: "center"}}>
				FT_TRANSCENDANCE
			</div>
			<br></br>
			<div style={{textAlign: "center"}}>
				<canvas
					height={game.board.canvas?.height}
					width={game.board.canvas?.width}
					ref={game.board.canvasRef}
				>
				</canvas>
			</div>
			<div style={{textAlign: "center"}}>
				<input type="button" value="PAUSE" ref={pauseButtonRef} />
				<input type="button" value="RESUME" ref={resumeButtonRef} />
			</div>
		</>
	);
};

export default GameCanvas;
