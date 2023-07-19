import	React, {useEffect, useRef} from "react";

interface	CanvasProps
{
	draw: (context: CanvasRenderingContext2D) => void;
	height: number;
	width: number;
}

const	Canvas: React.FC<CanvasProps> = ({draw, height, width}) =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		const	context = canvas?.getContext("2d");

		if (context)
			draw(context);
	}, [draw]);

	return (
		<canvas
			id ="background"
			ref={canvasRef}
			height={height}
			width={width}
		>
		</canvas>);
};

export default Canvas;
