/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import	serverSlice from "./server-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import
{
	AnonymousUserLoginResponseModel,
	AnonymousUserRegisterResponseModel,
	ServerModel
}	from "../models/redux-models";
import ServerService from "../service/server-service";

export const	serverActions = serverSlice.actions;
import
{
	NIL as NILUUID,
	v4 as uuid4
}	from "uuid";

export const	setIsFetching = (value : boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ServerModel = {
			...previousState.server,
			isFetching: value,
		};
		dispatch(serverActions.setIsFetching(response));
	});
};

export const	resetConnexionAttempt = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			connexionAttempt: 0,
		};
		dispatch(serverActions.resetConnexionAttempt(response));
	});
};

export const	increaseConnectionAttempt = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	console.log("Connection attempt ");
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			connexionAttempt:
				(prevState.server.connexionAttempt >= 4)
				? prevState.server.connexionAttempt
				: prevState.server.connexionAttempt + 1,
		};
		dispatch(serverActions.increaseConnectionAttempt(response));
	});
};

export const	resetState = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch) =>
	{
		const	response: ServerModel = {
			isFetching: false,
			connexionEnabled: false,
			connexionAttempt: 0,
			error: false,
			message: "",
			serverActiveSince: "unknow",
			anonymousUser:
			{
				registrationStep: "undefined",
				uuid: NILUUID,
				creationDate: "undefined",
				password: "undefined",
				message: "",
				expireAt: -1,
				token: "no token"
			}
		};
		dispatch(serverActions.resetState(response));
	});
};

export const	setServerConnectionErr = (basicErrMsg: string, fullMsg: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	// console.log("Failure to connect to server ");
	// console.log("Basic err message : ", basicErrMsg);
	// console.log("Full message :", fullMsg);
	return (async (dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			isFetching: false,
			connexionEnabled: false,
			error: true,
			message: basicErrMsg + ": " + fullMsg
		};
		console.info("Response error", response);
		dispatch(serverActions.setServerConnectionError(response));
	});
};

export const	setServerConnectionSuccess = (activeSince: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			serverActiveSince: activeSince,
			connexionEnabled: true
		};
		console.log(response);
		dispatch(serverActions.setServerConnectionSuccess(response));
	});
};

export	const	getServerConnection = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	// eslint-disable-next-line max-statements
	return (async (dispatch, getState) =>
	{
		const	prevState = getState();
		const	server = prevState.server;

		// const	user = prevState.controller.user;

		const	data = await ServerService.getConnection();
		if (data.success === false)
		{
			// console.log("data tyes", data);
			dispatch(increaseConnectionAttempt());
			if (server.connexionAttempt < 3)
				setTimeout(() =>
				{
					dispatch(getServerConnection());
				}, 1000);
			else
				dispatch(
					setServerConnectionErr(data.errorMessage,
						data.fullError.message));
		}
		else
			dispatch(setServerConnectionSuccess(data.availableSince));
	});
};

export const	setAnonymousRegistrationStep = (step: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res : ServerModel = {
			...prevState.server,
			anonymousUser:
			{
				...prevState.server.anonymousUser,
				registrationStep: step
			}
		};
		dispatch(serverActions.setAnonymousRegistrationStep(res));
	});
};

export const	setAnonymousUuid = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();
		const	res: ServerModel = {
			...prev.server,
			anonymousUser:
			{
				...prev.server.anonymousUser,
				uuid: uuid4()
			}
		};
		dispatch(serverActions.setAnonymousUuid(res));
	});
};

export const	loginAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prevState = getState();
		const	uuid = prevState.server.anonymousUser.uuid;
		const	password = prevState.server.anonymousUser.password;

		const	data: AnonymousUserLoginResponseModel
			= await ServerService.loginAnonymousUser(uuid, password);
		if (data.statusCode === 200)
		{
			const response: ServerModel = {
				...prevState.server,
				anonymousUser:
				{
					...prevState.server.anonymousUser,
					message: data.message as string,
					expireAt: data.expireAt as number,
					token: data.token as string
				},
			};
			dispatch(serverActions.loginAnonymousUser(response));
			dispatch(setAnonymousRegistrationStep("Anonymous User Registred"));
		}
		else
		{
			const	error: ServerModel = {
				...prevState.server,
				error: true,
				message: "501 Not Implemented",
			};
			dispatch(serverActions.loginAnonymousUser(error));
			dispatch(setAnonymousRegistrationStep("error loggin"));
		}
	});
};

export const	registerAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	uuid = prev.server.anonymousUser.uuid;

		const	data: AnonymousUserRegisterResponseModel
			= await ServerService.register(uuid);
		if (data.statusCode === 200)
		{
			const	res: ServerModel = {
				...prev.server,
				anonymousUser:
				{
					...prev.server.anonymousUser,
					creationDate: data.creationDate as string,
					password: data.password as string,
					message: data.message as string
				}
			};
			dispatch(serverActions.registerAnomymousUser(res));
			dispatch(setAnonymousRegistrationStep("login"));
			dispatch(loginAnonymousUser());
		}
		else
		{
			const	error: ServerModel = {
				...prev.server,
				error: true,
				message: "501 Not Implemented"
			};
			dispatch(serverActions.registerAnomymousUser(error));
			dispatch(setAnonymousRegistrationStep("Register Anonymous Error"));
		}
	});
};

export const	createAnonymousSession = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server
		};
		if (prevState.server.anonymousUser.registrationStep === "register")
		{
			if (prevState.server.anonymousUser.uuid === NILUUID)
			{
				// register here
				console.log("user is NIL");
				dispatch(setAnonymousUuid());
				dispatch(registerAnonymousUser());
			}
			else
			{
				// login or clear, cause user already have an uuid
				// but seams to be an error, user are trigger without
				// normal procedure
				// (We are inside register, see display anonymous connect)
				console.error("UUID is " + prevState.server.anonymousUser.uuid);
			}
		}
		dispatch(serverActions.createAnonymousSession(response));
	});
};
