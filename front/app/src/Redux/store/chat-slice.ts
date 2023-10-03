
import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import { ChatStateModel as Model} from "../models/redux-models";

export const	initialChatState: Model = {
	toolbarActiveView: 0,
	socket: null
};

const	chatSlice = createSlice(
{
	name: "chat",
	initialState: initialChatState,
	reducers:
	{
		setActiveViewToolbar(state, action: PayloadAction<Model>)
		{
			state.toolbarActiveView = action.payload.toolbarActiveView;
		},
		// fix type in socket 
		setSocket(state, action: PayloadAction<Model>)
		{
			state.socket = action.payload.socket;
		},
		clearSocket(state)
		{
			state.socket = null;
		}

	},
});

export default chatSlice;
