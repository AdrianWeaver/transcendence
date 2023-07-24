/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { useState, useEffect} from "react";
import { useAppDispatch } from "../../hooks/redux-hooks";
import { setCanvasSize } from "../../store/controllerAction";

// This is a hook 
const	UseWindowSize = () =>
{
	const dispatch = useAppDispatch();

	useEffect(() =>
	{
		function handleResize()
		{
			dispatch(
				setCanvasSize(
				{
					height: window.innerHeight,
					width: window.innerWidth
				})
			);
		}
		window.addEventListener("resize", handleResize);
		return () =>
		{
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return ;
};

export default UseWindowSize;
