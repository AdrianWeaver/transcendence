export const handleSendClick = (
	socketRef: React.MutableRefObject<any>,
	currentChannel: string,
	text: string
) =>
{
	const action = {
		type: "sent-message",
		payload: {
			chanName: currentChannel,
			message: text,
		}
	};
	socketRef.current.emit("info", action);
};
