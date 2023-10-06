
export const	muteUserInChannel = (
	userName: string,
	chanName: string,
	socketRef: React.MutableRefObject<any>) =>
{
	const	action = {
		type: "mute-user",
		payload: {
			chanName: chanName,
			userName: userName,
		}
	};
	socketRef.current.emit("user-info", action);
};
