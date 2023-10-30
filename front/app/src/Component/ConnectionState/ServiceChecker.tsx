/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import
{
	useAppDispatch,
	useAppSelector
}	from "../../Redux/hooks/redux-hooks";

import {
	Alert,
	AlertColor,
	Backdrop,
	LinearProgress,
	Typography
}	from "@mui/material";
import
{
	getServerConnection,
	increaseConnectionAttempt,
}	from "../../Redux/store/serverAction";
import { useEffect } from "react";

const	ServiceChecker = () =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	let	message;
	let	severity: AlertColor | undefined;
	let msDuration: number;

	msDuration = 400;
	if (server.connexionEnabled === false)
		switch (server.connexionAttempt)
		{
			case 0:
				severity = "info";
				message = "Etablissement de la connection en cours";
				break ;
			case 1:
			case 2:
			case 3:
				severity = "info";
				message = "Connexion au serveur en cours attempt #";
				message += server.connexionAttempt;
				break ;
			case 4:
				message = "Erreur de connexion au serveur ";
				severity = "error";
				break ;
			default:
				severity= "info";
				message = "Chargement en cours";
				break ;
		}
	else
	{
		message = "Connextion etablie";
		severity = "success";
		msDuration = 500;
	}

	useEffect(() =>
	{
		setTimeout(() =>
		{
			dispatch(increaseConnectionAttempt());
			dispatch(getServerConnection());
		}, msDuration);
	}, []);

	const	loading = <LinearProgress color="inherit" />;

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
			open={server.isFetching}
		>
			<Alert
				severity={severity}
			>
				{
					(server.error)
					? <></>
					: loading
				}
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.7rem"
					}}
				>
					{message}
				</Typography>
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.5rem"
					}}
				>
					{server.message}
				</Typography>
			</Alert>
		</Backdrop>
	);
};

export default ServiceChecker;
