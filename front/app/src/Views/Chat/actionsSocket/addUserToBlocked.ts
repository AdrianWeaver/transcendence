export const	addUserToBlocked = (
	userName: string,
	socketRef: React.MutableRefObject<any>) =>
{
	const	action = {
		type: "block-user",
		payload: {
			blockedName: userName,
		}
	};
	socketRef.current.emit("user-info", action);
};
