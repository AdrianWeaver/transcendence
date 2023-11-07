/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Avatar, Badge, Button, Grid, Typography } from "@mui/material";
import MyAvatar from "./MyAvatar";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { useNavigate } from "react-router-dom";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	imageUrl: string,
	defaultUrl: string,
	prevPage: string;
};


const	LeftSide = (props: LeftSideProps) =>
{
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	navigate = useNavigate();

	const	previous = props.prevPage === "/me/profile" ? "/" : props.prevPage;

	const	handleLeaveProfile = () =>
	{
		navigate("/the-chat/");
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
						(user.profile.myView)
						? <>
							♡ {props.pseudo}'s profile ♡
						</>
						: <Typography>
							{
								(user.profile.publicView)
								? <>
									<Typography style={{color: "green"}}>
										{props.pseudo}
									</Typography>
									<Typography style={{color: "green"}}>
										___________________
									</Typography>
								</>
								: <>
									{props.pseudo} is {props.status}
								</>
							}
						</Typography>
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
