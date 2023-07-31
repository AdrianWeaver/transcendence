/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import UseWindowSize from "../Canvas/UseWindowSize";

import Game from "./Game";

/* docu https://css-tricks.com/using-requestanimationframe-with-react-hooks/*/
const	GameCanvas = () =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	UseWindowSize();

	const	irlWidth = 274;
	const	irlHeight = 152.5;
	const	irlRatio = irlHeight / irlWidth;
	const	boardWidth = size.width * 0.66;
	const	boardHeight = irlRatio * boardWidth;

	const	renderBoard = (ctx: CanvasRenderingContext2D) =>
	{
		ctx.fillStyle = "#fff";
		ctx.fillRect((size.width * 0.34) / 2, 0, boardWidth, boardHeight);
	};

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		const	ctx = canvas?.getContext("2d");

		if (ctx)
		{
			const	draw = () =>
			{
				ctx.fillStyle = "#000";
				ctx.fillRect(0, 0, size.width, size.height);
				renderBoard(ctx);
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
			<p>height of the window {size.height}</p>
			<p>width of the window {size.width}</p>
			<p>height of the board {boardHeight}</p>
			<p>width of the board {boardWidth}</p>
			<div>
				<canvas

					height={size.height}
					width={size.width}
					ref={canvasRef}
				>
				</canvas>
			</div>
		</>
	);
};

export default GameCanvas;
