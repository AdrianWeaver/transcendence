/* eslint-disable max-statements */
import DisplayConnectionState from "./DisplayConnectionState";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import DisplayAnonymousConnect from "./DisplayAnonymousConnect";

const	ConnectionState = () =>
{
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	const	renderConnectState = <DisplayConnectionState />;
	const	renderAnonymousConnect = <DisplayAnonymousConnect />;

	if (server.connexionEnabled === false)
		return (renderConnectState);
	else
		return (renderAnonymousConnect);
};

export default ConnectionState;
