import * as actionTypes from "../action/actionTypes";

const	initialState: ControllerState = {
	controller: {
		activeView: "Loading",
	}
};

const controllerReducer = (
	state: ControllerState = initialState,
	action: ControllerAction)
	: ControllerState =>
{
	console.log(action);
	switch (action.type)
	{
		case (actionTypes.CONTROLLER_SET_VIEW):
			return (
			{
				...state,
				// ...
				controller: {
					// ...state.controller  action.controller.activeView,
					activeView: action.controller.activeView,
				},
			});
		default:
			return (state);
	}
};

export
{
	controllerReducer
};
