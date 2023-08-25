/* eslint-disable max-statements */

import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import { ServerModel } from "../models/redux-models";
import	{ NIL as NILUUID } from "uuid";

export const	initialServerState: ServerModel = {
	isFetching: true,
	connexionEnabled: false,
	serverActiveSince: "unknow",
	connexionAttempt: 0,
	error: false,
	message: "",
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
		setAnonymousRegistrationStep(state, action: PayloadAction<ServerModel>)
		{
			state.anonymousUser.registrationStep
				= action.payload.anonymousUser.registrationStep;
		},
		createAnonymousSession(state, action: PayloadAction<ServerModel>)
		{
			state = action.payload;
		},
		setAnonymousUuid(state, action: PayloadAction<ServerModel>)
		{
			state.anonymousUser.uuid = action.payload.anonymousUser.uuid;
		},
		registerAnomymousUser(state, action: PayloadAction<ServerModel>)
		{
			state.anonymousUser = action.payload.anonymousUser;
		},
		loginAnonymousUser(state, action: PayloadAction<ServerModel>)
		{
			state.anonymousUser = action.payload.anonymousUser;
		}
	}
});

export default serverSlice;
