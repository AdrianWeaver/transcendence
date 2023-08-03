/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import React, { createContext } from 'react';
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

	const game = new Game();
	game.board.game = game;

	let actionKeyPress;
	actionKeyPress = -1;

	game.ball.game = game;
	game.net.game = game;

	const	canvasRef = useRef<HTMLCanvasElement>(null);
	game.board.canvasRef = canvasRef;
	// const canvas = canvasRef.current;
	// const ctx = canvas?.getContext("2d");

	// game.board.init();

	useEffect(() =>
	{
		let requestId: number;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		game.board.canvas = canvas;
		game.board.ctx = ctx;
		game.board.init();
		// if (game.board.ctx)
		// {
			const	draw = () =>
			{
				game.board.ctx?.clearRect(0, 0, game.board.dim.width, game.board.dim.height);
				game.board.ctx?.beginPath();
				if (game.board.ctx)
				{
					game.board.ctx.fillStyle = "#F5F5DC";
					game.board.ctx.fillRect(0, 0, game.board.dim.width, game.board.dim.height);
				}
				requestId = requestAnimationFrame(draw);
			};
			requestId = requestAnimationFrame(draw);
		// }
		return (() =>
		{
			cancelAnimationFrame(requestId);
		});
	});

	// if (game.board.canvas !== null)
	// {
		return (
			<>
				<div>
					FT_TRANSCENDANCE
				</div>
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
	// }
	// else
	// {
	// 	window.alert();
	// }
};

export default GameCanvas;
