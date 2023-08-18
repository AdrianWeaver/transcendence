/* eslint-disable max-lines-per-function */

import	serverSlice from "./server-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import { ServerModel } from "../models/redux-models";
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
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			connexionAttempt: prevState.server.connexionAttempt + 1,
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
			message: ""
		};
		dispatch(serverActions.resetState(response));
	});
};

// if server.isFetching === true
// 		we reset and make a new serverConnection.
// else
// 		we dont dispach
export	const	getServerConnection = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	// eslint-disable-next-line max-statements
	return (async (dispatch, getState) =>
	{
		const	prevState = getState();
		console.log("prevState: ", prevState);

		const	server = prevState.server;
		console.log("previous Server: ", server);

		const	user = prevState.controller.user;
		console.log("Previous user: ", user);

		if (server.isFetching === true)
			resetState();
		else
			return ;
		// if (prevState.server.error)
		// {
		// 	console.log("Prevent always call to api");
		// 	const	response: ServerModel = {
		// 		...prevState.server
		// 	};
		// 	dispatch(serverActions.getServerConnection(response));
		// }
		// if (prevState.server.connexionAttempt > 3)
		// {
		// 	const response: ServerModel = {
		// 		...prevState.server,
		// 		error: true,
		// 		message: "Connexion is lost with the backend"
		// 		+ " check your internet connextion"
		// 	};
		// 	dispatch(serverActions.getServerConnection(response));
		// }
		// else
		// {
		const	data = await ServerService.getConnection();

		console.log("DATA: ", data);
		if (data.success === false)
		{
			const response: ServerModel = {
				...prevState.server,
				connexionAttempt: prevState.server.connexionAttempt + 1,
			};
			// dispatch(serverActions.getServerConnection(response));
		}
		else
		{
			const response: ServerModel = {
				...prevState.server,
				error: false,
				message: "Successfully call the server",
				connexionAttempt: 0,
				connexionEnabled: true
			};
			// dispatch(serverActions.getServerConnection(response));
		}
		// }
	});
};
