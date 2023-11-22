/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import {
    Container,
    Typography,
} from "@mui/material";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import ItemCard from "./ItemCard";

const	ClassicalParty = () =>
{
	const	classicalArray = useAppSelector((state) =>
	{
		return (state.gameEngine.myGameActive.classical);
	});

	let	pausedParty;
	let	playingParty;

	console.log(classicalArray);
	if (classicalArray.disconnected.length !== 0)
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
					array={classicalArray.disconnected}
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
				<ItemCard
					array={classicalArray.disconnected}
				/>
			</>
		);
	}
	if (classicalArray.connected.length === 0)
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
					array={classicalArray.connected}
				/>
			</>
		);
	}
	return (
		<Container sx={{ py: 8 }} maxWidth="md">
			{pausedParty}
			{playingParty}
		</Container>
	);
};

export default ClassicalParty;
