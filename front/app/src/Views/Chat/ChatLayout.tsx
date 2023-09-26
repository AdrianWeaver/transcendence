/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import {
	AppBar,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Divider,
	Fab,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemTextProps,
	MenuItem,
	Paper,
	Select,
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

const URL = "http://localhost:3000";
import SendIcon from "@mui/icons-material/Send";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useTheme } from "@emotion/react";
import { CSSProperties, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { Socket, io } from "socket.io-client";

// please use vector this one is just for testing card
import pong from "./assets/pong.jpeg";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { addMessage, setActiveConversationId, setChatConnected, setChatUsers, setMessageRoom } from "../../Redux/store/controllerAction";
import { MessageModel, MessageRoomModel } from "../../Redux/models/redux-models";

// invite
const InvitationCard = () => {
	const theme = useTheme();
	return (
		<Card sx={{
			display: "flex",
			justifyContent: "flex-start",
			backgroundColor: theme.palette.background.default,
			width: "40%",
		}}>
			<Box sx={
				{
					display: "flex",
					flexDirection: "column"
				}
			}>
				<CardContent sx={{ flex: "1 0 auto" }}>
					<Typography component="div" variant="h5">
						Play Pong with me
					</Typography>
					<Typography variant="subtitle1" color="text.secondary" component="div">
						A slot is reserved between John Wick and you
					</Typography>
				</CardContent>
				<Box sx={
					{
						display: "flex",
						pl: 1,
						pb: 1
					}}
				>
					{/* <IconButton aria-label="previous">
						{theme.direction === "rtl" ? <SkipNextIcon /> : <SkipPreviousIcon />}
					</IconButton> */}
					<IconButton aria-label="play/pause">
						<PlayArrowIcon sx={{
							height: 38,
							width: 38
						}} />
					</IconButton>
					{/* <IconButton aria-label="next">
						{theme.direction === "rtl" ? <SkipPreviousIcon /> : <SkipNextIcon />}
					</IconButton> */}
				</Box>
			</Box>
			<CardMedia
				component="img"
				sx={{ width: 200 }}
				image={pong}
				alt="Live from space album cover"
			/>
		</Card>
	);
};

// chat part 
interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
	style?: CSSProperties;
	area?: boolean;
}

const ChannelsList = () => {
	return (
		<>
			channel list here, you can follow FriendsList component
			<br />
			<Button variant="contained" color="success"> onClick={createNewChannel}
				NEW
			</Button>
		</>
	);
};

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;
	let animationSettings;

	// this is a switch I added to change animation type on left | right view
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

// can be used to display the list of friends
const CurrentlyTalkingFriend = () => {
	const currentlyTalkingFriendDataFake = {
		name: "John Wick",
		avatar: "https://material-ui.com/static/images/avatar/1.jpg",
	};

	return (
		<List>
			<ListItem
				button
				key={currentlyTalkingFriendDataFake.name}
			>
				<ListItemIcon>
					<Avatar
						alt={currentlyTalkingFriendDataFake.name}
						src={currentlyTalkingFriendDataFake.avatar}
					/>
				</ListItemIcon>
				<ListItemText primary={currentlyTalkingFriendDataFake.name}>
				</ListItemText>
			</ListItem>
		</List>
	);
};

type FriendItemProps = {
	name: string;
	avatar?: string;
	online?: boolean;
	key?: number;
};
const FriendItem = (props: FriendItemProps) => {
	const status = props.online ? "online 💚" : "🔴";

	return (
		<ListItem
			button
			key={props.key}
		>
			<ListItemIcon>
				<Avatar
					alt={props.name}
					src={props.avatar}
				/>
			</ListItemIcon>
			<ListItemText primary={props.name}>
				{props.name}
			</ListItemText>
			<ListItemText
				secondary={status}
				sx={{ align: "right" }}
			>
			</ListItemText>
		</ListItem>
	);
};

type FriendsListProps = {
	arrayListUsers: []
};

const FriendsList = (props: FriendsListProps) => {
	const socketTest = useRef<SocketIOClient.Socket | null>(null);
	let friendList: any[];
	const dispatch = useAppDispatch();
	const users = useAppSelector((state) => {
		return (state.controller.user.chat.users);
	});

	const sendMsg = (id: string) => {
		const action = {
			type: "sending-message"
		};
		console.log("sendMsg function called with id ", id);
		// socketTest.current?.emit("send-message", action);
	};

	const displayConversationWindow = (id: string) => {
		const action = {
			type: "display-conversation",
			payload:
			{
				id: id
			}
		};
		socketTest.current?.emit("display-conversation", action);
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
					users.map((elem, index) => {
						return (
							<>
								<div onClick={() => {
									displayConversationWindow(elem.id);
									dispatch(setActiveConversationId(elem.id));
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

// the next line interface is here to remove the typeScript errordeclare module '@mui/material/ListItemText'
declare module "@mui/material/ListItemText"
{
	interface ListItemTextProps {
		align?: "left" | "center" | "right";
	}
}

type MessageItemProps = {
	key?: number,
	align?: ListItemTextProps,
	sender: "me" | "other" | "server",
	message: string,
	date: string
};

const MessageItem = (props: MessageItemProps) => {
	let align: "right" | "center" | "left" | undefined;

	switch (props.sender) {
		case "me":
			align = "right";
			break;
		case "other":
			align = "left";
			break;
		case "server":
			align = "center";
			break;
		default:
			align = "center";
			break;
	}
	if (props.message === "!play pong" && props.sender === "server")
		return (
			<ListItem key={props.key}>
				<Grid container>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							color="primary"
						>
							<InvitationCard />
						</ListItemText>
					</Grid>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							secondary={props.date}
						>
						</ListItemText>
					</Grid>
				</Grid>
			</ListItem>
		);
	else
		return (
			<ListItem key={props.key}>
				<Grid container>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							color="primary"
							primary={props.message}
						>
						</ListItemText>
					</Grid>
					<Grid item xs={12}>
						<ListItemText
							align={align}
							secondary={props.date}
						>
						</ListItemText>
					</Grid>
				</Grid>
			</ListItem>
		);
};

const MessagesArea = () => {
	let displayMessageArray;

	displayMessageArray = [
		{
			index: 0,
			sender: "server",
			message: "Initialize",
			date: "09:30"
		},
	];

	const users = useAppSelector((state) => {
		return (state.controller.user.chat.users);
	});

	const activeId = useAppSelector((state) => {
		return (state.controller.user.chat.activeConversationId);
	});
	const userActiveIndex = users.findIndex((elem) => {
		return (elem.id === activeId);
	});
	if (userActiveIndex === -1) {
		displayMessageArray = [
			{
				sender: "server",
				message: "Ce client n'existe pas",
				date: "09:30"
			},
		];
	}
	else {
		const msgRoom = users[userActiveIndex].msgRoom;
		let i;

		i = 0;
		while (msgRoom.length) {
			if (msgRoom[i].id === activeId) {
				displayMessageArray = msgRoom[i].content;
				break;
			}
			i++;
		}
		if (i === msgRoom.length) {
			displayMessageArray = [
				{
					sender: "server",
					message: "Aucune conversation active",
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
					displayMessageArray.map((elem, key) => {
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

const SendingArea = () =>
{
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
		console.log("Text typed:", text);
	};

	return (
		<>
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
		</>
	);
};

const a11yProps = (index: any) => {
	return (
		{
			id: `action-tab-${index}`,
			"aria-controls": `action-tabpanel-${index}`,
		}
	);
};

const ChatLayout = () => {
	const style = useTheme();
	const dispatch = useAppDispatch();
	const chatConnected = useAppSelector((state) => {
		return (state.controller.user.chat.connected);
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

	const [
		selectedMode,
		setSelectedMode
	] = useState("");

	const [
		formValid,
		setFormValid
	] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
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
	const handleSave = () => {
		// Check if Channel name is empty
		if (channelName.trim() === "") {
			alert("Channel name cannot be empty");
			return;
		}

		// Check if at least one radio option is selected
		if (![
			"Public",
			"Protected",
			"Private"
		].includes(selectedMode)) {
			alert("Please select a mode (Public, Protected, or Private)");
			return;
		}

		if (selectedMode === "Protected" && chanPassword.trim() === "") {
			alert("There must be a password for a protected channel");
			return;
		}

		// Close the dialog
		setOpen(false);
	};

	const socketRef = useRef<SocketIOClient.Socket | null>(null);

	useEffect(() => {
		const socket = io(URL,
			{
				autoConnect: false,
				reconnectionAttempts: 5,
			});

		socketRef.current = socket;

		const connect = () => {
			setConnected(true);
			// setTimeout(() =>
			// {
			// 	socket.emit("info", action);
			// }, 1000);
		};

		const disconnect = () => {
			setConnected(false);
		};


		const connectError = (error: Error) => {
			console.error("ws_connect_error", error);
		};

		const serverInfo = (data: any) => {
			dispatch(setChatUsers(data.payload.arrayListUsers));
			console.log("information from server: ", data);
			// setArrayListUser(data.payload.arrayListUser);
		};

		const sendMessageToUser = (data: any) => {
			const msgRoom: MessageRoomModel[] = [
				{
					roomName: data.payload.msgRoom.roomName,
					privateConv: data.payload.msgRoom.privateConv,
					content: data.payload.msgRoom.messageContent
				}
			];
			dispatch(setMessageRoom(msgRoom, data.payload.sender));
			// dispatch(setMessageContent(data.payload.messageContent));
			console.log("test send Message: ", data);
		};

		socket.on("connect", connect);
		socket.on("disconnect", disconnect);
		socket.on("error", connectError);
		socket.on("info", serverInfo);
		socket.on("send-message", sendMessageToUser);
		socket.connect();

		return (() => {
			socket.off("connect", connect);
			socket.off("disconnect", disconnect);
			socket.off("error", connectError);
			socket.off("info", serverInfo);
			socket.off("sending-message", sendMessageToUser);
		});
	}, []);

	const createNewChannel = () => {
		const action = {
			type: "create-channel",
			payload: {
				chanName: channelName,
				chanMode: selectedMode,
				chanPassword: chanPassword,
			}
		};
		socketRef.current?.emit("create-channel", action);
		setChannelName("");
		setSelectedMode("");
		setChanPassword("");
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index: number) => {
		setValue(index);
	};

	const refreshListUser = () => {
		// if (chatConnected === false)
		// {
		const action = {
			type: "get-user-list"
		};
		socketRef.current?.emit("info", action);
		// 	console.log("request data from server", connected);
		// 	dispatch(setChatConnected(true));
		// }
		console.log("refresh the list of user");
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
								style={{ fontSize: "8px" }}
							/>
							<Tab
								label="Direct Message"
								{...a11yProps(1)}
								style={{ fontSize: "8px" }}
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
							channel list here, you can follow FriendsList component
							<br />
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
										onChange={(e) => {
											setChannelName(e.target.value);
										}}
									/>
									<br />
									<div>
										<input
											type="radio"
											id="option1"
											name="answerOption"
											value="Public"
											checked={selectedMode === "Public"}
											onChange={() => setSelectedMode("Public")}
										/>
										<label htmlFor="option1">Public</label>
									</div>
									<div>
										<input
											type="radio"
											id="option2"
											name="answerOption"
											value="Protected"
											checked={selectedMode === "Protected"}
											onChange={() => setSelectedMode('Protected')}
										/>
										<label htmlFor="option2">Protected</label>
									</div>
									<div>
										<input
											type="radio"
											id="option3"
											name="answerOption"
											value="Private"
											checked={selectedMode === "Private"}
											onChange={() => setSelectedMode("Private")}
										/>
										<label htmlFor="option3">Private</label>
									</div>
									<input
										type="text"
										placeholder="Password (if protected)"
										value={chanPassword}
										onChange={(e) => setChanPassword(e.target.value)}
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
						</div>
					</TabPanel>
					<TabPanel
						area={false}
						value={value}
						index={1}
						dir={style.direction}
						style={style}
					>
						<FriendsList arrayListUsers={arrayListUser} />
					</TabPanel>
				</Grid>
				{/* left side of the screen  */}
				<Grid item xs={9}>
					{/* when value == 0  */}
					<TabPanel
						area={true}
						value={value}
						index={0}
						dir={style.direction}
						style={style}
					>
						{/* // Just a placeholder */}
						<Outlet />
					</TabPanel>

					{/* when value == 1 */}
					<TabPanel
						area={true}
						value={value}
						index={1}
						dir={style.direction}
						style={style}
					>
						<MessagesArea />
					</TabPanel>

					<Divider />

					<Grid
						container
						// style={{padding: '20px'}}
						sx={{ padding: "20px" }}
					>
						<SendingArea />
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default ChatLayout;
