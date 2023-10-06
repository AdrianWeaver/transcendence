export const	banUserFromChannel = (
	userName: string,
	chanName: string,
	socketRef: React.MutableRefObject<any>) =>
{
	const	action = {
		type: "ban-member",
		payload: {
			userName: userName,
			chanName: chanName,
		}
	};
	socketRef.current.emit("channel-info", action);
};
