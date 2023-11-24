
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

import { useTheme } from "@emotion/react";
import
{
	Card,
	CardContent,
	Typography,
	IconButton,
	CardMedia,
	Box,
} from "@mui/material";

// please use vector this one is just for testing card
import pong from "../assets/pong.jpeg";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

type	InvitationCardProps = {
	message: string
};

const	InvitationCard = (props: InvitationCardProps) =>
{
	const navigate = useNavigate();
	const	theme = useTheme();
	const	message = props.message.split("!");
	if (message.length !== 3)
		return (<></>);
	const	playerOneId = message[0].split(":")[0];
	const	playerOne = message[0].split(":")[1];
	const	playerTwoId = message[1].split(":")[0];
	const	playerTwo = message[1].split(":")[1];
	const	gameUuid = message[2];

	const	isExistInAliveGame = true;

	const	activeGame = <>
		<CardContent sx={{ flex: "1 0 auto" }}>
			<Typography component="div" variant="h5">
				Play Pong with you
			</Typography>
			<Typography variant="subtitle1" color="text.secondary" component="div">
				A slot is reserved between {playerOne} and {playerTwo}
			</Typography>
		</CardContent>
	</>;

	const	endOfGame = <>
		<CardContent sx={{ flex: "1 0 auto" }}>
			<Typography component="div" variant="h5">
				Game over
			</Typography>
			<Typography variant="subtitle1" color="text.secondary" component="div">
				thank you for this fun moment
			</Typography>
		</CardContent>
	</>;

	const	handleClickCard = () =>
	{
		if (isExistInAliveGame)
			navigate("/test-ball?mode=friend&uuid=" + gameUuid);
	};


	return (
		<Card sx={{
			display: "flex",
			justifyContent: "flex-start",
			backgroundColor: theme.palette.background.default,
			width: "40%",
		}}>
			<Box sx={
				{
					display: "flex",
					flexDirection: "column"
				}
			}>
				{
					(isExistInAliveGame)
					? activeGame
					: endOfGame
				}
				<Box sx={
					{
						display: "flex",
						pl: 1,
						pb: 1
					}}
				>
					<IconButton
						aria-label="play/pause"
						onClick={() =>
						{
							handleClickCard();
							// diconnect socket chat in case of error
						}}
					>
						<PlayArrowIcon sx={{
							height: 38,
							width: 38
						}} />
					</IconButton>
				</Box>
			</Box>
			<CardMedia
				component="img"
				sx={{ width: 200 }}
				image={pong}
				alt="Live from space album cover"
			/>
		</Card>
	);
};

export default InvitationCard;
