/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import
{
	useAppDispatch,
	useAppSelector
}	from "../../hooks/redux-hooks";


import {
	Alert,
	AlertColor,
	Backdrop,
	LinearProgress,
	Typography
}	from "@mui/material";
import { getServerConnection, resetConnexionAttempt } from "../../store/serverAction";

const	ConnectionState = () =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	let	message;
	let	severity: AlertColor | undefined;

	switch (server.connexionAttempt)
	{
		case 0:
			severity = "info";
			message = "Initialisation en cours";
			break ;
		case 1:
		case 2:
		case 3:
			severity = "info";
			message = "Connexion au serveur en cours attempt #";
			message += server.connexionAttempt;
			break ;
		case 4:
			message = "Erreur de connexion au serveur";
			severity = "error";
			break ;
		default:
			severity= "info";
			message = "Chargement en cours";
			break ;
	}

	if (server.connexionEnabled === false)
		dispatch(getServerConnection());

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
			open={!server.connexionEnabled}
		>
			<Alert
				severity={severity}
			>
				<LinearProgress color="inherit" />
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.7rem"
					}}
				>
					{message}
				</Typography>
			</Alert>
		</Backdrop>
	);
};

export default ConnectionState;
