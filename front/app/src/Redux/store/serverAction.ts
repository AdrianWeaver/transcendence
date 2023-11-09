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
import Configuration from "../../Configuration";

export const	serverActions = serverSlice.actions;

export const	setIsFetching = (value : boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		console.log("Set is fetching value : ", previousState);
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
	return ((dispatch, getState) =>
	{
		const prev = getState();
		const	response: ServerModel = {
			...prev.server,
			isFetching: false,
			connexionEnabled: false,
			connexionAttempt: 0,
			error: false,
			message: "",
			serverActiveSince: "unknow",
			links: {
				authApiUrl: "undefined",
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

export const	setServerConnectionSuccess = (
	activeSince: string, links: {authApiUrl: string})
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ServerModel = {
			...prevState.server,
			serverActiveSince: activeSince,
			connexionEnabled: true,
			links: {
				authApiUrl: links.authApiUrl
			}
		};
		// console.log(response);
		dispatch(serverActions.setServerConnectionSuccess(response));
		dispatch(serverActions.setAuthApiLinks(response));
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

		const	data = await ServerService
			.getConnection(prevState.server.uri);
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
		{
			console.log("Flag response server-status: ", data.links.authApiUrl);
			dispatch(
				setServerConnectionSuccess(data.availableSince, data.links)
			);
		}
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

export const	setServerLocation = (protocole: string, locationServer: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	response: ServerModel = {
			...prevState.server,
			serverLocation: locationServer,
			uri: protocole + "//" + locationServer
		};
		dispatch(serverActions.setServerLocation(response));
	});
};

export const	setAuthApiLinks = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const prev = getState();

		const	data = await ServerService
		.getAuthApiLinks(prev.server.uri);
		if (data.success === true)
		{
			console.log("Action reducer data set auth links: ", data);
			const	response: ServerModel = {
				...prev.server,
				links: {
					...prev.server.links,
					authApiUrl: data
				}
			};
			dispatch(serverActions.setAuthApiLinks(response));
		}
		else
		{
			console.log("Set auth links fails");
			dispatch(serverActions.setAuthApiLinks({...prev.server}));
		}
	});
};

export const	setUri = (uri: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const prev = getState();
			console.log("setUri: ", uri);
			const	response: ServerModel = {
				...prev.server,
				uri: uri
			};
			dispatch(serverActions.setUri(response));
	});
};
