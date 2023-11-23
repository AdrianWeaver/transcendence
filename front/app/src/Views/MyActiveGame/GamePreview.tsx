/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { CardMedia } from "@mui/material";
import { useRef, useEffect } from "react";

export type	GamePreviewProps = {
	playerOne: any;
	playerTwo: any;
	ball: any;
	board: any;
}

const	GamePreview = (props: GamePreviewProps) =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		if (canvas)
		{
			const	ctx = canvas?.getContext("2d");
			const	width = canvas?.width as number;
			const	height = canvas?.height as number;
			const	bgColor = "white";

			if (ctx)
			{
				const	ratioX = width / props.board.dim.width;
				const	ratioY = height / props.board.dim.height;

				const ballPos = {
					x: props.ball.pos.x * ratioX,
					y: props.ball.pos.y * ratioY,
				};
				const playOnePos = {
					x: props.playerOne.pos.x * ratioX,
					y: props.playerOne.pos.y * ratioY
				};
				const playTwoPos = {
					x: props.playerTwo.pos.x * ratioX,
					y: props.playerTwo.pos.y * ratioY
				};
				const	racketDim = {
					width: props.playerOne.racket.dim.width * ratioX,
					height: props.playerOne.racket.dim.height * ratioY
				};
				const	ballRadius
					= props.ball.radius * ((ratioX + ratioY) / 2);
				// il s'agit la d'un instantane de la partie
				ctx.fillStyle = bgColor;
				ctx.fillRect(0, 0, width, height);
				ctx.fillStyle = "black";
				ctx.fillRect(
					playOnePos.x,
					playOnePos.y,
					racketDim.width,
					racketDim.height
				);
				ctx.fillRect(
					playTwoPos.x,
					playTwoPos.y,
					racketDim.width,
					racketDim.height
				);
				ctx.beginPath();
				ctx.arc(
					ballPos.x,
					ballPos.y,
					ballRadius,
					0,
					2 * Math.PI);
				ctx.fill();
			}
		}
	}, []);

	return (
		<>
			<CardMedia
				component="canvas"
				ref={canvasRef}
			/>
		</>
	);
};
export default GamePreview;
