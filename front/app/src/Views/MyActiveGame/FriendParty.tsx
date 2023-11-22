/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import {
    Container,
    Typography,
} from "@mui/material";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import ItemCard from "./ItemCard";

const	FriendParty = () =>
{
	const	friendArray = useAppSelector((state) =>
	{
		return (state.gameEngine.myGameActive.friend);
	});

	let	pausedParty;
	let	playingParty;
	let	invitedParty;

	if (friendArray.disconnected.length !== 0)
	{
		pausedParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					Partie en pause<br/>
				</Typography>
				<ItemCard
					array={friendArray.disconnected}
				/>
			</>
		);
	}
	else
	{
		pausedParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					Pas de partie en pause<br/>
				</Typography>
			</>
		);
	}
	if (friendArray.connected.length === 0)
	{
		playingParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					<br />Pas de partie en cours<br/>
				</Typography>
			</>
		);
	}
	else
	{
		playingParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					<br />Partie en cours de jeux<br/>
				</Typography>
				<ItemCard
					array={friendArray.connected}
				/>
			</>
		);
	}
	if (friendArray.invited.length === 0)
	{
		invitedParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					<br />Pas d'invitations<br/>
				</Typography>
			</>
		);
	}
	else
	{
		invitedParty = (
			<>
				<Typography
					component="h4"
					variant="h5"
					align="center"
					color="text.primary"
					gutterBottom
				>
					<br />Mes invitations<br/>
				</Typography>
				<ItemCard
					array={friendArray.invited}
				/>
			</>
		);
	}
	return (
		<Container sx={{ py: 8 }} maxWidth="md">
			{pausedParty}
			{playingParty}
			{invitedParty}
		</Container>
	);
};

export default FriendParty;
