/* eslint-disable no-alert */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import {
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
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@mui/material";

import MessageItem from "./components/MessageItem";
import FriendsList from "./components/FriendsList";
import TabPanel from "./components/TabPanel";

import	{ inviteUserToChannel } from "./actionsSocket/inviteUserToChannel";
import	{ muteUserInChannel } from "./actionsSocket/muteUserInChannel";
import	{ addUserToBlocked } from "./actionsSocket/addUserToBlocked";
import	{ addUserToFriends } from "./actionsSocket/addUserToFriends";
import	{ makeAdmin } from "./actionsSocket/makeAdmin";
import	{ removeChannel } from "./actionsSocket/removeChannel";
import	{ handlePasswordSubmit } from "./actionsSocket/handlePasswordSubmit";
import	{ kickUserFromChannel } from "./actionsSocket/kickUserFromChannel";
import	{ banUserFromChannel } from "./actionsSocket/banUserFromChannel";
import	{ joinChannel } from "./actionsSocket/joinChannel";
import	{ refreshListUser } from "./actionsSocket/refreshListUser";
import	{ goToChannel } from "./actionsSocket/goToChannel";
import	{ leaveChannel } from "./actionsSocket/leaveChannel";
import	{ handleMembersClickOpen } from "./actionsSocket/handleMembersClickOpen";
import	{ handleSendClick } from "./actionsSocket/handleSendClick";
import	{ createNewChannel } from "./actionsSocket/createNewChannel"; 

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
	setNumberOfChannels
}	from "../../Redux/store/controllerAction";
import { MessageRoomModel } from "../../Redux/models/redux-models";

type MessageModel =
{
	sender: string,
	message: string,
	id: number
}

type MembersModel =
{
	id: number,
	name:string
}

type ChanMapModel = {
    id: number,
    name: string,
    mode: string
};

const a11yProps = (index: any) =>
{
	return (
		{
			id: `action-tab-${index}`,
			"aria-controls": `action-tabpanel-${index}`,
		}
	);
};

const	ChatLayout = () =>
{
	const	socketRef = useRef<SocketIOClient.Socket | null>(null);

	const	style = useTheme();
	const	dispatch = useAppDispatch();
	const	chatConnected = useAppSelector((state) =>
	{
		return (state.controller.user.chat.connected);
	});

	const	currentChannel = useAppSelector((state) =>
	{
		return (state.controller.user.chat.currentChannel);
	});
	const currentChannelRef = useRef(currentChannel);


	const	activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});
	const	url = useAppSelector((state) =>
	{
		return ("http://" + state.server.serverLocation + ":3000");
	});

	// USE STATES

	const
	[
		value,
		setValue
	] = useState(0);

	const
	[
		connected,
		setConnected
	] = useState(false);

	const [
		open,
		setOpen
	] = useState(false);

	const [
		channelName,
		setChannelName
	] = useState("");

	const [
		chanPassword,
		setChanPassword
	] = useState("");

	// for when we try to access a protected channel
	const [
		userPassword,
		setUserPassword
	] = useState("");

	const [
		selectedMode,
		setSelectedMode
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
		privMessages,
		setPrivMessages
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
		kindOfConversation,
		setKindOfConversation
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

	const [
		buttonSelection,
		setButtonSelection
	] = useState<ChanMapModel>({
		id: 0,
		name: "",
		mode: "",
	});

	const [
		inviteDialogOpen,
		setInviteDialogOpen
	] = useState(false);

	const [
		channelToInvite,
		setChannelToInvite
	] = useState("");

	const handleClickOpen = () =>
	{
		setOpen(true);
	};

	const handleClose = () =>
	{
		setChannelName("");
		setSelectedMode("");
		setChanPassword("");
		setOpen(false);
	};

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

	const handleSave = () =>
	{
		setKindOfConversation("channel");
		// dispatch(setKindOfConversation("channel"));
		// Check if Channel name is empty
		if (channelName.trim() === "")
		{
			alert("Channel name cannot be empty");
			return;
		}

		if (![
			"public",
			"protected",
			"private"
			].includes(selectedMode))
		{
			alert("Please select a mode (Public, Protected, or Private)");
			return;
		}

		if (selectedMode === "Protected" && chanPassword.trim() === "")
		{
			alert("There must be a password for a protected channel");
			return;
		}
		setKindOfConversation("channel");
		createNewChannel(
			socketRef,
			channelName,
			selectedMode,
			chanPassword,
			channels,
			privateMessage,
			activeId,
			kindOfConversation
		);
		dispatch(setNumberOfChannels(channels.length));
		handleClose();
	};

	useEffect(() =>
	{
		const socket = io(url,
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
				if (data.payload.kind === "channel")
					setChannels(data.payload.chanMap);
				if (data.payload.kind === "privateMessage")
					setPrivateMessage(data.payload.privateMessageMap);
				setKindOfConversation(data.payload.kind);
			}

			if (data.type === "destroy-channel")
			{
				if (data.payload.privateMessage !== undefined)
					setPrivateMessage(data.payload.privateMessageMap);
				else if (data.payload.message === "")
					setChannels(data.payload.chanMap);
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
					joinChannel(joiningChannelNameRef.current, socketRef, activeId, kindOfConversation);
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
			setArrayListUser(data.payload.arrayListUser);
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
			// dispatch(setMessageContent(data.payload.messageContent));
			console.log("test send Message: ", data);
		};

		const	updateMessages = (data: any) =>
		{
			const	kind = data.payload.kind;
			setKindOfConversation(kind);
			if (data.payload.chanName === currentChannelRef.current)
			{
				setKindOfConversation(data.payload.kind);

				// we will filter messages from blocked users if any
				const	tmpMessages = data.payload.messages;
				const	filteredMessages = tmpMessages.filter((message: MessageModel) =>
				{
					return (!blockedListRef.current.includes(message.sender));
				});
				if (data.payload.kind === "channel")
					setChanMessages(filteredMessages);
				else if (data.payload.kind === "privateMessage")
					setPrivMessages(filteredMessages);
			}
		};

		const	channelInfo = (data: any) =>
		{
			if (data.type === "confirm-is-inside-channel")
			{
				if (data.payload.isInside === "")
				{
					dispatch(setCurrentChannel(data.payload.chanName));
					if (data.payload.kind === "channel" || kindOfConversation === "channel")
						setChanMessages(data.payload.chanMessages);
					if (data.payload.kind === "privateMessage" || kindOfConversation === "privateMessage")
						setPrivMessages(data.payload.chanMessages);
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
					if (data.payload.kind === "channel" || kindOfConversation === "channel")
						setChanMessages([]);
					if (data.payload.kind === "privateMessage" || kindOfConversation === "privateMessage")
						setPrivMessages([]);
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
				setIsMuted(true);
				const	message = "You have been muted in the channel " + data.payload.chanName + " for 60 seconds.";
				alert(message);
			}

			if (data.type === "invite-member")
			{
				alert(data.payload.message);
			}

			if (data.type === "make-admin")
			{
				alert(data.payload.message);
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

	const handleChange = (event: React.SyntheticEvent, newValue: number) =>
	{
		setValue(newValue);
	};

	const handleChangeIndex = (index: number) =>
	{
		setValue(index);
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

	const [
		isDialogOpen,
		setIsDialogOpen
	] = useState(false);

	const [
		channelAction,
		setChannelAction
	] = useState("");

	const handleDialogOpen = () =>
	{
		setIsDialogOpen(true);
	};

	const handleDialogClose = () =>
	{
		setIsDialogOpen(false);
		setButtonSelection({
			id: 0,
			name: "",
			mode: "",
		});
	};

	const handleJoinButtonClick = (chanMode: string, chanName: string) =>
	{
		if (chanMode === "protected")
		{
			setJoiningChannelName(chanName);
			setOpenPasswordDialog(true);
		}
		else
			joinChannel(chanName, socketRef, activeId, kindOfConversation);
		handleDialogClose();
	};

	const handleLeaveButtonClick = (chanId: number, chanName: string) =>
	{
		leaveChannel(chanName, socketRef);
		handleDialogClose();
	};

	const handleRemoveButtonClick = (chanId: number, chanName: string) =>
	{
		removeChannel(chanId, chanName, socketRef, kindOfConversation);
		handleDialogClose();
	};

	const [
		membersOpen,
		setMembersOpen
	] = useState(false);

	const handleMembersClose = () =>
	{
		setMembersOpen(false);
	};

	return (
		<div>
			<MenuBar />
			<div>
				connected:{connected}
				<button onClick={ () =>
					{
					refreshListUser(socketRef);
					}}>
					click to refresh</button>
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
					<Toolbar
						style={
							{
								backgroundColor: style.palette.primary.main,
							}}
					>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="secondary"
							variant="scrollable"
							aria-label="action tabs"
						>
							<Tab
								label="Channels"
								{...a11yProps(0)}
								style={{fontSize: "15px"}}
							/>
							<Tab
								label="Users"
								{...a11yProps(1)}
								style={{fontSize: "15px"}}
							/>
							<Tab
								label="Friends"
								{...a11yProps(2)}
								style={{fontSize: "15px"}}
							/>
						</Tabs>
					</Toolbar>
					{/* right side of the screen  */}
					<TabPanel
						area={false}
						value={value}
						index={0}
						dir={style.direction}
						style={style}
					>
						{/* <ChannelsList /> */}
						<div>
							<Button onClick={handleClickOpen} variant="contained" color="success">
								NEW
							</Button>
							<Dialog open={open} onClose={handleClose}>
								<DialogTitle>Enter Information</DialogTitle>
								<DialogContent>
									<DialogContentText>
										Please enter the following information:
									</DialogContentText>
									<input
										type="text"
										placeholder="Channel name"
										value={channelName}
										onChange={(e) =>
										{
											setKindOfConversation("channel");
											const inputValue = e.target.value;
											if (inputValue.length <= 8)
												setChannelName(inputValue);
											else
												setChannelName(inputValue.slice(0, 8));
										}}
									/>
									<br />
									<div>
										<input
										type="radio"
										id="option1"
										name="answerOption"
										value="public"
										checked={selectedMode === "public"}
										onChange={() =>
										{
											setSelectedMode("public");
										}}
										/>
										<label htmlFor="option1">Public</label>
									</div>
									<div>
										<input
										type="radio"
										id="option2"
										name="answerOption"
										value="protected"
										checked={selectedMode === "protected"}
										onChange={() =>
										{
											setSelectedMode("protected");
										}}
										/>
										<label htmlFor="option2">Protected</label>
									</div>n
									<div>
										<input
										type="radio"
										id="option3"
										name="answerOption"
										value="private"
										checked={selectedMode === "private"}
										onChange={() =>
										{
											setSelectedMode("private");
										}}
										/>
										<label htmlFor="option3">Private</label>
									</div>
									<input
										type="text"
										placeholder="Password (if protected)"
										value={chanPassword}
										onChange={(e) =>
										{
											setChanPassword(e.target.value);
										}}
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose} color="primary">
										Cancel
									</Button>
									<Button onClick={handleSave} color="primary">
										Save
									</Button>
								</DialogActions>
							</Dialog>
							<List>
								{
									channels.map((channel: any, index) =>
									{
										return (
											// <ListItem style={listItemStyle} key={channel.id}>
											<ListItem style={listItemStyle} key={index}>
												<ListItemText
													style={
														channel.name === currentChannelRef.current
														? { color: "red" }
														: listItemTextStyle
													}
													primary={channel.name}
													onClick={() =>
													{
														setKindOfConversation("channel");
														return (goToChannel(channel.name, "channel", socketRef, activeId));
													}}
												/>
												<Button onClick={() =>
												{
													handleDialogOpen();
													setButtonSelection(channel);
												}}>
													Options
												</Button>
												<Dialog open={isDialogOpen} onClose={handleDialogClose}>
													<DialogTitle>
														Choose an Action
													</DialogTitle>
													<DialogContent>
														<Button onClick={() =>
														{
															return handleJoinButtonClick(buttonSelection.mode, buttonSelection.name);
														}}>
															Join
														</Button>
														<Button onClick={() =>
														{
															return handleLeaveButtonClick(buttonSelection.id, buttonSelection.name);
														}}>
															Leave
														</Button>
														<Button onClick={() =>
														{
															return handleRemoveButtonClick(buttonSelection.id, buttonSelection.name);
														}}>
															Remove
														</Button>
														<Button onClick={() =>
														{
															setMembersOpen(true);
															return handleMembersClickOpen(buttonSelection.name, socketRef);
														}}>
															Members
														</Button>
														<Dialog open={membersOpen} onClose={handleMembersClose} maxWidth="sm" fullWidth>
															<DialogTitle>
																Channel Members
															</DialogTitle>
															<DialogContent>
																<ul>
																{
																	channelMembers.map((member, index) =>
																	{
																		return (
																			// <li key={member.id}>
																			<li key={index}>
																				{member.name}
																				{isChannelAdmin && member.name !== uniqueId && (
																				<>
																					<Button onClick={() =>
																					{
																						kickUserFromChannel(member.name, buttonSelection.name, socketRef);
																						handleMembersClose();
																					}}>
																						Kick
																					</Button>
																					<Button onClick={() =>
																					{
																						banUserFromChannel(member.name, buttonSelection.name, socketRef);
																					}}>
																						Ban
																					</Button>
																					<Button onClick={() =>
																					{
																						muteUserInChannel(member.name, buttonSelection.name, socketRef);
																					}}>
																						Mute
																					</Button>
																					<Button onClick={() =>
																					{
																						makeAdmin(member.name, buttonSelection.name, socketRef);
																					}}>
																						Make admin
																					</Button>
																				</>)}
																				{member.name !== uniqueId && (
																				<>
																					<Button onClick={() =>
																					{
																						addUserToFriends(member.name, socketRef);
																					}}>
																						Add friend
																					</Button>
																					<Button onClick={() =>
																					{
																						addUserToBlocked(member.name, socketRef);
																					}}>
																						Block
																					</Button>
																					<Button onClick={() =>
																					{
																						setInviteDialogOpen(true);
																						// inviteUserToChannel(member.name);
																					}}>
																						Invite
																					</Button>
																					<Dialog open={inviteDialogOpen} onClose={() =>
																						{
																							setInviteDialogOpen(false);
																						}}
																						maxWidth="sm" fullWidth>
																						<DialogTitle>Invite User to Channel</DialogTitle>
																						<DialogContent>
																							<TextField
																							label="Channel Name"
																							variant="outlined"
																							fullWidth
																							value={channelToInvite}
																							onChange={(e) =>
																							{
																								console.log("target value " + e.target.value);
																								setChannelToInvite(e.target.value);
																							}}/>
																						</DialogContent>
																						<DialogActions>
																							<Button onClick={() =>
																								{
																									inviteUserToChannel(
																										member.name,
																										channelToInvite,
																										socketRef
																										);
																									setInviteDialogOpen(false);
																								}} color="primary">
																								Invite
																							</Button>
																							<Button onClick={() =>
																							{
																								setInviteDialogOpen(false);
																							}} color="primary">
																							Cancel
																							</Button>
																						</DialogActions>
																					</Dialog>
																				</>)}
																			</li>);
																	})
																}
																</ul>
															</DialogContent>
															<DialogActions>
															<Button onClick={handleMembersClose} color="primary">
																Close
															</Button>
															</DialogActions>
														</Dialog>
													</DialogContent>
													<DialogActions>
													<Button onClick={handleDialogClose} color="primary">
														Cancel
													</Button>
													</DialogActions>
												</Dialog>
												<Dialog
													open={openPasswordDialog}
													onClose={() =>
													{
														setOpenPasswordDialog(false);
													}}
												>
													<DialogTitle>
														Enter Password
													</DialogTitle>
													<DialogContent>
														<TextField
															label="Password"
															type="password"
															fullWidth
															variant="outlined"
															value={userPassword}
															onChange={(e) =>
															{
																setUserPassword(e.target.value);
															}}
														/>
													</DialogContent>
													<DialogActions>
														<Button
															onClick={() =>
															{
																setOpenPasswordDialog(false);
															}}
															color="primary"
														>
															Cancel
														</Button>
														<Button
															onClick={() =>
															{
																handlePasswordSubmit(userPassword, socketRef, joiningChannelName);
															}}
															color="primary"
															>
															Submit
														</Button>
													</DialogActions>
												</Dialog>
											</ListItem>
										);
									})
								}
							</List>
						</div>
					</TabPanel>
					<TabPanel
						area={false}
						value={value}
						index={1}
						dir={style.direction}
						style={style}
					>
						{/* ///////////// */}
							<FriendsList socketRef={socketRef} arrayListUsers={arrayListUser}/>
							<List>
								{privateMessage.map((channel: any, index) =>
									{
										// setKindOfConversation("privateMessage");
										return (
											// <ListItem style={listItemStyle} key={channel.id}>
											<ListItem style={listItemStyle} key={index}>
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
															return (goToChannel(channel.name, "privateMessage", socketRef, activeId));
														}}
													/>
											</ListItem>
										);
									})
								}
							</List>
						{/* ////////////////// */}
					</TabPanel>
					<TabPanel
						area={false}
						value={value}
						index={2}
						dir={style.direction}
						style={style}
					>
						{/* <FriendsList arrayListUsers={arrayListUser} /> */}
						<List>
							{
								friendList.map((friend: any, index) =>
								{
									return (
										// <ListItem style={listItemStyle} key={friend.id} key>
										<ListItem style={listItemStyle} key={index}>
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
						area={true}
						value={value}
						index={0}
						dir={style.direction}
						style={style}
					>
						{/* <List
							sx={{
								height: "70vh",
								overflowY: "auto"
							}}
							> */}
							{chanMessages.map((message: MessageModel, index) =>
							{
								let	sender: "me" | "other" | "server";

								if (uniqueId === message.sender)
									sender = "me";
								else if (message.sender === "server")
									sender = "server";
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
						{/* </List> */}
					</TabPanel>
					{/* when value == 1 */}
					<TabPanel
						area={true}
						value={value}
						index={1}
						dir={style.direction}
						style={style}
					>
						{/* <List
							sx={{
								height: "70vh",
								overflowY: "auto"
							}}
							> */}
						{/* <MessagesArea/> */}
						{privMessages.map((message: MessageModel, index) =>
							{
								let	sender: "me" | "other" | "server";

								if (uniqueId === message.sender)
									sender = "me";
								else if (message.sender === "server")
									sender = "server";
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
							{/* </List> */}
					</TabPanel>

					<Divider />

					<Grid
						container
						sx={{ padding: "20px" }}
					>
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
							<Fab color="primary" aria-label="add" onClick={ () =>
								{
									handleSendClick(socketRef, currentChannel, text);
									setText("");
								}}>
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
