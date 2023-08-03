/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import UseWindowSize from "../Canvas/UseWindowSize";

import Game from "./objects/Game";
import Board from "./objects/Board";
import Ball from "./objects/Ball";
import Net from "./objects/Net";
import Player from "./objects/Player";
import Racket from "./objects/Racket";
import Position from "./objects/Position";
import Dimension from "./objects/Dimension";

/* docu https://css-tricks.com/using-requestanimationframe-with-react-hooks/*/
const	GameCanvas = () =>
{
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	UseWindowSize();

	const	renderBoard = (ctx: CanvasRenderingContext2D) =>
	{
		ctx.fillStyle = "#f00";
		ctx.fillRect(0, 0, game.board.dim.width, game.board.dim.height);
	};

	const game = new Game();
	game.board.game = game;

	let actionKeyPress;
	actionKeyPress = -1;

	game.ball.game = game;
	game.net.game = game;

	game.board.init();

	useEffect(() =>
	{
		let requestId;
		// if (game.board.ctx)
		// {
			const	draw = () =>
			{
				renderBoard(game.board.ctx);
				requestId = requestAnimationFrame(draw);
			};
			requestId = requestAnimationFrame(draw);
		// }
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	});

	if (game.board.canvas !== null)
	{
		return (
			<>
				<div>
					<canvas
						height={game.board.canvas?.height}
						width={game.board.canvas?.width}
						ref={game.board.canvasRef}
					>
					</canvas>
				</div>
			</>
		);
	}
	// else
	// {
	// 	window.alert();
	// }
};

export default GameCanvas;
