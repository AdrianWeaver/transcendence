export const	leaveChannel = (
	chanName: string,
	socketRef: React.MutableRefObject<any>
	) =>
{
	const	action = {
		type: "leave-channel",
		payload: {
			chanName: chanName,
		}
	};
	socketRef.current.emit("channel-info", action);
};
