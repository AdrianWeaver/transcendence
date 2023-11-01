/* eslint-disable max-lines-per-function */
/* eslint-disable no-alert */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import
{
	useAppDispatch,
	useAppSelector
} from "../../../Redux/hooks/redux-hooks";

import {
	Divider,
	Grid,
	List,
	TextField
} from "@mui/material";

import Myself from "./Myself";
import FriendItem from "./FriendItem";

import
{
	setActiveConversationId
}	from "../../../Redux/store/controllerAction";

// import SocketIOClient from "@type/sockl"

type FriendsListProps = {
	arrayListUsers: string[],
	socketRef: React.MutableRefObject<SocketIOClient.Socket>
};

const FriendsList = (props: FriendsListProps) =>
{
	const	dispatch = useAppDispatch();
	const	users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});

	const	numberOfChannels = useAppSelector((state) =>
	{
		return (state.controller.user.chat.numberOfChannels);
	});

	const	createNewConv = (activeId: string) =>
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
		props.socketRef.current.emit("channel-info", action);
	};
	const displayConversationWindow = (id: string) =>
	{
		const action = {
			type: "display-conversation",
			payload:
			{
				id: id,
				index: numberOfChannels + 1
			}
		};
		props.socketRef.current?.emit("display-conversation", action);
	};

	return (
		<>
			<Myself />
			<Divider />
			<Grid
				item
				xs={12}
				// style={{padding: '10px'}}
				sx={{ padding: "10px" }}
			>
				<TextField
					id="outlined-basic-email"
					label="Search"
					variant="outlined"
					fullWidth
				/>
			</Grid>
			<Divider />
			<List>
				{
					users.map((elem, index) =>
					{
						return (
							<>
								<div key={index} onClick={() =>
								{
									displayConversationWindow(elem.id);
									dispatch(setActiveConversationId(elem.id));
									// dispatch(setKindOfConversation("privateMessage"));
									createNewConv(elem.id);
								}}>
									<FriendItem
										name={elem.name + ": " + elem.id}
										avatar={elem.avatar}
										online={true}
										key={index}
										ind={index}
									/>
								</div>
							</>
						);
					})
				}
			</List>
		</>
	);
};

export default FriendsList;
