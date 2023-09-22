/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import {
	AppBar,
	Avatar,
	Box,
	Divider,
	Fab,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemTextProps,
	Paper,
	Tab,
	Tabs,
	TextField,
	Toolbar,
	Typography
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useTheme } from "@emotion/react";
import { CSSProperties, useState } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
interface TabPanelProps
{
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
	style?: CSSProperties;
	area?: boolean;
}

const	ChannelsList = () =>
{
	return (
		<>
			channel list here, you can follow FriendsList component
		</>
	);
};

const TabPanel = (props: TabPanelProps) =>
{
	const	{ children, value, index, ...other } = props;
	let		animationSettings;

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
const	CurrentlyTalkingFriend = () =>
{
	const	currentlyTalkingFriendDataFake = {
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
const	FriendItem = (props: FriendItemProps) =>
{
	const status = props.online ? "online" : "";

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
				sx={{align: "right"}}
			>
			</ListItemText>
		</ListItem>
	);
};

const	FriendsList = () =>
{
	const	friendListDataFake = [
		{
			name: "John Wick",
			avatar: "https://material-ui.com/static/images/avatar/1.jpg",
			online: true,
		},
		{
			name: "Alice",
			avatar: "https://material-ui.com/static/images/avatar/3.jpg",
			online: false,
		},
		{
			name: "Cindy Baker",
			avatar: "https://material-ui.com/static/images/avatar/2.jpg",
			online: true,
		}
	];

	return (
		<>
			<CurrentlyTalkingFriend />
			<Divider />
			<Grid
				item
				xs={12}
				// style={{padding: '10px'}}
				sx={{padding: "10px"}}
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
					friendListDataFake.map((elem, index) =>
					{
						return (
							<FriendItem
								name={elem.name}
								avatar={elem.avatar}
								key={index}
								online={elem.online}
							/>
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
	interface ListItemTextProps
	{
		align?: "left" | "center" | "right";
	}
}

const	MessagesArea = () =>
{
	return (
		<>
			<List
				sx={{
					height: "70vh",
					overflowY: "auto"
				}}
			>
				<ListItem key="0">
					<Grid container>
						<Grid item xs={12}>
							<ListItemText
								align="center"
								color="primary"
								primary="ceci est le debut de la conversation"
							>
							</ListItemText>
						</Grid>
						<Grid item xs={12}>
							<ListItemText
								align="center"
								secondary="09:30"
							>
							</ListItemText>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem key="1">
					<Grid container>
						<Grid item xs={12}>
							<ListItemText
								align="right"
								primary="Hey man, What's up ?"
							>
							</ListItemText>
						</Grid>
						<Grid item xs={12}>
							<ListItemText
								align="right"
								secondary="09:30"
							>
							</ListItemText>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem key="2">
					<Grid container>
						<Grid item xs={12}>
							<ListItemText
								// sx={{align: "left"}}
								align="left"
								primary="Hey, Iam Good! What about you ?"
							>
							</ListItemText>
						</Grid>
						<Grid item xs={12}>
							<ListItemText
								// sx={{align: "left"}}
								align="left"
								secondary="09:31"
							>
							</ListItemText>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem key="3">
					<Grid container>
						<Grid item xs={12}>
							<ListItemText
								align="right"
								primary="Cool. i am good, let's catch up!"
							>
							</ListItemText>
						</Grid>
						<Grid item xs={12}>
							<ListItemText
								align="right"
								secondary="10:30"
							>
							</ListItemText>
						</Grid>
					</Grid>
				</ListItem>
			</List>
		</>
	);
};

const	SendingArea = () =>
{
	return (
		<>
			<Grid item xs={11}>
				<TextField id="outlined-basic-email" label="Type Something" fullWidth />
			</Grid>
			<Grid
				xs={1}
				sx={{alignItems: "right"}}
				// align="right"
			>
				<Fab color="primary" aria-label="add">
					<SendIcon />
				</Fab>
			</Grid>
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
	const	style = useTheme();
	const
	[
		value,
		setValue
	] = useState(0);

	const	handleChange = (event: React.SyntheticEvent, newValue: number) =>
	{
		setValue(newValue);
	};
	const	handleChangeIndex = (index: number) =>
	{
		setValue(index);
	};

	return (
		<div>
			<MenuBar />
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
					sx={{borderRight: "1px solid #e0e0e0"}}
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
								style={{fontSize: "8px"}}
							/>
							<Tab
								label="Direct Message"
								{...a11yProps(1)}
								style={{fontSize: "8px"}}
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
						<ChannelsList />
					</TabPanel>
					<TabPanel
						area={false}
						value={value}
						index={1}
						dir={style.direction}
						style={style}
					>
						<FriendsList />
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
						sx={{padding: "20px"}}
					>
						<SendingArea />
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default ChatLayout;
