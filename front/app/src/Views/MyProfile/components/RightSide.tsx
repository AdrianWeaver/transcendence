/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Info } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { setProfileEditView, setProfileFriendView, setProfilePublicView } from "../../../Redux/store/controllerAction";
import EditProfile from "./EditProfile";
// import Stats from "./Stats";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

type	RightSideProps =
{
	profileId: string;
	isMe: boolean;
}

const	RightSide = (props: RightSideProps) =>
{
	let	editOrFriendReq;
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	const	userMe = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const	users = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});
	const	userSelected = users.find((elem) =>
	{
		return (props.profileId === elem.profileId);
	});
	if (userSelected === undefined)
		throw new Error("User doesnt exist");
	// const	users = useAppSelector((state) =>
	// {
	// 	return (state.controller.allUsers);
	// });
	// const	userSelected = users.find((elem) =>
	// {
	// 	return (props.profileId === elem.id.toString());
	// });
	// if (userSelected === undefined)
	// 	throw new Error("User doesnt exist");

	const
	[
		publicProfile,
		setPublicProfile
	] = useState(false);

	const
	[
		perfect,
		setPerfect
	] = useState("");

	const
	[
		done,
		setDone
	] = useState("");

	const	perfectPlay = (match: number) =>
	{
		if (done === "done")
			return ;
		if (match > 0)
			setPerfect("Perfect games (7 - 0): " + match);
		setDone("done");
	};

	const	addUserToFriends = () =>
	{
		// const	action = {
		// 	type: "add-friend",
		// 	payload: {
		// 		friendName: activeId,
		// 	}
		// };
		// socketRef.current.emit("user-info", action);
	};

	const	editOrFriendRequest = () =>
	{
		if (!props.isMe)

			if (!userMe.chat.currentProfileIsFriend)
				dispatch(setProfilePublicView());
			else
				dispatch(setProfileFriendView());
		else
			dispatch(setProfileEditView());
	};

	const	displayStats = () =>
	{
		navigate("/stats");
	};

	return (
		<>
		<div className="right">
			<Grid container>
				{/* <Grid item xs={12}>
					<Typography variant="h5">
						INFOS
					</Typography>
					<Typography>
						{userSelected.firstName}
						{userSelected.lastName}
						{userSelected.location}
					</Typography>
				</Grid> */}
				<Grid item xs={12}>
					<Typography>
						___________________
						__________________
						_________________
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">
						STATS
					</Typography>
					<Button onClick={displayStats}>
						click to see the stats
					</Button>
				</Grid>
				{
					(props.isMe)
					? <Button onClick={editOrFriendRequest}>
						"EDIT PROFILE"
					</Button>
					: (!userMe.chat.currentProfileIsFriend)
						? <Grid item xs={12}>
							<Typography>
								________________
								__________________
								___________________
							</Typography>
						</Grid>
						: <></>
				}
			</Grid>
		</div>
		</>
	);
};

export default RightSide;
