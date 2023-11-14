/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */

import
	anonymousUserSlice,
	{
		initialAnonymousUserState
	} from "./anonymousUser-slice";
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


export const	errorLoginAnonymousUser = (
	error: boolean,
	message: string,
	statusCode: number
): ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	res: Model = {
			...prevState.anonymousUser,
			error: error,
			errorMessage: message,
			errorStatusCode: statusCode
		};
		dispatch(action.errorLoginAnonymousUser(res));
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
			= await ServerService
				.loginAnonymousUser(
					uuid, password, prevState.server.uri);
		if (data.statusCode === 200)
		{
			const response: Model = {
				...prevState.anonymousUser,
				message: data.message as string,
				expireAt: data.expireAt as number,
				token: data.token as string
			};
			dispatch(action.loginAnonymousUser(response));
			dispatch(setAnonymousRegistrationStep("login-anonymous-success"));
		}
		else
		{
			dispatch(
				errorLoginAnonymousUser(
					true,
					"not implemented yet error login :"
						+ data.message as string,
					data.statusCode as number,
				)
			);
			console.error("Need to implement the properties: ");
		}
	});
};

export const	errorRegisterAnonymousUser = (
	error: boolean,
	message: string,
	statusCode: number
): ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	res: Model = {
			...prevState.anonymousUser,
			error: error,
			errorMessage: message,
			errorStatusCode: statusCode
		};
		dispatch(action.errorRegisterAnonymousUser(res));
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
			= await ServerService.register(uuid, prev.server.uri);
		if (data.statusCode === 200)
		{
			const	res: Model = {
				...prev.anonymousUser,
				creationDate: data.creationDate as string,
				password: data.password as string,
				message: data.message as string
			};
			dispatch(action.registerAnomymousUser(res));
			dispatch(
				setAnonymousRegistrationStep("register-anonymous-success")
			);
		}
		else
		{
			dispatch(
				errorLoginAnonymousUser(
					true,
					"not implemented yet error login :"
						+ data.message as string,
					data.statusCode as number,
				)
			);
			// console.error("Need to implement the properties: ");
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
				console.error("UUID is " + prevState.anonymousUser.uuid);
				console.error("Anonymous user is " + prevState.anonymousUser);
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

		const	token = prevState.anonymousUser.token;
		const	data = await ServerService
			.verifyTokenAnonymousUser(token, prevState.server.uri);
		if (data === "ERROR")
		{
			res = {
				...prevState.anonymousUser,
				message: "",
				expireAt: -1,
				token: "no token"
			};
			dispatch(action.verifyTokenAnonymousUser(res));
			dispatch(
				setAnonymousRegistrationStep("token-verification-failure"
			));
		}
		else
		{
			res = {...prevState.anonymousUser};
			dispatch(action.verifyTokenAnonymousUser(res));
			dispatch(
				setAnonymousRegistrationStep("token-verification-success")
			);
		}
	});
};

export const	clearTokenDataAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.anonymousUser,
			message: "",
			expireAt: -1,
			token: "no token"
		};
		dispatch(action.clearTokenDataAnonymousUser(res));
	});
};

export const	clearAllDataAnonymousUser = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch ) =>
	{
		const	res: Model = {
			...initialAnonymousUserState
		};
		dispatch(action.clearAllDataAnonymousUser(res));
	});
};
