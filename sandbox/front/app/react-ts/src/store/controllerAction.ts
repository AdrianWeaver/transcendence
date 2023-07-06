// eslint-disable-next-line max-len
// https://itnext.io/build-a-react-redux-with-typescript-using-redux-toolkit-package-d17337aa6e39
import controllerSlice from "./controller-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";
import { ControllerModel } from "../models/redux-models";

export const	controllerActions = controllerSlice.actions;

export const	setActiveView = (activeView: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch) =>
	{
		const	reponse: ControllerModel = {
			activeView: activeView
		};
		dispatch(controllerActions.setActiveView(reponse));
	});
};
