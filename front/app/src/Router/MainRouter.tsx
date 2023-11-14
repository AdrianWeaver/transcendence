/* eslint-disable max-statements */

import LoggedRouter from "./LoggedRouter";
import RegistrationRouter from "./RegistrationRouter";
import VisitorRouter from "./VisitorRouter";

import { useAppDispatch, useAppSelector } from "../Redux/hooks/redux-hooks";
import Configuration from "../Configuration";
import { setUri } from "../Redux/store/serverAction";

const	MainRouter: React.FC = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	dispatch = useAppDispatch();
	// const	config = new Configuration();

	// dispatch(setUri(config.getURI()));
	console.log("main router", controller);
	if (controller.user.isLoggedIn)
		return (<LoggedRouter />);
	else
	{
		if (controller.registration.startedRegister === true
			&& !controller.registration.abortRequested)
				return (<RegistrationRouter />);
		return (<VisitorRouter />);
	}
};

export default	MainRouter;
