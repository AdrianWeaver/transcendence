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

import CurrentlyTalkingFriend from "./CurrentlyTalkingFriend";
import FriendItem from "./FriendItem";

import { createNewConv } from "../actionsSocket/createNewConv";
import { displayConversationWindow } from "../actionsSocket/displayConversationWindow";
import
{
	setActiveConversationId
}	from "../../../Redux/store/controllerAction";


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

	return (
		<>
			<CurrentlyTalkingFriend />
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
						console.log("elem", elem);
						console.log("index", index);
						return (
							// <>
								<div
									key={index}
									onClick={() =>
									{
										displayConversationWindow(elem.id, numberOfChannels, props.socketRef);
										dispatch(setActiveConversationId(elem.id));
										// dispatch(setKindOfConversation("privateMessage"));
										createNewConv(elem.id, numberOfChannels, props.socketRef);
									}}
								>
									<FriendItem
										name={elem.name + ": " + elem.id}
										avatar={elem.avatar}
										online={true}
									/>
								</div>
							// </>
						);
					})
				}
			</List>
		</>
	);
};

export default FriendsList;
