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
	createAnonymousSession,
	getServerConnection,
	increaseConnectionAttempt,
	setAnonymousRegistrationStep,
}	from "../../Redux/store/serverAction";
import { useEffect } from "react";

const	DisplayAnonymousConnect = () =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	let	message;
	let	severity: AlertColor | undefined;

	// switch (server.connexionAttempt)
	// {
	// 	case 0:
	// 		severity = "info";
	// 		message = "Initialisation en cours";
	// 		break ;
	// 	case 1:
	// 	case 2:
	// 	case 3:
	// 		severity = "info";
	// 		message = "Connexion au serveur en cours attempt #";
	// 		message += server.connexionAttempt;
	// 		break ;
	// 	case 4:
	// 		message = "Erreur de connexion au serveur ";
	// 		severity = "error";
	// 		break ;
	// 	default:
	// 		severity= "info";
	// 		message = "Chargement en cours";
	// 		break ;
	// // }

	useEffect(() =>
	{
		setTimeout(() =>
		{
			if (server.anonymousUser.registrationStep === "undefined")
			{
				dispatch(setAnonymousRegistrationStep("register"));
				dispatch(createAnonymousSession());
			}
		}, 400);
	}, []);
	if (server.isFetching)
	{
		message = "Creating you visitor session";
		severity = "info";
	}

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

export default DisplayAnonymousConnect;
