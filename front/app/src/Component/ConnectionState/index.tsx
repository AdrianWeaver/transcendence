/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */
// import DisplayConnectionState from "./DisplayConnectionState";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
// import DisplayAnonymousConnection from "./DisplayAnonymousConnection";
import { useEffect, useState } from "react";
import ServiceChecker from "./ServiceChecker";
import SessionUserVerificator from "./SessionUserVerificator";
import AnonymmousUserSessionVerificator
	from "./AnonymousUserSessionVerificator";
// import DisplayAnonymousConnect from "./DisplayAnonymousConnect";

const	ConnectionState = () =>
{
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const
	[
		render,
		setRender
	]	= useState(<></>);

	useEffect(() =>
	{
		// check connection to server
		if (server.connexionEnabled === false)
		{
			setTimeout(() =>
			{
				setRender(<ServiceChecker />);
			}, 200);
		}
		else
		{
			// timemout for display info
			if (user.isLoggedIn && user.registrationProcess === false)
			{
				setTimeout(() =>
				{
					setRender(<SessionUserVerificator />);
				}, 1000);
			}
			else
			{
				setTimeout(() =>
				{
					setRender(<AnonymmousUserSessionVerificator />);
				}, 1000);
			}
		}
	},
	[
		render,
		server.connexionEnabled,
		user.isLoggedIn
	]);
	// const	renderConnectState = <DisplayConnectionState />;
	// const	renderAnonymousConnect = <DisplayAnonymousConnection />;

	// if (server.connexionEnabled === false)
	// 	return (renderConnectState);
	// else
	// 	return (renderAnonymousConnect);
	return (render);
};

export default ConnectionState;
