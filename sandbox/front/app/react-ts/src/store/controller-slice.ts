
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControllerModel } from "../models/redux-models";

const	initialControllerState: ControllerModel = {
	activeView: "loading",
	themeMode: "dark",
	user:
	{
		isLoggedIn: false,
		username: "undefined",
		bearerToken: "undefined",
		rememberMe: false,
	},
	registration:
	{
		startedRegister: false,
		step: 0,
		codeOauthFT: "unsetted",
		// need to purge data if abort set to 
		abortRequested: false
	}
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
		},
		setUserLoggedIn(state, action: PayloadAction<ControllerModel>)
		{
			state.user.isLoggedIn = action.payload.user.isLoggedIn;
		},
		logOffUser(state, action: PayloadAction<ControllerModel>)
		{
			state.user.isLoggedIn = action.payload.user.isLoggedIn;
		},
		userRequestRegistration(state, action: PayloadAction<ControllerModel>)
		{
			state.registration.startedRegister
				= action.payload.registration.startedRegister;
		},
		userRegistrationStepTwo(state, action: PayloadAction<ControllerModel>)
		{
			state.registration.step = action.payload.registration.step;
		}
	}
});

export default	controllerSlice;
