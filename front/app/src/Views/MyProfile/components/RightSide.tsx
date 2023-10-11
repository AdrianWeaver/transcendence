/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Info } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks/redux-hooks";
import { setProfileEditView } from "../../../Redux/store/controllerAction";
import EditProfile from "./EditProfile";

type	RightSideProps =
{
	rank: number,
	gamesPlayed: number,
	victories: number,
	defeats: number,
	perfectGame: number,
	lastName: string,
	firstName: string
};

const	RightSide = (props: RightSideProps) =>
{
	let	editOrFriendReq;
	const	dispatch = useAppDispatch();

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
		if (publicProfile)
			editOrFriendReq = "ADD AS FRIEND";
		else
		{
			editOrFriendReq = "EDIT PROFILE";
			dispatch(setProfileEditView());
		}
	};

	perfectPlay(props.perfectGame);
	return (
		<>
		<div className="right">
			<Grid container>
				<Grid item xs={12}>
					<Typography variant="h5">
						INFOS
					</Typography>
					<Typography>
						{props.firstName} {props.lastName}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography>
						__________________
						{/* __________________ */}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">
						STATS
					</Typography>
					<Typography>
						{props.victories} victories / {props.gamesPlayed} games played.
					</Typography>
					<Typography>
						{perfect}
					</Typography>
				</Grid>
				<Button onClick={editOrFriendRequest} variant="outlined">
					{
						(publicProfile)
						? "ADD AS FRIEND"
						: "EDIT PROFILE"
					}
				</Button>
			</Grid>
		</div>
		</>
	);
};

export default RightSide;
