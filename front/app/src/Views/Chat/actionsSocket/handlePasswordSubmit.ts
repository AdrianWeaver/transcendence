export const handlePasswordSubmit = (
	password: string,
	socketRef: React.MutableRefObject<any>,
	joiningChannelName: string) =>
{
	const	action = {
		type: "password-for-protected",
		payload: {
			password: password,
			chanName: joiningChannelName,
		}
	};
	socketRef.current.emit("channel-info", action);
};
