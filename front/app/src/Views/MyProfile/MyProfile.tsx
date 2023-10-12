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
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { io } from "socket.io-client";
import EditProfile from "./components/EditProfile";
import { setProfileEditView, setProfileMyView } from "../../Redux/store/controllerAction";
import { addUserToFriends } from "../Chat/actionsSocket/addUserToFriends";

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
	const	dispatch = useAppDispatch();
	const	prevPage= useAppSelector((state) =>
	{
		return (state.controller.previousPage);
	});

	const	oldPrevPage = prevPage;
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
	let	online, status, playing, rank, gamesPlayed, victories, defeats, perfectGame;
	let	id, lastName, firstName, login, email, active, avatar;

	// const	displayStyle: React.CSSProperties = {
	// 	textAlign: "center",
	// 	fontSize: "8px"
	// };

	if (user !== undefined)
	{
		id = user.id;
		lastName = user.lastName;
		firstName = user.firstName;
		login = user.username;
		email = user.email;
		console.log("avatar ", user.avatar);
		if (user.avatar?.link)
			avatar = user.avatar?.link;
		else if (user.avatar === undefined)
			avatar = "https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg";
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
		avatar = data.image?.link;
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

	const	editOrFriendRequest = () =>
	{
		// if (user.profile.publicView)
		// 	addUserToFriends();
		// else
			dispatch(setProfileEditView());
		console.log("edit view: ", user.profile.editView);
		console.log("friend view", user.profile.friendView);
		console.log("public view", user.profile.publicView);
		console.log("my view: ", user.profile.myView);
	};

	return (
		<>

			<MenuBar />
			<Title
				name={pseudo}
				prevPage={oldPrevPage}
			/>
			{
				(user.profile.editView)
				? 	<EditProfile />
				: <div className="wrapper">
					<Grid container>
						<Grid item xs={12} sm={6}>
								<LeftSide
									status={status}
									pseudo={pseudo}
									imageUrl={avatar}
									defaultUrl="https://pbs.twimg.com/profile_images/956695054126665728/0zl_Ejq2_400x400.jpg"
								/>
						</Grid>
						<Grid item xs={12} sm={6}>
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
					<Button onClick={editOrFriendRequest} variant="outlined">
						{
							(user.profile.publicView)
							? "ADD AS FRIEND"
							: "EDIT PROFILE"
						}
					</Button>
				</div>

			}
		</>
	);
};

export default MyProfile;
