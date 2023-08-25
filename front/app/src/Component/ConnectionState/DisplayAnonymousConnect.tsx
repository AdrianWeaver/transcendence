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
	setAnonymousRegistrationStep,
}	from "../../Redux/store/anonymousUserAction";

import { useEffect } from "react";

const	DisplayAnonymousConnect = () =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	const	anonymousUser = useAppSelector((state) =>
	{
		return (state.anonymousUser);
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
			if (anonymousUser.registrationStep === "undefined")
			{
				dispatch(setAnonymousRegistrationStep("register"));
				dispatch(createAnonymousSession());
			}
		}, 400);
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
