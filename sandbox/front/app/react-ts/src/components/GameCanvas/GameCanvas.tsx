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
		ctx.fillRect((size.width * 0.34) / 2, 0, boardWidth, boardHeight);
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
		if (game.board.ctx)
		{
			const	draw = () =>
			{
				renderBoard(game.board.ctx);
				requestAnimationFrame(draw);
			};
			requestAnimationFrame(draw);
		}
		// return (() =>
		// {
		// 	cancelAnimationFrame(canvasRef.current);
		// });
	});

	return (
		<>
			<div>
				<canvas

					height={size.height}
					width={size.width}
					ref={game.board.canvasRef}
				>
				</canvas>
			</div>
		</>
	);
};

export default GameCanvas;
