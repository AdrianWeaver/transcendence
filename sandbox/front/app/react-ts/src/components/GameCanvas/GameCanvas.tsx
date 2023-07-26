/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import UseWindowSize from "../Canvas/UseWindowSize";

/* docu https://css-tricks.com/using-requestanimationframe-with-react-hooks/*/
const	GameCanvas = () =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	UseWindowSize();

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		const	ctx = canvas?.getContext("2d");

		if (ctx)
		{
			const	draw = () =>
			{
				ctx.fillStyle = "#f00";
				ctx.fillRect(0, 0, size.width, size.height);
				ctx.fillStyle = "#fff";
				ctx.fillRect(size.width / 2 - 25, size.height / 2 -25 , 50, 50);
				requestAnimationFrame(draw);
			};
			requestAnimationFrame(draw);
		}
	});
	return (
		<>
			<p>height of the window { size.height}</p>
			<p>width of the window {size.width}</p>
			<canvas
				height={size.height}
				width={size.width}
				ref={canvasRef}
			>
			</canvas>
		</>
	);
};

export default GameCanvas;
