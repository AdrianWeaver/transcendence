/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
// import { Info } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
// import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { setProfileEditView } from "../../../Redux/store/controllerAction";
// import EditProfile from "./EditProfile";
// import Stats from "./Stats";
import { useNavigate } from "react-router-dom";
// import { blue } from "@mui/material/colors";
import { BackUserModel, ChatUserModel } from "../../../Redux/models/redux-models";
import axios from "axios";
import { ElectricMopedOutlined } from "@mui/icons-material";

type	RightSideProps =
{
	profileId: string;
	isMe: boolean;
}

const	RightSide = (props: RightSideProps) =>
{
	let		chatUserSelected: ChatUserModel | undefined;
	let		userSelected: BackUserModel | undefined;
	const	dispatch = useAppDispatch();
	const	navigate = useNavigate();
	const	userMe = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const	chatUsers = useAppSelector((state) =>
	{
		return (state.controller.user.chat.users);
	});
	const	users = useAppSelector((state) =>
	{
		return (state.controller.allUsers);
	});
	if (!props.isMe)
	{
		chatUserSelected = chatUsers.find((elem) =>
		{
			return (props.profileId === elem.profileId);
		});
		if (chatUserSelected === undefined)
			throw new Error("User doesnt exist");

		userSelected = users.find((elem) =>
		{
			return (props.profileId.toString() === elem.id.toString());
		});
		// if (userSelected === undefined)
		// 	throw new Error("User doesnt exist");
	}
	console.log("Les users sont ils bien la ?", users);
	

	const	editRequest = () =>
	{
		dispatch(setProfileEditView());
	};

	const	displayStats = () =>
	{
		if (props.isMe)
			navigate("/my-stats");
		else
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
						EDIT PROFILE
					</Button>
					: (!userMe.chat.currentProfileIsFriend)
						? <Grid item xs={12}>
							<Typography>
								________________
								__________________
								___________________
							</Typography>
						</Grid>
						: (userSelected !== undefined)
							? <>
								{
									(userSelected?.firstName !== "undefined" && userSelected.lastName !== "undefined")
									? <> {userSelected?.firstName} {userSelected?.lastName}  </>
									: <></>
								}
								♡ 
								{
									userSelected?.location
									? <> {userSelected.location} </>
									: <></>
								}
							</>
							: <></>
				}
			</Grid>
		</div>
		</>
	);
};

export default RightSide;
