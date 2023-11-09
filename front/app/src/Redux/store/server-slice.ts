/* eslint-disable max-statements */

import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import { ServerModel } from "../models/redux-models";

export const	initialServerState: ServerModel = {
	isFetching: true,
	connexionEnabled: false,
	serverActiveSince: "unknow",
	connexionAttempt: 0,
	error: false,
	message: "",
	// localhost 
	serverLocation: "http://made-f0br4s4.clusters.42paris.fr/",
	links: {
		authApiUrl: "undefined",
	},
	uri: "undefined"
};

const	serverSlice = createSlice(
{
	name: "server",
	initialState: initialServerState,
	reducers:
	{
		setIsFetching(state, action: PayloadAction<ServerModel>)
		{
			state.isFetching = action.payload.isFetching;
		},
		resetConnexionAttempt(state, action: PayloadAction<ServerModel>)
		{
			state.connexionAttempt = action.payload.connexionAttempt;
		},
		getServerConnection(state, action: PayloadAction<ServerModel>)
		{
			state = action.payload;
		},
		increaseConnectionAttempt(state, action: PayloadAction<ServerModel>)
		{
			state.connexionAttempt = action.payload.connexionAttempt;
		},
		resetState(state, action: PayloadAction<ServerModel>)
		{
			state = action.payload;
		},
		setServerConnectionError(state, action: PayloadAction<ServerModel>)
		{
			state.error = action.payload.error;
			state.connexionEnabled = action.payload.connexionEnabled;
			state.error = action.payload.error;
			state.message = action.payload.message;
			state.serverActiveSince = action.payload.serverActiveSince;
		},
		setServerConnectionSuccess(state, action: PayloadAction<ServerModel>)
		{
			state.connexionEnabled = action.payload.connexionEnabled;
			state.serverActiveSince = action.payload.serverActiveSince;
			state.error = action.payload.error;
			state.connexionAttempt = action.payload.connexionAttempt;
			state.message = action.payload.message;
			state.isFetching = action.payload.isFetching;
		},
		setErrorService(state, action: PayloadAction<ServerModel>)
		{
			state.error = action.payload.error;
			state.message = action.payload.message;
		},
		setServerLocation(state, action: PayloadAction<ServerModel>)
		{
			state.serverLocation = action.payload.serverLocation;
			state.uri = action.payload.uri;
		},
		setAuthApiLinks(state, action: PayloadAction<ServerModel>)
		{
			state.links.authApiUrl = action.payload.links.authApiUrl;
		},
	}
});

export default serverSlice;
