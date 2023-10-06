/* eslint-disable max-params */
export const	createNewChannel = (
	socketRef: React.MutableRefObject<any>,
	channelName: string,
	selectedMode: string,
	chanPassword: string,
	channels: never[],
	privateMessage: never[],
	activeId: string,
	kindOfConversation: string
) =>
{
	const action = {
		type: "create-channel",
		payload: {
			chanName: channelName,
			chanMode: selectedMode,
			chanPassword: chanPassword,
			chanId: channels.length + 1,
			pmIndex: privateMessage.length + 1,
			activeId: activeId,
			kind: kindOfConversation
		}
	};
	socketRef.current?.emit("channel-info", action);
};
