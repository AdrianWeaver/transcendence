
import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import { ServerModel } from "../models/redux-models";

export const	initialServerState: ServerModel = {
	isFetching: true,
	connexionEnabled: false,
	connexionAttempt: 0,
	error: false,
	message: ""
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
		}
	}
});

export default serverSlice;
