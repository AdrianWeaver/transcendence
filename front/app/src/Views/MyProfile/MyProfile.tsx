/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

import data from "./realFakeData.json";
import { ConstructionSharp } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

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

	console.log(data);
	let	ft, online;
	let	id, lastName, firstName, login, email, url, active, avatar;

	ft = true;
	if (data !== undefined)
	{
		id = data.id;
		lastName = data.last_name;
		firstName = data.first_name;
		login = data.login;
		email = data.email;
		url = data.url;
		active = data["active?"];
		avatar = data.image;
	}
	else
	{
		id = "undefined";
		lastName = "undefined";
		firstName = "undefined";
		login = "undefined";
		email = "undefined";
		url = "undefined";
		active = undefined;
		avatar = "https://thispersondoesnotexist.com/";
	}

	if (active !== undefined)
		online = "🟢";
	else
		online = "🔴";

	useEffect(() =>
	{
		savePrevPage("/me/profile");
	});

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
		const	action = {
			type: "change-pseudo",
			payload: newPseudo
		};
		socketRef.current.emit("my-profile-info", action);
	};

	return (
		<>
			<MenuBar />
			<p>{"<Profile>"}</p>
			<p>ACTIVE : {online}</p>
			<p> <img src={avatar.link} width="90" height="90" /></p>
			<p>Last Name : {lastName}</p>
			<p>First Name : {firstName}</p>
			<p>pseudo : {pseudo}</p>
			<p>login : {login} (id:{id})</p>
			<p>email : {email}</p>
			{/* <a href= {url}>URL</a> */}

			<p></p>
			{/* <p><Button onClick={addAsFriend}>Add as friend</Button></p> */}
			<Button onClick={() =>
			{
				return handleFriendsClickOpen(buttonSelection.name);
			}}>
				Friends
			</Button>
			<Dialog open={friendsOpen} onClose={handleFriendsClose} maxWidth="sm" fullWidth>
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
			</Dialog>
		</>
	);
};

export default MyProfile;
