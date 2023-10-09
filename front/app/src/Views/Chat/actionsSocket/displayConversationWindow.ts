export const displayConversationWindow = (
	id: string,
	numberOfChannels: number,
	socketRef: React.MutableRefObject<any>) =>
{
	const action = {
		type: "display-conversation",
		payload:
		{
			id: id,
			index: numberOfChannels + 1
		}
	};
	socketRef.current?.emit("display-conversation", action);
};
