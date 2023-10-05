export const	removeChannel = (
	chanId: number,
	chanName: string,
	socketRef: React.MutableRefObject<any>,
	kindOfConversation: string) =>
{
	const	action = {
		type: "destroy-channel",
		payload: {
			name: chanName,
			id: chanId,
			kind: kindOfConversation
		}
	};
	socketRef.current?.emit("channel-info", action);
};
