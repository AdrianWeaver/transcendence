
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import
{
	useAppDispatch,
	useAppSelector
}	from "../../../Redux/hooks/redux-hooks";

import {
	setActiveConversationId,
	setKindOfConversation,
}	from "../../../Redux/store/controllerAction";

type FriendsListProps = {
	arrayListUsers: [],
	socketRef: React.MutableRefObject<SocketIOClient.Socket>
};


import {
	Divider,
	Grid,
	List,
	TextField} from "@mui/material";

import CurrentlyTalkingFriend from "./CurrentlyTalkingFriend";
import FriendItem from "./FriendItem";

const FriendsList = (props: FriendsListProps) =>
{
	const	dispatch = useAppDispatch();
	const	users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});
	const	kindOfConv = useAppSelector((state) =>
	{
		return (state.controller.user.chat.kindOfConversation);
	});
	const	numberOfChannels = useAppSelector((state) =>
	{
		return (state.controller.user.chat.numberOfChannels);
	});

	const	createNewConv = (activeId: string) =>
	{
		console.log(" friend chatLayout 433: ", kindOfConv);
		console.log(" friend activeId: ", activeId);
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
		console.log(" friend 2 chatLayout 433: ", kindOfConv);
		console.log(" friend 2 chanName: ", action.payload.chanName);
		props.socketRef.current.emit("channel-info", action);
	};

	const displayConversationWindow = (id: string) =>
	{
		console.log("layout 189 ", id, " ", numberOfChannels);
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

	const	handleClickOnFriendItem = (userId: string, convertationType:string) =>
	{
		displayConversationWindow(userId);
		dispatch(setActiveConversationId(userId));
		dispatch(setKindOfConversation(convertationType));
		createNewConv(userId);
		console.log("dispatched");
	};

	return (
		<>
			<CurrentlyTalkingFriend />
			<Divider />
			<Grid
				item
				xs={12}
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
								<div onClick={() =>
								{
									handleClickOnFriendItem(elem.id, "privateMessage");
								}}>
									<FriendItem
										name={elem.name + ": " + elem.id}
										avatar={elem.avatar}
										key={index}
										online={true}
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
