
import chatSlice from "./chat-slice";

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import
{
	ChatStateModel as Model
} from "../models/redux-models";

export const	actions = chatSlice.actions;

export	const	setActiveViewToolbar = (activeView: number)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	response: Model = {
			...prevState,
			toolbarActiveView: activeView
		};
		dispatch(actions.setActiveViewToolbar(response));
	});
};
