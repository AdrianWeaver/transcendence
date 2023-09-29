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

import MessageItem from "./components/MessageItem";
import CurrentlyTalkingFriend from "./components/CurrentlyTalkingFriend";
import FriendItem from "./components/FriendItem";

const URL = "http://localhost:3000";
import SendIcon from "@mui/icons-material/Send";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useTheme } from "@emotion/react";
import
{
	CSSProperties,
	useState,
	useEffect,
	useRef
}	from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

import {
	useAppDispatch,
	useAppSelector
} from "../../Redux/hooks/redux-hooks";
import {
	setActiveConversationId,
	setCurrentChannel,
	setChatUsers,
	setMessageRoom,
	setKindOfConversation,
	setNumberOfChannels
}	from "../../Redux/store/controllerAction";
import { MessageRoomModel } from "../../Redux/models/redux-models";
import { ClosedCaptionDisabledTwoTone, LocalConvenienceStoreOutlined } from "@mui/icons-material";

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

// chat part 
interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
	style?: CSSProperties;
	area?: boolean;
}

const TabPanel = (props: TabPanelProps) =>
{
	const { children, value, index, ...other } = props;
	let animationSettings;

	if (props.area === false)
		animationSettings = {
			type: "spring",
			duration: 0.3,
			scale: 0.6,
			stiffness: 0
		};
	else
		animationSettings = {
			type: "sidebar",
			duration: 0.5,
			scale: 0.85,
			stiffness: 80,
		};
	return (
		<motion.div
			initial={
				{
					opacity: 0,
					scale: animationSettings.scale
				}}
			animate={{
				opacity: value === index ? 1 : 0,
				scale: value === index ? 1 : animationSettings.scale
			}}
			transition={
				{
					duration: animationSettings.duration,
					type: animationSettings.type,
					stiffness: 80,
				}}
			style={{ display: value === index ? "block" : "none" }}
		>
			<Typography
				component="div"
				role="tabpanel"
				hidden={value !== index}
				id={`action-tabpanel-${index}`}
				aria-labelledby={`action-tab-${index}`}
				{...other}
			>
				<Box sx={{ p: 3 }}>{children}</Box>
			</Typography>
		</motion.div>
	);
};

type FriendsListProps = {
	arrayListUsers: [],
	socketRef: React.MutableRefObject<SocketIOClient.Socket>
};

const FriendsList = (props: FriendsListProps) =>
{
	// const	socketTest = useRef<SocketIOClient.Socket | null>(null);
	let		friendList: any[];
	const	dispatch = useAppDispatch();
	const	users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});
	const	kindOfConv = useAppSelector((state) =>
	{
		return (state.controller.user.chat.kindOfConversation);
	});
	const sendMsg = (id: string) =>
	{
		const action = {
			type: "sending-message"
		};
		console.log("sendMsg function called with id ", id);
		// socketTest.current?.emit("send-message", action);
	};
	const	numberOfChannels = useAppSelector((state) =>
	{
		return (state.controller.user.chat.numberOfChannels);
	});

	const	createNewConv = (activeId: string) =>
	{
		// TEST
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
						return (
							<>
								<div onClick={() =>
								{
									displayConversationWindow(elem.id);
									dispatch(setActiveConversationId(elem.id));
									dispatch(setKindOfConversation("privateMessage"));
									createNewConv(elem.id);
									console.log("dispatched");
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


const MessagesArea = () =>
{
	let displayMessageArray;

	displayMessageArray = [
	{
		sender: "server",
		message: "Not initiliazed",
		date: "09:30"
	},
	];
	const	dispatch = useAppDispatch();

	const users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});

	const activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});

	const userActiveIndex = users.findIndex((elem) =>
	{
		return (elem.id === activeId);
	});
	if (userActiveIndex === -1)
	{
		displayMessageArray = [
			{
				sender: "server",
				message: "Ce client n'existe pas",
				date: "09:30"
			},
		];
	}
	else
	{
		const msgRoom = users[userActiveIndex].msgRoom;
		let i;

		i = 0;
		while (msgRoom.length)
		{
			if (msgRoom[i].id === activeId)
			{
				displayMessageArray = msgRoom[i].content;
				break;
			}
			i++;
		}
		if (i === msgRoom.length)
		{
			//dispatch(setKindOfConversation("privateMessage"));
			dispatch(setActiveConversationId(activeId));
			displayMessageArray = [
				{
					sender: "server",
					message: "Conversation with " + activeId,
					date: "09:30"
				},
			];
		}
	}
	return (
		<>
			<List
				sx={{
					height: "70vh",
					overflowY: "auto"
				}}
			>
				{
					displayMessageArray.map((elem, key) =>
					{
						return (
							<MessageItem
								key={key}
								date={elem.date}
								sender={elem.sender as "me" | "other" | "server"}
								message={elem.message}
							/>
						);
					})
				}
			</List>
		</>
	);
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
	let	uniqueId: string;

	const	style = useTheme();
	const	dispatch = useAppDispatch();
	const	chatConnected = useAppSelector((state) =>
	{
		return (state.controller.user.chat.connected);
	});
	const	numberOfChannels = useAppSelector((state) =>
	{
		return (state.controller.user.chat.numberOfChannels);
	});
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
		openPasswordDialog,
		setOpenPasswordDialog
	] = useState(false);

	const [
		channelMembers,
		setChannelMembers
	] = useState<MembersModel[]>([]);

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

	// const
	// [
	// 	kindOfConversation,
	// 	setKindOfConversation
	// ] = useState("");

	const joiningChannelNameRef = useRef(joiningChannelName);

	const	createNewChannel = () =>
	{
		// TEST
		console.log("chatLayout 433: ", kindOfConv);
		console.log(" activeId: ", activeId);
		const action = {
			type: "create-channel",
			payload: {
				chanName: channelName,
				chanMode: selectedMode,
				chanPassword: chanPassword,
				chanId: channels.length + 1,
				activeId: activeId,
				kind: kindOfConv
			}
		};
		dispatch(setNumberOfChannels(channels.length));
		console.log(" 2 chatLayout 433: ", kindOfConv);
		console.log(" 2 chanName: ", action.payload.chanName);
		socketRef.current?.emit("channel-info", action);
	};

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

	const handleSave = () =>
	{
		console.log("layout 469: ", kindOfConv);
		setKindOfConversation("channel");
		dispatch(setKindOfConversation("channel"));
		// Check if Channel name is empty
		if (channelName.trim() === "")
		{
			alert("Channel name cannot be empty");
			return;
		}

		// Check if at least one radio option is selected
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
		// Close the dialog
		createNewChannel();
		handleClose();
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
			// setTimeout(() =>
			// {
			// 	socket.emit("info", action);
			// }, 1000);
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
				uniqueId = data.payload.uniqueId;
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
			// dispatch(setMessageContent(data.payload.messageContent));
			console.log("test send Message: ", data);
		};

		const	updateMessages = (data: any) =>
		{
			console.log("current ref: " + currentChannelRef.current);
			console.log("current payload: " + data.payload.chanName);
			if (data.payload.chanName === currentChannelRef.current)
			{
				setChanMessages(data.payload.messages);
			}
		};

		const	channelInfo = (data: any) =>
		{
			if (data.type === "confirm-is-inside-channel")
			{
				if (data.payload.isInside === "")
				{
					dispatch(setCurrentChannel(data.payload.chanName));
					// console.log("test received from server: " + data.payload.chanName);
					console.log("test channel info: " + currentChannelRef.current);
					setChanMessages(data.payload.chanMessages);
				}
				else
					alert(data.payload.isInside);
			}
			if (data.type === "display-members")
			{
				setChannelMembers(data.payload.memberList);
				console.log("members: " + data.payload.memberList);
			}
		};

		const	leftChannelMessage = (data: any) =>
		{
			if (data.type === "left-channel")
			{
				setChanMessages([]);
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
        });
    }, []);

	useEffect(() =>
	{
		currentChannelRef.current = currentChannel;
		joiningChannelNameRef.current = joiningChannelName;
	}, [
		currentChannel,
		joiningChannelName
	]);

	const handlePasswordSubmit = (password: string) =>
	{
		const	action = {
			type: "password-for-protected",
			payload: {
				password: password,
				chanName: joiningChannelName,
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) =>
	{
		setValue(newValue);
	};

	const handleChangeIndex = (index: number) =>
	{
		setValue(index);
	};

	const refreshListUser = () =>
	{
		// if (chatConnected === false)
		// {
		const action = {
			type: "get-user-list",
		};
		socketRef.current?.emit("info", action);
		// 	console.log("request data from server", connected);
		// 	dispatch(setChatConnected(true));
		// }
		console.log("refresh the list of user");
	};

	const customButtonStyle = {
		// padding: "4px 8px",
		fontSize: "12px",
		margin: "0 8px",
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
		// MessagesArea(text);
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

	const	leaveChannel = (chanName: string) =>
	{
		const	action = {
			type: "leave-channel",
			payload: {
				chanName: chanName,
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	// FOR THE OPTIONS NEXT TO CHANNEL NAME:

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

	const handleLeaveButtonClick = (chanId: number, chanName: string) =>
	{
		leaveChannel(chanName);
		handleDialogClose();
	};

	const handleRemoveButtonClick = (chanId: number, chanName: string) =>
	{
		removeChannel(chanId, chanName);
		handleDialogClose();
	};

	// END OF OPTIONS NEXT TO CHANNEL NAME

	// SHOW MEMBERS FUNCTIONS:
	const [
		membersOpen,
		setMembersOpen
	] = useState(false);

	const handleMembersClickOpen = (chanName: string) =>
	{
		setMembersOpen(true);
		const	action = {
			type: "member-list",
			payload: {
				chanName: chanName,
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	const handleMembersClose = () =>
	{
		setMembersOpen(false);
	};

	// END OF MEMBERS
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
									</div>
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
									channels.map((channel: any) =>
									{
										return (
											<ListItem style={listItemStyle} key={channel.id}>
												<ListItemText
													style={
														channel.name === currentChannel
														? { color: "red" }
														: listItemTextStyle
													}
													primary={channel.name}
													onClick={() =>
													{
														setKindOfConversation("channel");
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
															return handleJoinButtonClick(channel.mode, channel.name);
														}}>
															Join
														</Button>
														<Button onClick={() =>
														{
															return handleLeaveButtonClick(channel.id, channel.name);
														}}>
															Leave
														</Button>
														<Button onClick={() =>
														{
															return handleRemoveButtonClick(channel.id, channel.name);
														}}>
															Remove
														</Button>
														<Button onClick={() =>
														{
															return handleMembersClickOpen(channel.name);
														}}>Members</Button>
														<Dialog open={membersOpen} onClose={handleMembersClose} maxWidth="sm" fullWidth>
															<DialogTitle>
																Channel Members
															</DialogTitle>
															<DialogContent>
																<ul>
																	{
																		channelMembers.map((member) =>
																		{
																			return (<li key={member.id}>{member.name}</li>);
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
																handlePasswordSubmit(userPassword);
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
				</Grid>
				<Grid item xs={9}>
					<TabPanel
						area={true}
						value={value}
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
						area={true}
						value={value}
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
