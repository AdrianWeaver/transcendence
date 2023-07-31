/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import UseWindowSize from "../Canvas/UseWindowSize";

/* docu https://css-tricks.com/using-requestanimationframe-with-react-hooks/*/
const	AnimationTest = () =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);
	const	size = useAppSelector((state) =>
	{
		return (state.controller.canvas);
	});
	UseWindowSize();

	useEffect(() =>
	{
		const canvas = canvasRef.current;
		const	ctx = canvas?.getContext("2d");

		// if (!ctx)
        let i;
        i = 0;
        let requestId;
        const	draw = () =>
        {
            ctx?.clearRect(0, 0, size.width, size.height);
            ctx?.beginPath();
            ctx.fillStyle = "#000";
            ctx?.fillRect(0, 0, size.width, size.height);
            ctx.fillStyle = "#fff";
            ctx?.arc(
                size.width / 2 - 25,
                size.height / 2 - 25,
                0 + i,
                0,
                2 * Math.PI
            );
            ctx?.fill();
            if (50 + i == 200)
                i = 0;
            else
                i += 0.5;
            requestId = requestAnimationFrame(draw);
        };
        // const requestId = requestAnimationFrame(draw);
        draw();
        return (() =>
        {
            cancelAnimationFrame(requestId);
        });
	});
	return (
		<>
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

export default AnimationTest;
