/* eslint-disable max-statements */
import DisplayConnectionState from "./DisplayConnectionState";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import DisplayAnonymousConnection from "./DisplayAnonymousConnection";
// import DisplayAnonymousConnect from "./DisplayAnonymousConnect";

const	ConnectionState = () =>
{
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});

	const	renderConnectState = <DisplayConnectionState />;
	const	renderAnonymousConnect = <DisplayAnonymousConnection />;

	if (server.connexionEnabled === false)
		return (renderConnectState);
	else
		return (renderAnonymousConnect);
};

export default ConnectionState;
