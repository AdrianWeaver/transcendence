
export const	goToChannel = (
	chanName: string,
	kind: string,
	socketRef: React.MutableRefObject<any>,
	activeId: string
	) =>
{
	const	action = {
		type: "did-I-join",
		payload: {
			chanName: chanName,
			kind: kind,
			userId: activeId
		}
	};
	socketRef.current.emit("channel-info", action);
};
