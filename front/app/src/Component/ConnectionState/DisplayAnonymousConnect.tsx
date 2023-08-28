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
	clearTokenDataAnonymousUser,
	createAnonymousSession,
	loginAnonymousUser,
	setAnonymousRegistrationStep,
	verifyTokenAnonymousUser,
}	from "../../Redux/store/anonymousUserAction";

import
{
	setIsFetching
}	from "../../Redux/store/serverAction";

import { useEffect } from "react";

const	DisplayAnonymousConnect = () =>
{
	const	dispatch = useAppDispatch();
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	const	registrationStep = useAppSelector((state) =>
	{
		return (state.anonymousUser.registrationStep);
	});

	const	anonymousUser = useAppSelector((state) =>
	{
		return (state.anonymousUser);
	});

	let	message;
	let	descriptMessage;
	let	severity: AlertColor | undefined;

	switch (registrationStep)
	{
		case "undefined":
			severity = "success";
			message = "Connexion au serveur reussie";
			descriptMessage = "Veuillez patienter...";
			break ;
		case "register":
			severity = "info";
			message = "Enregistrement";
			descriptMessage = "Creation d'une nouvelle session visiteur...";
			break ;
		case "login":
			severity = "info";
			message = "Connexion";
			descriptMessage = "Enregistrement de la session reussie";
			break ;
		case "Anonymous User Registred":
			severity = "success";
			message = "Reussie";
			descriptMessage = "";
			break ;
		case "VerifyToken":
			severity = "info";
			message = "";
			descriptMessage = "Verification de votre session en cours";
			break;
		case "TokenVerificationFailure":
			severity = "warning";
			message = "Session expiree";
			descriptMessage = "Tentative de reconnexion en cours";
			break ;
		case "TokenVerificationSucess":
			severity = "success";
			message = "session active";
			descriptMessage = "";
			break ;
		case "reloggin":
			severity = "info";
			message = "";
			descriptMessage = "veuillez patienter";
			break ;
		default:
			severity= "info";
			message = "Chargement en cours";
			break ;
	}

	useEffect(() =>
	{
		const timerRegister = setTimeout(() =>
		{
			if (registrationStep === "undefined")
			{
				console.info("Registration of the user \
				 -- the registration step is undefined");
				dispatch(setAnonymousRegistrationStep("register"));
				dispatch(createAnonymousSession());
			}
			else if (registrationStep === "TokenVerificationFailure")
			{
				console.log("Attempt to relog to the anonymous user");
				console.log(anonymousUser);
				dispatch(setAnonymousRegistrationStep("login"));
				// dispatch(loginAnonymousUser());
			}
			else if (registrationStep === "Anonymous User Registred"
				|| registrationStep === "VerifyToken")
			{
				// check validity of token else login again
				dispatch(setIsFetching(true));
				console.info("The anonymous user is alreaddy registred ");
				console.info("--> ", anonymousUser);
				if (anonymousUser.expireAt
					&& anonymousUser.expireAt > Date.now())
				{
					console.log("The token stored is not expired \
					but the value is not checked here");
					console.log("    -->", anonymousUser.expireAt);
					dispatch(verifyTokenAnonymousUser());
				}
				else
				{
					dispatch(setAnonymousRegistrationStep("reloggin"));
					dispatch(clearTokenDataAnonymousUser());
					dispatch(setAnonymousRegistrationStep("login"));
					dispatch(loginAnonymousUser());
				}
			}
		}, 400);
		return (() =>
		{
			clearTimeout(timerRegister);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() =>
	{
		if (registrationStep === "Anonymous User Registred"
			|| registrationStep === "TokenVerificationSucess")
		{
			const	timerUnmount = setTimeout(() =>
			{
				dispatch(setIsFetching(false));
			}, 1500);
			return (() =>
			{
				clearTimeout(timerUnmount);
			});
		}
		return (() =>
		{
			undefined;
		});
	},
	[
		registrationStep,
		dispatch
	]);
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
					{descriptMessage}
				</Typography>
			</Alert>
		</Backdrop>
	);
};

export default DisplayAnonymousConnect;
