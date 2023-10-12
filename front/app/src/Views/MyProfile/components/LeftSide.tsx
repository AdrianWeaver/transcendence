/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Avatar, Button, Grid, Typography } from "@mui/material";
import MyAvatar from "./MyAvatar";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	imageUrl: string | {
		link: string,
		version: {
			large: string,
			medium: string,
			micro: string,
			small: string
		}
	}
	defaultUrl: string
};


const	LeftSide = (props: LeftSideProps) =>
{
	let	statusView;
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const	getStatus = () =>
	{
		if (user.profile.myView)
			statusView = (
				<>
					Hello myself
				</>
			);
		else
			statusView = (
				<>
					{props.pseudo} is {props.status}
				</>
			);
		return (statusView);
	};

	return (
		<div className="left">
			<Grid container>
				<Grid item xs={12}>
					<MyAvatar
						pseudo={props.pseudo}
						defaultUrl={props.defaultUrl}
						imageUrl={props.imageUrl} />
				</Grid>
				<Grid item xs={12}>
					<Typography>
						{
							(user.profile.publicView)
							? <Typography variant="h6">
								{props.pseudo}
							</Typography>
							: (user.profile.myView)
								? <>
									♡ Hello myself ♡
								</>
								: <>
									{props.pseudo} is {props.status}
								</>
						}
					</Typography>
				</Grid>
			</Grid>
		</div>
	);
};

export default LeftSide;
