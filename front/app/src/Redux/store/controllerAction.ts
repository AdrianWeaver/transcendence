// eslint-disable-next-line max-len
// https://itnext.io/build-a-react-redux-with-typescript-using-redux-toolkit-package-d17337aa6e39
import controllerSlice from "./controller-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";
import { CanvasModel, ControllerModel } from "../models/redux-models";

export const	controllerActions = controllerSlice.actions;

export const	setActiveView = (activeView: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	reponse: ControllerModel = {
			...previousState.controller,
			activeView: activeView,
		};
		dispatch(controllerActions.setActiveView(reponse));
	});
};

export const	setThemeModeToLight = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			themeMode: "light"
		};
		dispatch(controllerActions.setThemeModeToLight(response));
	});
};

export const	setThemeModeToDark = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			themeMode: "dark"
		};
		dispatch(controllerActions.setThemeModeToDark(response));
	});
};

export const	setUserLoggedIn = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			user:
			{
				...previousState.controller.user,
				isLoggedIn: true,
			}
		};
		dispatch(controllerActions.setUserLoggedIn(response));
	});
};

export const	logOffUser = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			user:
			{
				...previousState.controller.user,
				isLoggedIn: false,
			}
		};
		dispatch(controllerActions.logOffUser(response));
	});
};

export const	userRequestRegistration = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			registration:
			{
				...previousState.controller.registration,
				startedRegister: true
			}
		};
		dispatch(controllerActions.userRequestRegistration(response));
	});
};

export const	userRegistrationStepTwo = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			registration:
			{
				...previousState.controller.registration,
				step: 1,
			}
		};
		dispatch(controllerActions.userRegistrationStepTwo(response));
	});
};

export const	setCanvasSize = (size: CanvasModel)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			canvas: size
		};
		dispatch(controllerActions.setCanvasSize(response));
	});
};

export const	setAbortRequestedValue = (value: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	reponse: ControllerModel = {
			...prevState.controller,
			registration:
			{
				...prevState.controller.registration,
				abortRequested: value
			}
		};
		dispatch(controllerActions.setAbortRequestedValue(reponse));
	});
};

export const	resetRegistration = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		if (prevState.controller.registration.startedRegister === true)
			dispatch(controllerActions.resetRegistration());
	});
};

export const	setPreviousPage = (pageToSave : string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		let		response: ControllerModel;

		if (prevState.controller.previousPage === pageToSave)
			return ;
		else
			response = {
				...prevState.controller,
				previousPage: pageToSave,
			};
		dispatch(controllerActions.setPreviousPage(response));
	});
};

export const	setRequestHomeLink = (value: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			registration:
			{
				...prevState.controller.registration,
				requestHomeLink: value
			}
		};
		dispatch(controllerActions.setRequestHomeLink(response));
	});
};

export const setBigWindow = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					window:
					{
						bigWindow: true,
						hiddenWindow: false,
						miniWindow: false
					}
				}
			}
		};
		dispatch(controllerActions.setBigWindow(response));
	});
}