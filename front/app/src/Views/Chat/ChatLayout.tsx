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
	// setKindOfConversation,
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
									// dispatch(setKindOfConversation("privateMessage"));
									createNewConv(elem.id);
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
			// dispatch(setKindOfConversation("privateMessage"));
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

	// END OF USE STATEs

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

	const	createNewChannel = () =>
	{
		const action = {
			type: "create-channel",
			payload: {
				chanName: channelName,
				chanMode: selectedMode,
				chanPassword: chanPassword,
				chanId: channels.length + 1,
				pmIndex: privateMessage.length + 1,
				activeId: activeId,
				kind: kindOfConversation
			}
		};
		dispatch(setNumberOfChannels(channels.length));
		socketRef.current?.emit("channel-info", action);
	};

	const	removeChannel = (chanId: number, chanName: string) =>
	{
		const	action = {
			type: "destroy-channel",
			payload: {
				name: chanName,
				id: chanId,
				kind: kindOfConversation
			}
		};
		socketRef.current?.emit("channel-info", action);
	};

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
				kind: kindOfConversation
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
				setUniqueId(data.payload.uniqueId);
			}

			if(data.type === "add-new-channel")
			{
				if (data.payload.kind === "channel")
					setChannels(data.payload.chanMap);
				if (data.payload.kind === "privateMessage")
					setPrivateMessage(data.payload.privateMessageMap);
				setKindOfConversation(data.payload.kind);
				// dispatch(setKindOfConversation(data.payload.kind));
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
    }, [
		// dispatch,
		// joinChannel,
		// kindOfConversation
	]);

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
		// MessagesArea(text);
	};

	const	goToChannel = (chanName: string, kind: string) =>
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

	// MEMBERS FUNCTION (BAN, KICK, ADD TO FRIENDS, BLOCK, MUTE)

	const	kickUserFromChannel = (userName: string, chanName: string) =>
	{
		const	action = {
			type: "kick-member",
			payload: {
				userName: userName,
				chanName: chanName,
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	const	banUserFromChannel = (userName: string, chanName: string) =>
	{
		const	action = {
			type: "ban-member",
			payload: {
				userName: userName,
				chanName: chanName,
			}
		};
		socketRef.current.emit("channel-info", action);
	};

	const	addUserToFriends = (userName: string) =>
	{
		const	action = {
			type: "add-friend",
			payload: {
				friendName: userName,
			}
		};
		socketRef.current.emit("user-info", action);
	};

	const	addUserToBlocked = (userName: string) =>
	{
		const	action = {
			type: "block-user",
			payload: {
				blockedName: userName,
			}
		};
		socketRef.current.emit("user-info", action);
	};

	const	muteUserInChannel = (userName: string, chanName: string) =>
	{
		const	action = {
			type: "mute-user",
			payload: {
				chanName: chanName,
				userName: userName,
			}
		};
		socketRef.current.emit("user-info", action);
	};

	// END OF MEMBERS FUNCTIONS

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
														channel.name === currentChannelRef.current
														? { color: "red" }
														: listItemTextStyle
													}
													primary={channel.name}
													onClick={() =>
													{
														setKindOfConversation("channel");
														return (goToChannel(channel.name, "channel"));
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
																	channelMembers.map((member) =>
																	{
																		return (<li key={member.id}>
																				{member.name}
																				{isChannelAdmin && member.name !== uniqueId && (
																				<>
																					<Button onClick={() =>
																					{
																						kickUserFromChannel(member.name, channel.name);
																						handleMembersClose();
																					}}>
																						Kick
																					</Button>
																					<Button onClick={() =>
																					{
																						banUserFromChannel(member.name, channel.name);
																					}}>
																						Ban
																					</Button>
																					<Button onClick={() =>
																					{
																						muteUserInChannel(member.name, channel.name);
																					}}>
																						Mute
																					</Button>
																				</>)}
																				{member.name !== uniqueId && (
																				<>
																					<Button onClick={() =>
																					{
																						addUserToFriends(member.name);
																					}}>
																						Add friend
																					</Button>
																					<Button onClick={() =>
																					{
																						addUserToBlocked(member.name);
																					}}>
																						Block
																					</Button>
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
										// setKindOfConversation("privateMessage");
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
														return (goToChannel(channel.name, "privateMessage"));
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
