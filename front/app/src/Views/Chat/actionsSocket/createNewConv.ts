export const	createNewConv = (
	activeId: string,
	numberOfChannels: number,
	socketRef: React.MutableRefObject<any>) =>
{
	const action = {
		type: "create-channel",
		payload: {
			chanName: "undefined",
			chanMode: "undefined",
			chanPassword: "undefined",
			chanId: numberOfChannels + 1,
			activeId: activeId
		}
	};
	socketRef.current.emit("channel-info", action);
};
