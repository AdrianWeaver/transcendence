/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import	serverSlice from "./server-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import
{
	ServerModel
}	from "../models/redux-models";
import ServerService from "../service/server-service";

export const	serverActions = serverSlice.actions;

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
			serverActiveSince: "unknow"
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
		// console.log(response);
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

export	const	setErrorService = (server: ServerModel)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch) =>
	{
		dispatch(setErrorService(server));
	});
};
