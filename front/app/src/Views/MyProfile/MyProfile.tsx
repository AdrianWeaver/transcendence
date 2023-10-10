/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { Component, useEffect, useRef, useState } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import Title from "./components/Title";
import data from "./realFakeData.json";
import { ConstructionSharp } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import "./assets/index.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { io } from "socket.io-client";

type	FriendsModel =
{
	id: number,
	name: string
}

type FriendsMapModel = {
    id: number,
    name: string,
	blocked: boolean
};

const	MyProfile = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	socketRef = useRef<SocketIOClient.Socket | null>(null);
	const	activeId = useAppSelector((state) =>
	{
		return (state.controller.user.chat.activeConversationId);
	});
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	// console.log(data);
	let	ft, online, status, playing, rank, gamesPlayed, victories, defeats, perfectGame;
	let	id, lastName, firstName, login, email, active, avatar;

	ft = true;
	const	displayStyle: React.CSSProperties = {
		textAlign: "center",
		fontSize: "8px"
	};

	if (user !== undefined)
	{
		console.log("avatar : ", user.avatar);
		id = user.id;
		lastName = user.lastName;
		firstName = user.firstName;
		login = user.username;
		email = user.email;
		avatar = user.avatar;
		rank = 25;
		gamesPlayed = 250;
		victories = 19;
		defeats = 122151;
		perfectGame = 3;
	}
	else if (data !== undefined)
	{
		id = data.id;
		lastName = data.last_name;
		firstName = data.first_name;
		login = data.login;
		email = data.email;
		avatar = data.image;
		rank = 5;
		gamesPlayed = 20;
		victories = 9;
		defeats = 11;
		perfectGame = 3;
	}
	else
	{
		id = "undefined";
		lastName = "undefined";
		firstName = "undefined";
		login = "undefined";
		email = "undefined";
		active = undefined;
		avatar = "https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg";
		rank = 5;
		gamesPlayed = 20;
		victories = 9;
		defeats = 11;
		perfectGame = 3;
	}

	const [
		friendsOpen,
		setFriendsOpen
	] = useState(false);

	const
	[
		friends,
		setFriends
	] = useState<FriendsModel[]>([]);

	const [
		buttonSelection,
		setButtonSelection
	] = useState<FriendsMapModel>({
		id: 0,
		name: "",
		blocked: false,
	});

	const [
		uniqueId,
		setUniqueId
	] = useState("");

	const [
		inviteDialogOpen,
		setInviteDialogOpen
	] = useState(false);

	const [
		channelToInvite,
		setChannelToInvite
	] = useState("");

	const
	[
		pseudo,
		setPseudo
	] = useState("");

	if (active !== undefined)
		online = "🟢";
	else
		online = "🔴";

	useEffect(() =>
	{
		// const socket = io(URL,
		// {
		// 	autoConnect: false,
		// 	reconnectionAttempts: 5,
		// });

		// socketRef.current = socket;
		savePrevPage("/me/profile");
	});

	const handleFriendsClickOpen = (userId: string) =>
	{
		setFriendsOpen(true);
		const	action = {
			type: "friends-list",
			payload: {
				userId: userId,
			}
		};
		socketRef.current.emit("my-profile-info", action);
	};

	const handleFriendsClose = () =>
	{
		setFriendsOpen(false);
	};

	const	removeFriend = (userName: string) =>
	{
		const	action = {
			type: "remove-friend",
			payload: {
				userName: userName,
			}
		};
		socketRef.current.emit("my-profile-info", action);
	};

	const	blockFriend = (userName: string) =>
	{
		const	action = {
			type: "block-user",
			payload: {
				userName: userName,
			}
		};
		socketRef.current.emit("user-info", action);
	};

	const	addUserToFriends = () =>
	{
		const	action = {
			type: "add-friend",
			payload: {
				friendName: activeId,
			}
		};
		socketRef.current.emit("user-info", action);
	};

	const	addFriendsToBlocked = (userName: string) =>
	{
		const	action = {
			type: "block-friends-list",
			payload: {
				blockedName: userName,
			}
		};
		socketRef.current.emit("my-profile-info", action);
	};

	const	inviteFriendToChannel = (userName: string) =>
	{
		console.log("friend: " + userName);
		console.log("channel : " + channelToInvite);
		const	action = {
			type: "invite-member",
			payload: {
				chanName: channelToInvite,
				userName: userName,
			}
		};
		socketRef.current.emit("user-info", action);
		// setChannelToInvite("");
	};

	const	changePseudo = (newPseudo: string) =>
	{
		if (newPseudo === pseudo)
			return ;
		// TEST NEED TO VERIFY IT'S NOT USED PSEUDO
		setPseudo(newPseudo);
	};

	changePseudo(login);
// TEST
	playing = true;
	if (!online)
		playing = false;
	if (playing === true)
		status = "playing... 🏓";
	else if (active)
		status = "🟢";
	else
		status = "🔴";
		// console.log(status);
	return (
		<>

			<MenuBar />
			<Title
				name={pseudo}
			/>
			<Button onClick={addUserToFriends} variant="outlined">ADD AS FRIEND
			</Button>
			<div className="wrapper">
				<Grid container>
						<Grid item xs={6}>
								<LeftSide
									status={status}
									pseudo={pseudo}
									imageUrl={avatar.link}
									defaultUrl="https://thispersondoesnotexist.com/"
								/>
						</Grid>
						<Grid item xs={6}>
								<RightSide
									rank={rank}
									gamesPlayed={gamesPlayed}
									victories={victories}
									defeats={defeats}
									perfectGame={perfectGame}
									lastName={lastName}
									firstName={firstName}
								/>
						</Grid>
				</Grid>
			</div>
			{/* <Button onClick={() =>
			{
				return handleFriendsClickOpen(buttonSelection.name);
			}}>
				Friends
			</Button> */}
			{/* <Dialog open={friendsOpen} onClose={handleFriendsClose} maxWidth="sm" fullWidth>
				<DialogTitle>
					Friends of {pseudo}
				</DialogTitle>
					 <DialogContent>
					<ul>
					{
						friends.map((friend) =>
						{
							return (<li key={friend.id}>
									{friend.name}
									{friend.name !== uniqueId && (
									<>
										<Button onClick={() =>
										{
											removeFriend(friend.name);
											handleFriendsClose();
										}}>
											Remove from friends
										</Button>
									</>)}
									{friend.name !== uniqueId && (
									<>
										<Button onClick={() =>
										{
											addUserToFriends(friend.name);
										}}>
											Add friend
										</Button>
										<Button onClick={() =>
										{
											addFriendsToBlocked(friend.name);
										}}>
											Block
										</Button>
										<Button onClick={() =>
										{
											setInviteDialogOpen(true);
											// inviteUserToChannel(friend.name);
										}}>
											Invite to a chan
										</Button>
										<Dialog open={inviteDialogOpen} onClose={() =>
											{
												setInviteDialogOpen(false);
											}}
											maxWidth="sm" fullWidth>
											<DialogTitle>Invite friend to Channel</DialogTitle>
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
														inviteFriendToChannel(friend.name);
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
					<Button onClick={handleFriendsClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog> */}
		</>
	);
};

export default MyProfile;
