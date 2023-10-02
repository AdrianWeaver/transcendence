/* eslint-disable no-alert */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import {
	Box,
	Button,
	Divider,
	Fab,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	Tab,
	Tabs,
	TextField,
	Toolbar,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@mui/material";

import MessagesArea from "./components/MessagesArea";
import MessageItem from "./components/MessageItem";
import FriendsList from "./components/FriendsList";
import TabPanel from "./components/TabPanel";


const URL = "http://localhost:3000";
import SendIcon from "@mui/icons-material/Send";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useTheme } from "@emotion/react";
import
{
	useState,
	useEffect,
	useRef
}	from "react";
import { io } from "socket.io-client";

import {
	useAppDispatch,
	useAppSelector
} from "../../Redux/hooks/redux-hooks";
import {
	setCurrentChannel,
	setChatUsers,
	setMessageRoom,
	setKindOfConversation,
	setNumberOfChannels
}	from "../../Redux/store/controllerAction";
import { MessageRoomModel } from "../../Redux/models/redux-models";
import ToolbarMenu from "./components/ToolbarMenu";
import LeftSideFirstPanel from "./LeftSideFirstPanel";

type MessageModel =
{
	sender: string,
	message: string,
	id: number,
	date?: string
}

type MembersModel =
{
	id: number,
	name:string
}

const	ChatLayout = () =>
{
	const	socketRef = useRef<SocketIOClient.Socket | null>(null);

	const	style = useTheme();
	const	dispatch = useAppDispatch();

	const	currentChannel = useAppSelector((state) =>
	{
		return (state.controller.user.chat.currentChannel);
	});
	const currentChannelRef = useRef(currentChannel);

	const	kindOfConv = useAppSelector((state) =>
	{
		return (state.controller.user.chat.kindOfConversation);
	});
	const	activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});

	// USE STATES

	const activeViewValue = useAppSelector((state) =>
	{
		return (state.chat.toolbarActiveView);
	});

	const
	[
		connected,
		setConnected
	] = useState(false);

	// for when we try to access a protected channel
	const [
		userPassword,
		setUserPassword
	] = useState("");


	const [
		channels,
		setChannels
	] = useState([]);

	const
	[
		privateMessage,
		setPrivateMessage
	] = useState([]);

	const [
		chanMessages,
		setChanMessages
	] = useState<MessageModel[]>([]);

	const [
		openPasswordDialog,
		setOpenPasswordDialog
	] = useState(false);

	const [
		channelMembers,
		setChannelMembers
	] = useState<MembersModel[]>([]);

	const [
		isChannelAdmin,
		setIsChannelAdmin
	] = useState(false);

	const [
		uniqueId,
		setUniqueId
	] = useState("");

	const [
		friendList,
		setFriendList
	] = useState<string[]>([]);

	const [
		blockedList,
		setBlockedList
	] = useState<string[]>([]);

	const [
		isMuted,
		setIsMuted
	] = useState(false);

	// END OF USE STATEs

	const
	[
		arrayListUser,
		setArrayListUser
	] = useState([]);

	const [
		joiningChannelName,
		setJoiningChannelName
	] = useState("");

	const joiningChannelNameRef = useRef(joiningChannelName);
	const blockedListRef = useRef(blockedList);

	const	removeChannel = (chanId: number, chanName: string) =>
	{
		const	action = {
			type: "destroy-channel",
			payload: {
				name: chanName,
				id: chanId,
				kind: kindOfConv
			}
		};
		socketRef.current?.emit("channel-info", action);
	};

	const	joinChannel = (chanName: string) =>
	{
		const	action = {
			type: "asked-join",
			payload: {
				chanName: chanName,
				activeId: activeId,
				kind: kindOfConv
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	useEffect(() =>
	{
		const socket = io(URL,
			{
				autoConnect: false,
				reconnectionAttempts: 5,
			});

		socketRef.current = socket;

		const connect = () =>
		{
			setConnected(true);
		};

		const disconnect = () =>
		{
			setConnected(false);
		};

		const	updateChannels = (data: any) =>
		{
			if (data.type === "init-channels")
			{
				if (data.payload.channels !== undefined)
					setChannels(data.payload.channels);
				if (data.payload.privateMessage !== undefined)
					setPrivateMessage(data.payload.privateMessage);
				setUniqueId(data.payload.uniqueId);
			}

			if(data.type === "add-new-channel")
			{
				if (data.payload.chanMap !== undefined && data.payload.chanMap.length)
					setChannels(data.payload.chanMap);
				if (data.payload.privateMessageMap !== undefined)
					setPrivateMessage(data.payload.privateMessageMap);
				dispatch(setKindOfConversation(data.payload.kind));
			}

			if (data.type === "destroy-channel")
			{
				if (data.payload.message === "")
					setChannels(data.payload.chanMap);
				else if (data.payload.privateMessage !== undefined)
					setPrivateMessage(data.payload.privateMessageMap);
				else
					alert(data.payload.message);
			}

			if (data.type === "asked-join")
			{
				if (data.payload.message !== "")
					alert(data.payload.message);

				else
				{
					setChanMessages([]);
					alert("Successfully joined channel " + data.payload.chanName + "!");
				}
			}

			if (data.type === "protected-password")
			{
				if (data.payload.correct === "true")
				{
					joinChannel(joiningChannelNameRef.current);
					setOpenPasswordDialog(false);
					setUserPassword("");
				}
				else
					alert("Incorrect password, try again !");
			}
		};

		const connectError = (error: Error) =>
		{
			console.error("ws_connect_error", error);
		};

		const serverInfo = (data: any) =>
		{
			dispatch(setChatUsers(data.payload.arrayListUsers));
			console.log("information from server: ", data);
			// setArrayListUser(data.payload.arrayListUser);
		};

		const sendMessageToUser = (data: any) =>
		{
			const msgRoom: MessageRoomModel[] = [
				{
					id: data.payload.msgRoom.id,
					roomName: data.payload.msgRoom.roomName,
					privateConv: data.payload.msgRoom.privateConv,
					content: data.payload.msgRoom.messageContent
				}
			];
			dispatch(setMessageRoom(msgRoom, data.payload.sender));
			console.log("test send Message: ", data);
		};

		const	updateMessages = (data: any) =>
		{
			if (data.payload.chanName === currentChannelRef.current)
			{
				// we will filter messages from blocked users if any
				const	tmpMessages = data.payload.messages;
				const	filteredMessages = tmpMessages.filter((message: MessageModel) =>
				{
					return (!blockedListRef.current.includes(message.sender));
				});
				setChanMessages(filteredMessages);
			}
		};

		const	channelInfo = (data: any) =>
		{
			if (data.type === "confirm-is-inside-channel")
			{
				if (data.payload.isInside === "")
				{
					dispatch(setCurrentChannel(data.payload.chanName));
					setChanMessages(data.payload.chanMessages);
				}
				else
					alert(data.payload.isInside);
			}
			if (data.type === "display-members")
			{
				setChannelMembers(data.payload.memberList);
				setIsChannelAdmin(data.payload.isAdmin);
			}
		};

		const	leftChannelMessage = (data: any) =>
		{
			if (data.type === "left-channel")
			{
				if (currentChannelRef.current === data.payload.chanName)
				{
					setChanMessages([]);
					dispatch(setCurrentChannel("undefined"));
				}
				alert(data.payload.message);
			}
		};

		const	userInfo = (data: any) =>
		{
			if (data.type === "add-friend")
			{
				setFriendList(data.payload.friendList);
				const	alertMessage = data.payload.newFriend + " has been added to Friends.";
				alert(alertMessage);
			}

			if (data.type === "block-user")
			{
				setBlockedList(data.payload.blockedList);
				const	alertMessage = "You have blocked " + data.payload.newBlocked + ".";
				alert(alertMessage);
			}

			if (data.type === "set-is-muted")
			{
				console.log("LOL");
				setIsMuted(true);
				const	message = "You have been muted in the channel " + data.payload.chanName + " for 60 seconds.";
				alert(message);
			}
		};

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("info", serverInfo);
		socket.on("send-message", sendMessageToUser);
		socket.on("display-channels", updateChannels);
		socket.on("channel-info", channelInfo);
		socket.on("update-messages", updateMessages);
		socket.on("left-message", leftChannelMessage);
		socket.on("get-user-list", updateChannels);
		socket.on("user-info", userInfo);

        socket.connect();

		return (() =>
		{
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("info", serverInfo);
			socket.off("sending-message", sendMessageToUser);
			socket.off("display-channels", updateChannels);
			socket.off("channel-info", channelInfo);
			socket.off("update-messages", updateMessages);
			socket.on("left-message", leftChannelMessage);
			socket.off("get-user-list", updateChannels);
			socket.off("user-info", userInfo);
        });
    }, []);

	useEffect(() =>
	{
		currentChannelRef.current = currentChannel;
		joiningChannelNameRef.current = joiningChannelName;
		blockedListRef.current = blockedList;

		if (isMuted === true)
		{
			setTimeout(() =>
			{
				setIsMuted(false);
			}, 60000);
		}
	}, [
		currentChannel,
		joiningChannelName,
		isMuted,
		blockedList
	]);

	const refreshListUser = () =>
	{
		const action = {
			type: "get-user-list",
		};
		socketRef.current?.emit("info", action);
		console.log("refresh the list of user");
	};

	const listItemStyle = {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "8px",
	};

	const listItemTextStyle = {
		flexGrow: 1,
	};

	const
	[
		text,
		setText
	] = useState("");

	const handleTextChange = (e: any) =>
	{
		if (isMuted === true)
			alert("You are muted for the moment being.");
		else
			setText(e.target.value);
	};

	const handleSendClick = () =>
	{
		const action = {
			type: "sent-message",
			payload: {
				chanName: currentChannel,
				message: text,
			}
		};
		socketRef.current.emit("info", action);
		setText("");
	};

	const	goToChannel = (chanName: string) =>
	{
		console.log("LAYOUT 815 ", activeId);
		const	action = {
			type: "did-I-join",
			payload: {
				chanName: chanName,
				kind: kindOfConv,
				userId: activeId
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	const [
		isDialogOpen,
		setIsDialogOpen
	] = useState(false);

	const handleDialogOpen = () =>
	{
		setIsDialogOpen(true);
	};

	const handleDialogClose = () =>
	{
		setIsDialogOpen(false);
	};

	const handleJoinButtonClick = (chanMode: string, chanName: string) =>
	{
		if (chanMode === "protected")
		{
			setJoiningChannelName(chanName);
			setOpenPasswordDialog(true);
		}
		else
			joinChannel(chanName);
		handleDialogClose();
	};

	const handleRemoveButtonClick = (chanId: number, chanName: string) =>
	{
		removeChannel(chanId, chanName);
		handleDialogClose();
	};

	return (
		<div>
			<MenuBar />
			<div>
				connected:{connected}
				<button onClick={refreshListUser}>click to refresh</button>
			</div>
			<Grid
				container
				component={Paper}
				sx={{
					width: "100%",
					height: "80vh"
				}}
			>
				<Grid
					item
					xs={3}
					sx={{ borderRight: "1px solid #e0e0e0" }}
				>
					<ToolbarMenu/>
					{/* right side of the screen  */}
					<LeftSideFirstPanel
						currentChannelRef={currentChannelRef}
						socketRef={socketRef}/>

					<TabPanel
						area="false"
						value={activeViewValue}
						index={1}
						dir={style.direction}
						style={style}
					>
						{/* ///////////// */}
							<FriendsList socketRef={socketRef} arrayListUsers={arrayListUser}/>
							<List>
								{privateMessage.map((channel: any) =>
									{
										return (
											<ListItem style={listItemStyle} key={channel.id}>
												<ListItemText
													style={
														channel.name === currentChannel
														? { color: "green" }
														: listItemTextStyle
													}
													primary={channel.name}
													onClick={() =>
													{
														setKindOfConversation("privateMessage");
														return (goToChannel(channel.name));
													}}
												/>
												<Button onClick={handleDialogOpen}>
													Options
												</Button>
												<Dialog open={isDialogOpen} onClose={handleDialogClose}>
													<DialogTitle>
														Choose an Action
													</DialogTitle>
													<DialogContent>
													<Button onClick={() =>
														{
															setKindOfConversation("privateMessage");
															return handleJoinButtonClick(channel.mode, channel.name);
														}}>
															Talk
														</Button>
														<Button onClick={() =>
														{
															return handleRemoveButtonClick(channel.id, channel.name);
														}}>
															Remove
														</Button>
													</DialogContent>
													<DialogActions>
													<Button onClick={handleDialogClose} color="primary">
														Cancel
													</Button>
													</DialogActions>
												</Dialog>
											</ListItem>
										);
									})
								}
							</List>
						{/* ////////////////// */}
					</TabPanel>
					<TabPanel
						area="false"
						value={activeViewValue}
						index={2}
						dir={style.direction}
						style={style}
					>
						{/* <FriendsList arrayListUsers={arrayListUser} /> */}
						<List>
							{
								friendList.map((friend: any) =>
								{
									return (
										<ListItem style={listItemStyle} key={friend.id}>
											<ListItemText
												style={listItemTextStyle}
												primary={friend.name}
												// onClick={() =>
												// {
												// 	return (goToChannel(channel.name));
												// }}
											/>
										</ListItem>
									);
								})
							}
						</List>
					</TabPanel>
				</Grid>
				<Grid item xs={9}>
					<TabPanel
						area="true"
						value={activeViewValue}
						index={0}
						dir={style.direction}
						style={style}
					>
						<List
							sx={{
								height: "70vh",
								overflowY: "auto"
							}}
							>
							{chanMessages.map((message: MessageModel, index) =>
							{
								let	sender: "me" | "other" | "server";

								if (uniqueId === message.sender)
									sender = "me";
								else
									sender = "other";
								return (
									// <ListItem key={message.id}>
									// 	<ListItemText primary={message.message} />
									// </ListItem>
									<MessageItem
										key={index}
										sender={sender}
										date={message.sender}
										message={message.message}
									/>
								);
							})}
						</List>
					</TabPanel>

					{/* when value == 1 */}
					<TabPanel
						area="true"
						value={activeViewValue}
						index={1}
						dir={style.direction}
						style={style}
					>
						<MessagesArea/>
					</TabPanel>

					<Divider />

					<Grid
						container
						// style={{padding: '20px'}}
						sx={{ padding: "20px" }}
					>
						{/* <SendingArea /> */}
						<Grid item xs={11}>
							<TextField
							id="outlined-basic-email"
							label="Type Something"
							fullWidth
							value={text}
							onChange={handleTextChange}
							/>
						</Grid>
						<Grid xs={1} sx={{ alignItems: "right" }}>
							<Fab color="primary" aria-label="add" onClick={handleSendClick}>
							<SendIcon />
							</Fab>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default ChatLayout;
