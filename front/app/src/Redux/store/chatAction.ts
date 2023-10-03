
import chatSlice from "./chat-slice";

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import
{
	ChatStateModel as Model
} from "../models/redux-models";
import { Socket } from "socket.io-client";

export const	actions = chatSlice.actions;

export	const	setActiveViewToolbar = (activeView: number)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	response: Model = {
			...prevState.chat,
			toolbarActiveView: activeView
		};
		dispatch(actions.setActiveViewToolbar(response));
	});
};

export	const	setSocket = (socket : Socket)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: Model = {
			...prevState.chat,
			socket: socket,
		};
		dispatch(actions.setSocket(response));
	});
};


export	const	clearSocket = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch) =>
	{
		dispatch(actions.clearSocket());
	});
};
