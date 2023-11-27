/* eslint-disable max-statements */

import LoggedRouter from "./LoggedRouter";
import RegistrationRouter from "./RegistrationRouter";
import VisitorRouter from "./VisitorRouter";

import { useAppSelector } from "../Redux/hooks/redux-hooks";
import { useEffect, useState } from "react";

const	MainRouter: React.FC = () =>
{
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});

	const
	[
		routerSwitch,
		setRouterSwitch
	] = useState(<VisitorRouter />);

	useEffect(() =>
	{
		if (controller.user.isLoggedIn)
		{
			setRouterSwitch(<LoggedRouter />);
		}
		else
		{
			if (controller.registration.startedRegister === true
				&& !controller.registration.abortRequested)
				setRouterSwitch(<RegistrationRouter />);
			else
				setRouterSwitch(<VisitorRouter />);
		}
		return (() =>
		{
			setRouterSwitch(<></>);
		});
	}, [
		controller.user.isLoggedIn,
		controller.registration.startedRegister,
		controller.registration.abortRequested
	]);

	return (routerSwitch)
};

export default	MainRouter;
