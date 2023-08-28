/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */

import	anonymousUserSlice from "./anonymousUser-slice";
import	serverSlice from "./server-slice";

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";

import
{
	AnonymousUserLoginResponseModel,
	AnonymousUserRegisterResponseModel,
	AnonymousUserModel as Model,
	ServerModel
}	from "../models/redux-models";

import
{
	NIL as NILUUID,
	v4 as uuid4
}	from "uuid";
import ServerService from "../service/server-service";

export const	action = anonymousUserSlice.actions;
export const	serverActions = serverSlice.actions;

export const	setAnonymousRegistrationStep = (step: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res : Model = {
			...prevState.anonymousUser,
			registrationStep: step
		};
		dispatch(action.setAnonymousRegistrationStep(res));
	});
};

export const	setAnonymousUuid = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();
		const	res: Model = {
			...prev.anonymousUser,
				uuid: uuid4()
		};
		dispatch(action.setAnonymousUuid(res));
	});
};

export const	loginAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prevState = getState();
		const	uuid = prevState.anonymousUser.uuid;
		const	password = prevState.anonymousUser.password;

		const	data: AnonymousUserLoginResponseModel
			= await ServerService.loginAnonymousUser(uuid, password);
		if (data.statusCode === 200)
		{
			const response: Model = {
				...prevState.anonymousUser,
				message: data.message as string,
				expireAt: data.expireAt as number,
				token: data.token as string
			};
			dispatch(action.loginAnonymousUser(response));
			dispatch(setAnonymousRegistrationStep("Anonymous User Registred"));
		}
		else
		{
			const	error: ServerModel = {
				...prevState.server,
				error: true,
				message: "501 Not Implemented",
			};
			dispatch(serverActions.setErrorService(error));
			dispatch(setAnonymousRegistrationStep("error loggin"));
		}
	});
};

export const	registerAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	uuid = prev.anonymousUser.uuid;

		const	data: AnonymousUserRegisterResponseModel
			= await ServerService.register(uuid);
		if (data.statusCode === 200)
		{
			const	res: Model = {
				...prev.anonymousUser,
				creationDate: data.creationDate as string,
				password: data.password as string,
				message: data.message as string
			};
			dispatch(action.registerAnomymousUser(res));
			dispatch(setAnonymousRegistrationStep("login"));
			dispatch(loginAnonymousUser());
		}
		else
		{
			const	error: ServerModel = {
				...prev.server,
				error: true,
				message: "501 Not Implemented"
			};
			dispatch(serverActions.setErrorService(error));
			dispatch(setAnonymousRegistrationStep("Register Anonymous Error"));
		}
	});
};

export const	createAnonymousSession = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: Model = {
			...prevState.anonymousUser
		};
		if (prevState.anonymousUser.registrationStep === "register")
		{
			if (prevState.anonymousUser.uuid === NILUUID)
			{
				console.log("user is NIL");
				dispatch(setAnonymousUuid());
				dispatch(registerAnonymousUser());
			}
			else
			{
				// login or clear, cause user already have an uuid
				// but seams to be an error, user are trigger without
				// normal procedure
				// (We are inside register, see display anonymous connect)
				console.error("UUID is " + prevState.anonymousUser.uuid);
			}
		}
		dispatch(action.createAnonymousSession(response));
	});
};

export const	verifyTokenAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		let		res: Model;
		const	prevState = getState();


		dispatch(setAnonymousRegistrationStep("VerifyToken"));

		const	token = prevState.anonymousUser.token;
		const	data = await ServerService.verifyTokenAnonymousUser(token);
		console.log("Result of verify token : ", data);
		if (data === "ERROR")
		{
			res = {
				...prevState.anonymousUser,
				expireAt: -1,
				token: "no token"
			};
			console.log("Res befor dispatch", res);
			dispatch(action.verifyTokenAnonymousUser(res));
			dispatch(setAnonymousRegistrationStep("TokenVerificationFailure"));
			// set relog dispatcher 
		}
		else
		{
			dispatch(setAnonymousRegistrationStep("Anonymous User Registred"));
			res = {...prevState.anonymousUser};
			dispatch(action.verifyTokenAnonymousUser(res));
		}
		// dispatch(action.verifyTokenAnonymousUser(res));
	});
};
