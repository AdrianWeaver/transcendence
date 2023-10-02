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

import { useTheme } from "@emotion/react";
import TabPanel from "./components/TabPanel";
import
{
	useAppDispatch,
	useAppSelector
}	from "../../Redux/hooks/redux-hooks";
import
{
	useState,

}	from "react";

import { setKindOfConversation, setNumberOfChannels } from "../../Redux/store/controllerAction";

const listItemStyle = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: "8px",
};

const listItemTextStyle = {
	flexGrow: 1,
};

type	LeftSideFirstPanelProps =
{
	socketRef: React.MutableRefObject<any>,
	currentChannelRef: React.MutableRefObject<any>
}

const	LeftSideFirstPanel = (props: LeftSideFirstPanelProps) =>
{
	const activeViewValue = useAppSelector((state) =>
	{
		return (state.chat.toolbarActiveView);
	});
	const	kindOfConv = useAppSelector((state) =>
	{
		return (state.controller.user.chat.kindOfConversation);
	});
	const	activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});
	const	style = useTheme();
	const	dispatch = useAppDispatch();

	const
	[
		open,
		setOpen
	] = useState(false);

	const
	[
		channelName,
		setChannelName
	] = useState("");

	const [
		channels,
		setChannels
	] = useState([]);


	const
	[
		selectedMode,
		setSelectedMode
	] = useState("");

	const
	[
		chanPassword,
		setChanPassword
	] = useState("");

	const [
		openPasswordDialog,
		setOpenPasswordDialog
	] = useState(false);

	const	handleClose = () =>
	{
		setChannelName("");
		setSelectedMode("");
		setChanPassword("");
		setOpen(false);
	};

	const [
		isDialogOpen,
		setIsDialogOpen
	] = useState(false);

	const [
		membersOpen,
		setMembersOpen
	] = useState(false);

	const handleDialogOpen = () =>
	{
		setIsDialogOpen(true);
	};

	const handleDialogClose = () =>
	{
		setIsDialogOpen(false);
	};

	const [
		isChannelAdmin,
		setIsChannelAdmin
	] = useState(false);
	
	const [
		joiningChannelName,
		setJoiningChannelName
	] = useState("");

	const [
		uniqueId,
		setUniqueId
	] = useState("");

	type MembersModel =
	{
		id: number,
		name:string
	}
	const [
		channelMembers,
		setChannelMembers
	] = useState<MembersModel[]>([]);

	const [
		userPassword,
		setUserPassword
	] = useState("");

	const	createNewChannel = () =>
	{
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
		props.socketRef.current?.emit("channel-info", action);
	};

	const	handleSave = () =>
	{
		// console.log("layout 469: ", kindOfConv);
		setKindOfConversation("channel");
		dispatch(setKindOfConversation("channel"));
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
		createNewChannel();
		handleClose();
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
		props.socketRef.current.emit("channel-info", action);
	};

	const handlePasswordSubmit = (password: string) =>
	{
		const	action = {
			type: "password-for-protected",
			payload: {
				password: password,
				chanName: joiningChannelName,
			}
		};
		props.socketRef.current.emit("channel-info", action);
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
		props.socketRef.current.emit("channel-info", action);
	};

	const	leaveChannel = (chanName: string) =>
	{
		const	action = {
			type: "leave-channel",
			payload: {
				chanName: chanName,
			}
		};
		props.socketRef.current.emit("channel-info", action);
	};

	const handleLeaveButtonClick = (chanId: number, chanName: string) =>
	{
		leaveChannel(chanName);
		handleDialogClose();
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
		props.socketRef.current?.emit("channel-info", action);
	};

	const handleRemoveButtonClick = (chanId: number, chanName: string) =>
	{
		removeChannel(chanId, chanName);
		handleDialogClose();
	};

	const handleMembersClickOpen = (chanName: string) =>
	{
		setMembersOpen(true);
		const	action = {
			type: "member-list",
			payload: {
				chanName: chanName,
			}
		};
		props.socketRef.current.emit("channel-info", action);
	};

	const handleMembersClose = () =>
	{
		setMembersOpen(false);
	};

	const	kickUserFromChannel = (userName: string, chanName: string) =>
	{
		const	action = {
			type: "kick-member",
			payload: {
				userName: userName,
				chanName: chanName,
			}
		};
		props.socketRef.current.emit("channel-info", action);
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
		props.socketRef.current.emit("channel-info", action);
	};

	const	addUserToFriends = (userName: string) =>
	{
		const	action = {
			type: "add-friend",
			payload: {
				friendName: userName,
			}
		};
		props.socketRef.current.emit("user-info", action);
	};

	const	addUserToBlocked = (userName: string) =>
	{
		const	action = {
			type: "block-user",
			payload: {
				blockedName: userName,
			}
		};
		props.socketRef.current.emit("user-info", action);
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
		props.socketRef.current.emit("user-info", action);
	};

	return (
		<>
			<TabPanel
				area="false"
				value={activeViewValue}
				index={0}
				dir={style.direction}
				style={style}
			>
				<div>
					<Button
						onClick={() =>
						{
							setOpen(true);
						}}
						variant="contained"
						color="success">
						NEW
					</Button>
					<Dialog
						open={open}
						onClose={handleClose}
					>
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
												channel.name === props.currentChannelRef.current
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
		</>
	);
};

export default LeftSideFirstPanel;