/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { verifyTokenAtRefresh } from "../../Redux/store/controllerAction";
import { Backdrop, Alert, Typography } from "@mui/material";

const	Message = () =>
{
	return (
		<Backdrop
			sx={
			{
				color: "#fff",
				zIndex: (theme) =>
				{
					return (theme.zIndex.drawer + 1);
				}
			}}
			open={true}
		>
			<Alert
				severity={"success"}
			>
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.7rem"
					}}
				>
					Vous etes maintenant connecte
				</Typography>
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.5rem"
					}}
				>
					Enjoy !!
				</Typography>
			</Alert>
		</Backdrop>
	);
};

const SessionUserVerificator = () =>
{
	const	dispatch = useAppDispatch();
	const
	[
		render,
		setRender
	] = useState(<></>);
	const
	[
		firstDisplay,
		setFirstDisplay
	] = useState(true);

	useEffect(() =>
	{
		if (firstDisplay)
		{
			setRender(<Message />);
			setTimeout(() =>
			{
				dispatch(verifyTokenAtRefresh());
				setFirstDisplay(false);
			}, 200);
		}
		else
		{
			dispatch(verifyTokenAtRefresh());
			setRender(<></>);
		}
	}, [firstDisplay]);

	return (render);
};

export default SessionUserVerificator;
