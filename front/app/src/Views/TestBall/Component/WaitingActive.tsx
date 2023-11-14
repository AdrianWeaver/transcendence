/* eslint-disable max-statements */
/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-lines-per-function */

import {
	Backdrop,
	Alert,
	Typography,
	Card,
	Box,
	CardContent,
	IconButton,
	Grid,
	Paper,
	Avatar
} from "@mui/material";

import { useTheme } from "@emotion/react";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CardMedia from "@mui/material/CardMedia";
import pong from "../assets/pong.jpeg";
import { useAppSelector } from "../../../Redux/hooks/redux-hooks";
import { useEffect, useState } from "react";

type DisplayUsersAvatarProps = {
	avatarPlayerOne: JSX.Element,
	avatarPlayerTwo: JSX.Element
};

const	DisplayUsersAvatar = (props: any) =>
{
	return (
		<>
			<Grid
				item
				xs={6}
				sx={{
					flex: "1 0 auto",
					// border: "1px solid blue"
				}}
			>
				{props.avatarPlayerOne}
			</Grid>
			<Grid
				item
				xs={6}
				sx={{
					flex: "1 0 auto",
					// border: "1px solid blue"
				}}
			>
				{props.avatarPlayerTwo}
			</Grid>
		</>
	);
};

type WaitingActiveProps = {
	connected: boolean,
	numberOfUser: number,
	disconnected: boolean
};

const	WaitingActive = (props: WaitingActiveProps) =>
{
	// use proper condition to set as false for start game
	const	devTestValue = true;

	const theme = useTheme();
	const numberOfUser = useAppSelector((state) =>
	{
		return (state.gameEngine.server.numberOfUser);
	});

	const
	[
		render,
		setRender
	] = useState(<></>);

	let title;

	const
	[
		description,
		setDescription
	] = useState("");

	const
	[
		userCount,
		setUserCount
	] = useState(0);

	const userOnePicture = useAppSelector((state) =>
	{
		return (state.gameEngine.server.playerOnePicture);
	});

	const userTwoPicture = useAppSelector((state) =>
	{
		return (state.gameEngine.server.playerTwoPicture);
	});
	const	statusConnected = useAppSelector((state) =>
	{
		return (state.gameEngine.meConnected);
	});

	const	avatarPlayerOne = (
		<Avatar
				src={userOnePicture}
				sx={{
					width: 100,
					height: 100
				}}
			/>
		);
	const	avatarPlayerTwo = (
		<Avatar
			src={userTwoPicture}
			sx={{
				width: 100,
				height: 100
			}}
		/>
	);

	let	avatars;
	let logos;

	if (props.disconnected !== undefined)
	{
		avatars = (
			<DisplayUsersAvatar
				avatarPlayerOne={avatarPlayerOne}
				avatarPlayerTwo={avatarPlayerTwo}
			/>
		);
		logos = (
			<Box sx={
				{
					display: "flex",
					pl: 1,
					pb: 1,
					// border: "1px solid red"
				}}
			>
				<IconButton aria-label="waiting">
					<HourglassBottomIcon sx={{
						height: 38,
						width: 38
					}} />
				</IconButton>
			</Box>
		);
		if (statusConnected === true)
		{
			title = "Partie Random";
		}
		else
		{
			title = "Deconnecte";
		}
	}
	else
	{
		avatars = <></>;
		logos = <></>;
		title = "Erreur";
	}
	useEffect(() =>
	{
		if (statusConnected === true)
		{
			setDescription("En attente d'un adversaire");
		}
		else
		{
			setDescription("Veillez rafraichir la page");
		}
		if (props.disconnected === undefined)
		{
			setDescription("Il semblerait que vous soyez connectee ailleur");
		}
	}, [statusConnected]);

	const	renderView = (
		<>
			<Backdrop
				sx={
				{
					color: "#fff",
					zIndex: (theme) =>
					{
						return (theme.zIndex.drawer + 1);
					}
				}}
				open={true}
			>
				<Card sx={{
					display: "flex",
					justifyContent: "flex-start",
					backgroundColor: theme.palette.background.default,
					// width: "80%",
				}}>
					<Box
						sx={
						{
							display: "flex",
							flexDirection: "column",
							// border: "1px solid red"
						}}>
						<Grid
							container
							component={Card}
							sx={{
								flexDirection: "row",
								pl: 1,
								pb: 1
							}}
						>
							<CardContent sx={{ flex: "1 0 auto" }}>
							<Grid
								item
								xs={12}
								sx={{
									flex: "1 0 auto",
									// border: "1px solid blue"
								}}
							>
								<Typography
									component="div"
									variant="h5"
								>
									{title}
								</Typography>
								<Typography
									variant="subtitle1"
									color="text.secondary"
									component="div">
									{description}
									{/* 
									<br	/>{props.playerTwoProfileId} */}
								</Typography>
							</Grid>
							</CardContent>
							{avatars}
						</Grid>
						{logos}
					</Box>
					<CardMedia
						component="img"
						sx={{ width: 200 }}
						image={pong}
						alt="Image de pong"
					/>
				</Card>
			</Backdrop>
		</>
	);

	return (renderView);
};

export default WaitingActive;
