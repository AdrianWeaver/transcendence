/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

// import { useState } from "react";
// import UseWindowSize from "../Canvas/UseWindowSize";
// import Canvas from "../Canvas/Canvas";
// import VerticalStroke from "./VerticalStroke";

// const	Background = () =>
// {
// 	const	size = UseWindowSize();
// 	const	interval = (size.width / 10);
// 	const	initCrossValue : number = 0 - (interval * 8);
// 	let		cross: number;

// 	cross = initCrossValue;
// 	const
// 	[
// 		verticalStrokeArray,
// 		setVerticalStrokeArray
// 	] = useState<Array<VerticalStroke>>([]);
// 	const
// 	[
// 		horizontalStrokeArray,
// 		setHorizontalStrokeArray
// 	] = useState<Array<HorizontalStroke>>([]);
// 	const
// 	[
// 		lockedSize,
// 		setLockwedSize
// 	] = useState<SizeModel>(
// 	{
// 		width: 0,
// 		height: 0
// 	});

// 	const	draw = (context: CanvasRenderingContext2D) =>
// 	{
// 		context.clearRect(0, 0, size.width, size.height);

// 		const gradient = context.createLinearGradient(0, size.height, 0, 0);
// 		gradient.addColorStop(0, "rgba(0, 255, 0, 0.5)");
// 		gradient.addColorStop(0.55, "rgba(0, 255, 0, 0)");
// 		gradient.addColorStop(1.0, "rgba(0, 255, 0, 0)");

// 		if (lockedSize !== size)
// 		{
// 			setVerticalStrokeArray([]);
// 			setHorizontalStrokeArray([]);
// 			cross = initCrossValue;
// 			for (let i = 0; i < 27; i++)
// 			{
// 				const	objElem = new VerticalStroke(
// 					cross, context, gradient, size
// 				);
// 				setVerticalStrokeArray((prevArray) =>
// 				{
// 					return (
// 					[
// 						...prevArray,
// 						objElem
// 					]);
// 				});
// 				cross = cross + interval;
// 			}
// 			console.log("resynced");
// 			for (let i = 0; i < 10; i++)
// 			{
// 				const objElem = new HorizontalStroke(
// 					(size.height / 2) + interval, context, size
// 				);
// 				setHorizontalStrokeArray((prevArray) =>
// 				{
// 					return (
// 						[
// 							...prevArray,
// 							objElem
// 						]
// 					);
// 				});
// 			}
// 			setLockwedSize(size);
// 		}

// 		for(let i = 0; i < verticalStrokeArray.length; i++)
// 			verticalStrokeArray[i].update();

// 		// ? I cant anmiate this horizontal stroke array
// 		horizontalStrokeArray.forEach((elem) =>
// 		{
// 			elem.update();
// 		});
// 	};

// 	return (
// 		<Canvas
// 			draw={draw}
// 			width={size.width}
// 			height={size.height}
// 		/>
// 	);
// };

// export default Background;
