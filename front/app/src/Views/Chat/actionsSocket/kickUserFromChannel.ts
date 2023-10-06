export const	kickUserFromChannel = (
	userName: string,
	chanName: string,
	socketRef: React.MutableRefObject<any>
	) =>
{
	const	action = {
		type: "kick-member",
		payload: {
			userName: userName,
			chanName: chanName,
		}
	};
	socketRef.current.emit("channel-info", action);
};
