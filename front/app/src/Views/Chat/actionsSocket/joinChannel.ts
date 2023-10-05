export const	joinChannel = (
	chanName: string,
	socketRef: React.MutableRefObject<any>,
	activeId: string,
	kindOfConversation: string) =>
{
	const	action = {
		type: "asked-join",
		payload: {
			chanName: chanName,
			activeId: activeId,
			kind: kindOfConversation
		}
	};
	socketRef.current.emit("channel-info", action);
};
