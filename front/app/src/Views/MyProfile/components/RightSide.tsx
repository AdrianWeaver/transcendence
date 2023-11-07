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
import { ChatUserModel } from "../../../Redux/models/redux-models";

type	RightSideProps =
{
	profileId: string;
	isMe: boolean;
}

const	RightSide = (props: RightSideProps) =>
{
	let	userSelected: ChatUserModel | undefined;
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
	if (!props.isMe)
	{
		userSelected = users.find((elem) =>
		{
			return (props.profileId === elem.profileId);
		});
		if (userSelected === undefined)
			throw new Error("User doesnt exist");
	}

	const	editRequest = () =>
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
				{
					(props.isMe)
					? <Grid item xs={12}>
						<Typography variant="h5">
							INFOS
						</Typography>
						<Typography>
							{userMe.firstName}  {userMe.lastName}
						</Typography>
					</Grid>
					: <></>
				}
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
					? <Button onClick={editRequest}>
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
