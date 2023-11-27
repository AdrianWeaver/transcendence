/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Button, Grid, Typography } from "@mui/material";
import MyAvatar from "./MyAvatar";
// import { useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { setAllUsers, setProfileEditView } from "../../../Redux/store/controllerAction";
import { BackUserModel, ChatUserModel } from "../../../Redux/models/redux-models";

type	LeftSideProps =
{
	status: string | undefined,
	pseudo: string | undefined,
	imageUrl: string | undefined,
	defaultUrl: string,
	prevPage: string;
	isMe: boolean;
	isFriend: boolean;
	profileId: string | undefined;
};


const	LeftSide = (props: LeftSideProps) =>
{
	const	navigate = useNavigate();
	const	dispatch = useAppDispatch();
	let		chatUserSelected: ChatUserModel | undefined;
	let		userSelected: BackUserModel | undefined;
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

		userSelected = users.find((elem) =>
		{
			return (props.profileId?.toString() === elem.id.toString());
		});
		if (userSelected === undefined)
		{
			dispatch(setAllUsers());
			userSelected = users.find((elem) =>
			{
				return (props.profileId?.toString() === elem.id.toString());
			});
		}
	}
	const	handleLeaveProfile = () =>
	{
		if (!props.isMe)
			navigate(props.prevPage);
		else
			navigate("/");
	};

	const	editRequest = () =>
	{
		dispatch(setProfileEditView());
	};
	return (
		<div className="left">
			<Grid container>
				<Grid item xs={12} sm ={6}>
					<MyAvatar
						pseudo={props.pseudo}
						defaultUrl={props.defaultUrl}
						imageUrl={props.imageUrl} />
				</Grid>
				<Grid item xs={12} sm={6}>
					♡
				</Grid>
				<Grid item xs={12}>
					{
						(props.isMe)
						? <Grid item xs={12}>
							<Typography>
								{userMe.firstName} {userMe.lastName}
							</Typography>
						</Grid>
						: <></>
					}
					{
						(props.isMe)
						? <>
							<Typography></Typography>
								♡ {props.pseudo}'s profile ♡
							<Typography>
								♡♡♡
							</Typography>
						</>
						: (!props.isFriend)
							? <>
										
								<Typography style={{color: "green"}}>
									_______________
								</Typography>
									{props.pseudo}
								<Typography style={{color: "green"}}>
									___________________
									___________________
									___________________
									___________________
								</Typography>
							</>
							: (userSelected === undefined)
								? <></>
								: <>
									<Grid item xs={12}>
										<Typography>
											{userSelected.firstName}  {userSelected.lastName}
										</Typography>
									</Grid>
									<Typography style={{color: "green"}}>
										___________________
										___________________
									</Typography>
									<Grid item xs={12}>
										<Typography>
											{props.pseudo} is {props.status}
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography>
											{userSelected.location}
										</Typography>
									</Grid>
								</>
							}
					{
						(props.isMe)
						? <Button onClick={editRequest}>
							EDIT PROFILE
						</Button>
						: <></>
					}
				</Grid>
					<button className="leaveProfile__btn"
						onClick={handleLeaveProfile} style={{backgroundColor: "grey"}}>
							Leave profile
					</button>
			</Grid>
		</div>
	);
};

export default LeftSide;
