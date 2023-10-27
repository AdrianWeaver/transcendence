/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */

import
{
	createSlice,
	PayloadAction
}	from "@reduxjs/toolkit";
import	{ ControllerModel } from "../models/redux-models";
// import	{ NIL as NILUUID } from "uuid";

const	initialControllerState: ControllerModel = {
	activeView: "loading",
	themeMode: "light",
	previousPage: "/",
	allUsers: [],
	allFrontUsers: [],
	user:
	{
		isLoggedIn: false,
		ftAvatar:
		{
			link: "https://thispersondoesnotexist.com/",
			version:
			{
				large: "undefined",
				medium: "undefined",
				small: "undefined",
				mini: "undefined"
			}
		},
		avatar: "https://thispersondoesnotexist.com/",
		registrationProcess: false,
		registrationError: "undefined",
		email: "",
		id: -1,
		username: "undefined",
		login: "undefined",
		firstName: "undefined",
		lastName: "undefined",
		bearerToken: "undefined",
		rememberMe: false,
		doubleAuth: false,
		codeValidated: false,
		otpCode: "undefined",
		phoneNumber: "undefined",
		registered: false,
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
				avatar: "https://thispersondoesnotexist.com/",
				password: "undefined",
			}
			],
			activeConversationId: "undefined",
			currentChannel: "undefined",
			chanMessages: [
				{
					username: "undefined",
					sender: "undefined",
					message: "undefined",
					mode: "undefined",
				}
			],
			kindOfConversation: "undefined",
			numberOfChannels: -1
		},
		profile: {
			editView: false,
			friendView: false,
			publicView: true,
			myView: false
		},
		password: "undefined",
		location: "undefined"
	},
	registration:
	{
		startedRegister: false,
		step: 0,
		codeOauthFT: "undefined",
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
		userRegistrationStepThree(state, action: PayloadAction<ControllerModel>)
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
			state.user.username = action.payload.user.username;
			state.user.chat.pseudo = action.payload.user.chat.pseudo;
			state.user.chat.users = action.payload.user.chat.users;
			state.allUsers = action.payload.allUsers;
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
		setKindOfConversation(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.kindOfConversation = action.payload.user.chat.kindOfConversation;
		},
		setNumberOfChannels(state, action: PayloadAction<ControllerModel>)
		{
			state.user.chat.numberOfChannels = action.payload.user.chat.numberOfChannels;
		},
		setUserData(state, action: PayloadAction<ControllerModel>)
		{
			state.user.id = action.payload.user.id;
			state.user.email = action.payload.user.email;
			state.user.bearerToken = action.payload.user.bearerToken;
			state.user.firstName = action.payload.user.firstName;
			state.user.lastName = action.payload.user.lastName;
			state.allUsers = action.payload.allUsers;
		},
		registerClientWithCode(state, action: PayloadAction<ControllerModel>)
		{
			state.user.id = action.payload.user.id;
			state.user.email = action.payload.user.email;
			state.user.bearerToken = action.payload.user.bearerToken;
			state.user.login = action.payload.user.username;
			state.user.username = action.payload.user.username;
			state.user.firstName = action.payload.user.firstName;
			state.user.lastName = action.payload.user.lastName;
			state.user.avatar = action.payload.user.avatar;
			state.allUsers = action.payload.allUsers;
		},
		registerNumberForDoubleAuth(state, action: PayloadAction<ControllerModel>)
		{
			state.user.phoneNumber = action.payload.user.phoneNumber;
			state.user.doubleAuth = action.payload.user.doubleAuth;
		},
		receiveValidationCode(state, action: PayloadAction<ControllerModel>)
		{
			state.user.phoneNumber = action.payload.user.phoneNumber;
		},
		getValidationCode(state, action: PayloadAction<ControllerModel>)
		{
			state.user.otpCode = action.payload.user.otpCode;
			state.user.codeValidated = action.payload.user.codeValidated;
		},
		setCodeValidated(state, action: PayloadAction<ControllerModel>)
		{
			state.user.codeValidated = action.payload.user.codeValidated;
		},
		setRegistrationProcessStart(state, action: PayloadAction<ControllerModel>)
		{
			state.user.registrationProcess = action.payload.user.registrationProcess;
			state.user.registrationError = action.payload.user.registrationError;
		},
		setRegistrationProcessSuccess(state, action: PayloadAction<ControllerModel>)
		{
			state.user.registrationProcess = action.payload.user.registrationProcess;
		},
		setRegistrationProcessError(state, action: PayloadAction<ControllerModel>)
		{
			state.user.registrationProcess = action.payload.user.registrationProcess;
			state.user.registrationError = action.payload.user.registrationError;
		},
		verifyToken(state, action: PayloadAction<ControllerModel>)
		{
			// state = action.payload
		},
		setDoubleAuth(state, action: PayloadAction<ControllerModel>)
		{
			state.user.doubleAuth = action.payload.user.doubleAuth;
		},
		setPhoneNumber(state, action: PayloadAction<ControllerModel>)
		{
			state.user.phoneNumber = action.payload.user.phoneNumber;
		},
		setRegistered(state, action: PayloadAction<ControllerModel>)
		{
			state.user.registered = action.payload.user.registered;
		},
		reinitialiseUser(state)
		// , action: PayloadAction<ControllerModel>)
		{
			state.registration = initialControllerState.registration;
			state.user = initialControllerState.user;
			// state.user.login = action.payload.user.login;
			// state.user.bearerToken = action.payload.user.bearerToken;
			// state.user.doubleAuth = action.payload.user.doubleAuth;
			// state.user.email = action.payload.user.email;
			// state.user.firstName = action.payload.user.firstName;
			// state.user.lastName = action.payload.user.lastName;
			// state.user.id = action.payload.user.id;
			// state.user.isLoggedIn = action.payload.user.isLoggedIn;
			// state.user.phoneNumber = action.payload.user.phoneNumber;
			// state.user.registered = action.payload.user.registered;
			// state.user.username = action.payload.user.username;
			// state.user.registrationProcess = action.payload.user.registrationProcess;
			// state.user.registrationError = action.payload.user.registrationError;
			// state.user.rememberMe = action.payload.user.rememberMe;
			// state.user.avatar = action.payload.user.avatar;
			// state.user.chat.pseudo = action.payload.user.chat.pseudo;
			// state.user.password = action.payload.user.password;
			// state.user.profile = action.payload.user.profile;
			// state.user.ftAvatar = action.payload.user.ftAvatar;
			// state.user.otpCode = action.payload.user.otpCode;
			// state.user.codeValidated = action.payload.user.codeValidated;
		},
		setAvatar(state, action: PayloadAction<ControllerModel>)
		{
			state.user.avatar = action.payload.user.avatar;
			state.user.ftAvatar = action.payload.user.ftAvatar;
			state.allUsers = action.payload.allUsers;
		},
		setProfileEditView(state, action: PayloadAction<ControllerModel>)
		{
			state.user.profile.editView = action.payload.user.profile.editView;
			state.user.profile.friendView = action.payload.user.profile.friendView;
			state.user.profile.publicView = action.payload.user.profile.publicView;
			state.user.profile.myView = action.payload.user.profile.myView;
		},
		setProfilePublicView(state, action: PayloadAction<ControllerModel>)
		{
			state.user.profile.editView = action.payload.user.profile.editView;
			state.user.profile.friendView = action.payload.user.profile.friendView;
			state.user.profile.publicView = action.payload.user.profile.publicView;
			state.user.profile.myView = action.payload.user.profile.myView;
		},
		setProfileFriendView(state, action: PayloadAction<ControllerModel>)
		{
			state.user.profile.editView = action.payload.user.profile.editView;
			state.user.profile.friendView = action.payload.user.profile.friendView;
			state.user.profile.publicView = action.payload.user.profile.publicView;
			state.user.profile.myView = action.payload.user.profile.myView;
		},
		setProfileMyView(state, action: PayloadAction<ControllerModel>)
		{
			state.user.profile.editView = action.payload.user.profile.editView;
			state.user.profile.friendView = action.payload.user.profile.friendView;
			state.user.profile.publicView = action.payload.user.profile.publicView;
			state.user.profile.myView = action.payload.user.profile.myView;
		},
		setPassword(state, action: PayloadAction<ControllerModel>)
		{
			state.user.password = action.payload.user.password;
		},
		setEmail(state, action: PayloadAction<ControllerModel>)
		{
			state.user.email = action.payload.user.email;
			state.allUsers = action.payload.allUsers;
		},
		setLogin(state, action: PayloadAction<ControllerModel>)
		{
			state.user.login = action.payload.user.login;
		},
		setAllUsers(state, action: PayloadAction<ControllerModel>)
		{
			state.allUsers = action.payload.allUsers;
		},
		registerInfosInBack(state, action: PayloadAction<ControllerModel>)
		{
			state.allUsers = action.payload.allUsers;
		},
		setNewToken(state, action: PayloadAction<ControllerModel>)
		{
			state.user.bearerToken = action.payload.user.bearerToken;
			state.user.isLoggedIn = action.payload.user.isLoggedIn;
			state.user.login = action.payload.user.login;
			state.user.username = action.payload.user.username;
			state.user.id = action.payload.user.id;
			state.user.email = action.payload.user.email;
			state.user.firstName = action.payload.user.firstName;
			state.user.lastName = action.payload.user.lastName;
			state.user.phoneNumber = action.payload.user.phoneNumber;
			state.user.registered = action.payload.user.registered;
			state.user.avatar = action.payload.user.avatar;
			state.user.ftAvatar = action.payload.user.ftAvatar;
			state.user.password = action.payload.user.password;
		},
		addUser(state, action: PayloadAction<ControllerModel>)
		{
			state.allFrontUsers = action.payload.allFrontUsers;
		},
	}
});

export default	controllerSlice;
