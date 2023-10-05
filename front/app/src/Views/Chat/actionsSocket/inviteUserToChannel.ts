
export const	inviteUserToChannel
=(
	userName: string,
	channelToInvite: string,
	socketRef: React.MutableRefObject<any>
) =>
{
	console.log("member: " + userName);
	console.log("chanel : " + channelToInvite);
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
