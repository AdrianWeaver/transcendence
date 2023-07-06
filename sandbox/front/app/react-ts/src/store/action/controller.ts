
import * as actionTypes from "./actionTypes";

export const	setView = (viewName : IController) =>
{
	const	action: ControllerAction
	= {
		type: actionTypes.CONTROLLER_SET_VIEW,
		controller: viewName,
	};
	return (action);
};
