
/* eslint-disable max-statements */
import LoggedRouter from "./LoggedRouter";
import RegistrationRouter from "./RegistrationRouter";
import VisitorRouter from "./VisitorRouter";

import { useAppSelector } from "../Redux/hooks/redux-hooks";

const	MainRouter: React.FC = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});

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
