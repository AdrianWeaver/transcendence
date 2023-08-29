/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import {
	Alert,
	AlertColor,
	Backdrop,
	LinearProgress,
	Typography
}	from "@mui/material";

import
{
	useAppDispatch,
	useAppSelector
}	from "../../Redux/hooks/redux-hooks";
import { useEffect } from "react";
import { NIL } from "uuid";
import {
	clearAllDataAnonymousUser,
	loginAnonymousUser,
	registerAnonymousUser,
	setAnonymousRegistrationStep,
	setAnonymousUuid,
	verifyTokenAnonymousUser
}	from "../../Redux/store/anonymousUserAction";
import { setIsFetching } from "../../Redux/store/serverAction";

type DisplayedProps = {
	message: string;
	descriptMessage: string;
	severity: AlertColor | undefined;
};

const	DisplayedComponent = (props: DisplayedProps) =>
{
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

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
				severity={props.severity}
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
					{props.message}
				</Typography>
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.5rem"
					}}
				>
					{props.descriptMessage}
				</Typography>
			</Alert>
		</Backdrop>
	);
};

const	DisplayAnonymousConnection = () =>
{
	const	dispatch = useAppDispatch();
	const	registrationStep = useAppSelector((state) =>
	{
		return (state.anonymousUser.registrationStep);
	});
	const	anonymousUser = useAppSelector((state) =>
	{
		return (state.anonymousUser);
	});

	let		message;
	let		descriptMessage;
	let		severity: AlertColor | undefined;

	switch (registrationStep)
	{
		case "undefined":
			severity = "info";
			message = "";
			descriptMessage = "Initialisation de la session";
			break ;
		case "reset":
			severity = "error";
			message = "Error";
			descriptMessage = "Reinitialisation de la page";
			break ;
		case "uuid-creation-started":
			severity = "info";
			message = "";
			descriptMessage = "Generation de votre identifiant";
			break ;
		case "uuid-creation-sucess":
			severity = "success";
			message = "";
			descriptMessage = "Identifiant generes";
			break ;
		case "register-anonymous-started":
			severity = "info";
			message = "";
			descriptMessage = "Enregistrement sur le serveur";
			break ;
		case "register-anonymous-success":
			severity = "success";
			message = "";
			descriptMessage = "Enregistrement reussi aupres du serveur";
			break ;
		case "login-anonymous-started":
			severity = "info";
			message = "";
			descriptMessage = "Request login to the server ";
			break ;
		case "login-anonymous-success":
			severity = "success";
			message = "";
			descriptMessage = "Session Active";
			break ;
		case "token-verification-started":
			severity = "info";
			message = "";
			descriptMessage = "Verify you session token";
			break ;
		case "token-verification-success":
			severity = "success";
			message = "";
			descriptMessage = "Your session token is valid";
			break ;
		default:
			severity= "warning";
			message = "";
			descriptMessage = "If message persist please contact dev team";
			break ;
	}

	// console.info(anonymousUser);

	// logic of registration
	useEffect(() =>
	{
		// create the user unique identifier
		if (registrationStep === "undefined")
		{
			if (anonymousUser.uuid !== NIL)
			{
				// stored value tested to trigger:
				// eslint-disable-next-line max-len
				// {"registrationStep":"\"undefined\"","uuid":"\"161e3594-be9d-4afd-bdfe-d21aa7128350\"","creationDate":"\"\"","password":"\"\"","message":"\"\"","expireAt":"-1","token":"\"\"","error":"false","errorMessage":"\"\"","errorStatusCode":"0","_persist":"{\"version\":-1,\"rehydrated\":true}"}
				console.error("Logic failure",
				"Unidentified registration state can't"
					+ " be with a generated uuid");
				dispatch(setAnonymousRegistrationStep("reset"));
			}
			else
			{
				console.log("need to create uuid");
				dispatch(setAnonymousUuid());
				dispatch(setAnonymousRegistrationStep("uuid-creation-sucess"));
			}
		}
		// this can be called when error occurs
		else if (registrationStep === "reset")
			dispatch(clearAllDataAnonymousUser());
		else if (registrationStep === "uuid-creation-sucess")
		{
			dispatch(
				setAnonymousRegistrationStep("register-anonymous-started")
			);
			dispatch(registerAnonymousUser());
		}
		else if (registrationStep === "register-anonymous-success")
		{
			dispatch(setAnonymousRegistrationStep("login-anonymous-started"));
			dispatch(loginAnonymousUser());
		}
		else if (registrationStep === "login-anonymous-success")
			dispatch(
				setAnonymousRegistrationStep("token-verification-started")
			);
		else if (registrationStep === "token-verification-started")
			dispatch(verifyTokenAnonymousUser());
		else if (registrationStep === "token-verification-failure")
		{
			console.log("token failure");
		}
		else if (registrationStep === "token-verification-success")
		{
			console.log("token success");
			const	timerUnmount = setTimeout(() =>
			{
				dispatch(setIsFetching(false));
			}, 300);
			return (() =>
			{
				clearTimeout(timerUnmount);
			});
		}
		else
		{
			console.log("already make uuid");
		}
	},
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[
		registrationStep,
		dispatch
	]);
	return (
		<DisplayedComponent
			severity={severity}
			message={message}
			descriptMessage={descriptMessage}
		/>
	);
};

export default DisplayAnonymousConnection;
