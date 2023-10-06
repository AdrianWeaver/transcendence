export const	addUserToFriends = (
	userName: string,
	socketRef: React.MutableRefObject<any>) =>
{
	const	action = {
		type: "add-friend",
		payload: {
			friendName: userName,
		}
	};
	socketRef.current.emit("user-info", action);
};
