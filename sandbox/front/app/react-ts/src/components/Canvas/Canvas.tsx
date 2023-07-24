/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import	React, {useEffect, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { setCanvasSize } from "../../store/controllerAction";

const	Canvas: React.FC = () =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	const dispatch = useAppDispatch();
	const
	[
		vLine,
		setVLine
	] = useState(0);
	const
	[
		hLine,
		setHLine,
	] = useState(0);
	const	minHeight = 150;
	const	minWidth = 150;
	const	vSpace = 25;
	const	hSpace = 120;

	useEffect(() =>
	{
		function handleResize()
		{
			dispatch(
				setCanvasSize(
				{
					height: window.innerHeight - 8,
					width: window.innerWidth
				})
			);
		}
		window.addEventListener("resize", handleResize);
		return () =>
		{
			window.removeEventListener("resize", handleResize);
		};
	});

	const	getGradient = (ctx: CanvasRenderingContext2D) =>
	{
		const	gradient = ctx.createLinearGradient(
			size.width / 2,
			size.height / 2,
			size.width / 2,
			size.height
		);
		gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		gradient.addColorStop(0.25, "rgba(0, 50, 50, 0.05)");
		gradient.addColorStop(0.5, "rgba(0, 100, 100, 0.20)");
		gradient.addColorStop(0.75, "rgba(0, 175, 175, 0.35)");
		gradient.addColorStop(1, "rgba(0, 255, 255, 0.5)");

		return (gradient);
	};

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		const	ctx = canvas?.getContext("2d");
		const	start = -(hSpace * hLine / 3);

		setVLine(Math.round((size.height - 8) / 2 / vSpace));
		setHLine(Math.round(size.width / hSpace) * 3);
		if (ctx)
		{
			const	draw = () =>
			{
				// console.log("Hello");
				ctx.clearRect(0, 0, size.width, size.height - 8);
				ctx.strokeStyle = getGradient(ctx);
				for (let i = 0; i < hLine; i++)
				{
					ctx.beginPath();
					ctx.moveTo(size.width / 2, (size.height - 8) / 2);
					ctx.lineTo(start + (hSpace * i), size.height - 8);
					ctx.closePath();
					ctx.stroke();
				}
				for (let i = 0; i < vLine; i++)
				{
					const y = size.height
						- Math.sin(Math.PI / 2 * ((i + 1) / vLine))
							* (size.height - 8) / 2;
					ctx.beginPath();
					ctx.moveTo(0, y);
					ctx.lineTo(size.width, y);
					ctx.stroke();
				}
				requestAnimationFrame(draw);
			};
			draw();
		}
	},
	[
		size,
		hLine,
		vLine,
	]);

	if (size.height < minHeight || size.width < minWidth)
		return (
		<>
			<p>Canvas not rendered: reason to low resolution of the window</p>
		</>);
	else
		return (
			<canvas
				style={
					{
						position: "absolute",
						zIndex: -999,
						top: 0,
						left: 0,
					}}
				id ="background"
				ref={canvasRef}
				// minus 8 is hardcoded ()
				height={size.height - 8}
				width={size.width}
			>
			</canvas>
		);
};

export default Canvas;
