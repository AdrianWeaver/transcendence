export const	makeAdmin = (
	userName: string,
	chanName: string,
	socketRef: React.MutableRefObject<any>) =>
{
	const	action = {
		type: "make-admin",
		payload: {
			userName: userName,
			chanName: chanName,
		}
	};
	socketRef.current.emit("user-info", action);
};
