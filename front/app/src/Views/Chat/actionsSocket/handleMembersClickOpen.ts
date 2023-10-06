export const handleMembersClickOpen = (
	chanName: string,
	socketRef: React.MutableRefObject<any>
) =>
{
	const	action = {
		type: "member-list",
		payload: {
			chanName: chanName,
		}
	};
	socketRef.current.emit("channel-info", action);
};
