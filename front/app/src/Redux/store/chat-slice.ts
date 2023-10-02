
import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import { ChatStateModel as Model} from "../models/redux-models";

export const	initialChatState: Model = {
	toolbarActiveView: 0,
};

const	chatSlice = createSlice(
{
	name: "chat",
	initialState: initialChatState,
	reducers:
	{
		setActiveViewToolbar(state, action: PayloadAction<ServerModel>)
		{
			state.toolbarActiveView = action.payload.toolbarActiveView;
		}
	},
});

export default chatSlice;
