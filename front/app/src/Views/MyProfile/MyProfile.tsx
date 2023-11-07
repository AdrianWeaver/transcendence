/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { Component, useEffect, useRef, useState } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import Title from "./components/Title";
import data from "./realFakeData.json";
import { ConstructionSharp } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from "@mui/material";
import "./assets/index.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { io } from "socket.io-client";
import EditProfile from "./components/EditProfile";
import { addUserAsFriend, setProfileEditView, setProfileFriendView, setProfileMyView, setProfilePublicView } from "../../Redux/store/controllerAction";
import { addUserToFriends } from "../Chat/actionsSocket/addUserToFriends";
import { useNavigate } from "react-router-dom";
import UpdateMyProfilePicture from "../../Component/DropZoneImage/UpdateMyProfilePicture";

type	FriendsModel =
{
	id: number,
	name: string,
	profileId: string,
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
	let	isMe: boolean, isFriend: boolean;
	isMe = false;
	// isFriend = false;
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
	const	currentProfile = useAppSelector((state) =>
	{
		return (state.controller.user.chat.currentProfile);
	});
	console.log("CURRENT PROFILE", currentProfile);
	if (currentProfile === undefined)
		throw new Error("currentProfile undefine");
	const	userSelected = user.chat.users.find((elem) =>
	{
		return (elem.profileId === currentProfile);
	});
	if (userSelected === undefined)
		throw new Error("user profile doesnt exist");
	if (user.id.toString() === currentProfile)
		isMe = true;
	console.log(userSelected.name, "'s profile !!!");

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

	const	online = userSelected.online ? "🟢" : "🔴";

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
	// changePseudo(login);
	const	status = userSelected.status === "playing" ? "playing... 🏓" : online;


	const	editOrFriendRequest = () =>
	{
		if (user.profile.publicView)
		{
			// How can I get the friend Id ?
			dispatch(addUserAsFriend(user.id.toString(), activeId));
			console.log(activeId, " active id ", user.id, " id");
		}
		else if (user.profile.myView)
			dispatch(setProfileEditView());
		console.log("edit view: ", user.profile.editView);
		console.log("friend view", user.profile.friendView);
		console.log("public view", user.profile.publicView);
		console.log("my view: ", user.profile.myView);
	};

	return (
		<>
			<MenuBar />
			{
				(user.profile.editView)
				? 	<EditProfile
						setting={false} />
				: <div className="wrapper">
					<Grid container>
						<Grid item xs={12} sm={6}>
								<LeftSide
									status={status}
									pseudo={userSelected.name}
									imageUrl={userSelected.avatar}
									defaultUrl="https://thispersondoesnotexist.com/"
									prevPage={prevPage}
								/>
						</Grid>
						<Grid item xs={12} sm={6}>
								<RightSide
									profileId={userSelected.profileId}
									isMe={isMe}
									// isFriend={isFriend}
									/>
						</Grid>
					</Grid>
				</div>
			}
			<UpdateMyProfilePicture />
		</>
	);
};

export default MyProfile;
