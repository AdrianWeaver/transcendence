
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControllerModel } from "../models/redux-models";

const	initialControllerState: ControllerModel = {
	activeView: "loading",
	themeMode: "dark"
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
		},
		setThemeModeToLight(state, action:PayloadAction<ControllerModel>)
		{
			state.themeMode = action.payload.themeMode;
		},
		setThemeModeToDark(state, action:PayloadAction<ControllerModel>)
		{
			state.themeMode = action.payload.themeMode;
		}
	}
});

export default	controllerSlice;
