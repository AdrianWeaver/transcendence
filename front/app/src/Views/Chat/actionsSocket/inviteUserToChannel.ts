
export const	inviteUserToChannel
=(
	userName: string,
	channelToInvite: string,
	socketRef: React.MutableRefObject<any>
) =>
{
	const	action = {
		type: "invite-member",
		payload: {
			chanName: channelToInvite,
			userName: userName,
		}
	};
	socketRef.current.emit("user-info", action);
	// setChannelToInvite("");
};
