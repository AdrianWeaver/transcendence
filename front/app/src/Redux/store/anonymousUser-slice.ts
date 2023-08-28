
import
{
	PayloadAction,
	createSlice,
}	from "@reduxjs/toolkit";

import	{ AnonymousUserModel as Model } from "../models/redux-models";

import	{ NIL as NILUUID} from "uuid";

export const	initialAnonymousUserState: Model = {
	registrationStep: "undefined",
	uuid: NILUUID,
	creationDate: "undefined",
	password: "undefined",
	message: "",
	expireAt: -1,
	token: "no token"
};

const anonymousUserSlice = createSlice(
{
	name: "anonymousUser",
	initialState: initialAnonymousUserState,
	reducers:
	{
		setAnonymousRegistrationStep(state, action: PayloadAction<Model>)
		{
			state.registrationStep
				= action.payload.registrationStep;
		},
		setAnonymousUuid(state, action: PayloadAction<Model>)
		{
			state.uuid = action.payload.uuid;
		},
		createAnonymousSession(state, action: PayloadAction<Model>)
		{
			state = action.payload;
			// state = 
		},
		registerAnomymousUser(state, action: PayloadAction<Model>)
		{
			// state = action.payload;
			state.creationDate = action.payload.creationDate;
			state.password = action.payload.password;
			state.message = action.payload.message;
		},
		loginAnonymousUser(state, action: PayloadAction<Model>)
		{
			// state = action.payload;
			state.message = action.payload.message;
			state.expireAt = action.payload.expireAt;
			state.token = action.payload.token;
		},
		verifyTokenAnonymousUser(state, action: PayloadAction<Model>)
		{
			state.expireAt = action.payload.expireAt;
			state.token = action.payload.token;
		}
	}
});

export default anonymousUserSlice;
