/* eslint-disable max-statements */
/* eslint-disable max-len */

import
{
	createSlice,
	PayloadAction
}	from "@reduxjs/toolkit";
import	{ ControllerModel } from "../models/redux-models";
import	{ NIL as NILUUID } from "uuid";

const	initialControllerState: ControllerModel = {
	activeView: "loading",
	themeMode: "light",
	previousPage: "/",
	user:
	{
		isLoggedIn: true,
		username: "undefined",
		bearerToken: "undefined",
		rememberMe: false,
		chat:
		{
			window:
			{
				bigWindow: false,
				hiddenWindow: false,
				miniWindow: true,
			},
			pseudo: "undefined",
			connected: false,
			users:
			[
			{
				name: "undefined",
				id: "undefined",
				avatar: "undefined",
				msgRoom: [
				{
					id: "undefined",
					roomName: "undefined",
					privateConv: true,
					content: [
						{
							sender: "undefined",
							message: "undefined",
							date: "undefined"
						}
					]
				}
				]
			}
			],
			activeConversationId: "undefined",
			currentChannel: "undefined",
			chanMessages: [
				{
					sender: "undefined",
					message: "undefined",
					mode: "undefined",
				}
			]
		},
	},
	registration:
	{
		startedRegister: false,
		step: 0,
		codeOauthFT: "unsetted",
		abortRequested: false,
		requestHomeLink: false
	},
	canvas:
	{
		height: window.innerHeight,
		width: window.innerWidth
	},

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
		},
		setCanvasSize(state, action: PayloadAction<ControllerModel>)
		{
			state.canvas = action.payload.canvas;
		},
		setAbortRequestedValue(state, action: PayloadAction<ControllerModel>)
		{
			state.registration.abortRequested
				= action.payload.registration.abortRequested;
		},
		resetRegistration(state)
		{
			state.registration = initialControllerState.registration;
		},
		setPreviousPage(state, action: PayloadAction<ControllerModel>)
		{
			state.previousPage = action.payload.previousPage;
		},
		setRequestHomeLink(state, action: PayloadAction<ControllerModel>)
		{
			state.registration.requestHomeLink
				= action.payload.registration.requestHomeLink;
		},
		setBigWindow(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.window = action.payload.user.chat.window;
		},
		setMiniWindow(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.window = action.payload.user.chat.window;
		},
		setHiddenWindow(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.window = action.payload.user.chat.window;
		},
		setPseudo(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.pseudo = action.payload.user.chat.pseudo;
		},
		setChatConnected(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.connected = action.payload.user.chat.connected;
		},
		setChatUsers(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.users = action.payload.user.chat.users;
		},
		setActiveConversationId(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.activeConversationId = action.payload.user.chat.activeConversationId;
		},
		setCurrentChannel(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.currentChannel = action.payload.user.chat.currentChannel;
		},
		setMessageRoom(state, action: PayloadAction<ControllerModel>)
		{
			let	i;

			i = 0;
			while (state.user.chat.users.length - 1)
			{
				state.user.chat.users[i].msgRoom = action.payload.user.chat.users[i].msgRoom;
				i++;
			}
		},
		setMessage(state, action: PayloadAction<ControllerModel>)
		{
			let	i;
			let	j;

			i = 0;
			while (state.user.chat.users.length - 1)
			{
				j = 0;
				while (state.user.chat.users[i].msgRoom.length - 1)
				{
					state.user.chat.users[i].msgRoom[j] = action.payload.user.chat.users[i].msgRoom[j];
					j++;
				}
				i++;
			}
		},
		addMessage(state, action: PayloadAction<ControllerModel>)
		{
			let	i;
			let	j;

			i = 0;
			while (state.user.chat.users.length - 1)
			{
				j = 0;
				while (state.user.chat.users[i].msgRoom.length - 1)
				{
					state.user.chat.users[i].msgRoom[j].content = action.payload.user.chat.users[i].msgRoom[j].content;
					j++;
				}
				i++;
			}
		}
	}
});

export default	controllerSlice;
