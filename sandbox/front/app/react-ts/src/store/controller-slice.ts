
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControllerModel } from "../models/redux-models";

const	initialControllerState: ControllerModel = {
	activeView: "loading",
};

const	controllerSlice = createSlice(
{
	name: "controller",
	initialState: initialControllerState,
	reducers:
	{
		setActiveView(state, action:PayloadAction<ControllerModel>)
		{
			state.activeView = action.payload.activeView;
		}
	}
});

export default	controllerSlice;
