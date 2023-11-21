/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button
} from "@mui/material";
import GamePreview from "./GamePreview";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { useNavigate } from "react-router-dom";
import { revokeGameWithUuid } from "../../Redux/store/gameEngineAction";

type	ItemCardModel =
{
	array: any[]
};

const	ItemCard = (props: ItemCardModel) =>
{
	const	navigate = useNavigate();
	const	dispatch = useAppDispatch();

	return (
		<Grid container spacing={4}>
		{
			props.array.map((game, index: number) =>
			{
				console.log("card", game);
				const	score = game.playerOne.score
					+ " - " + game.playerTwo.score;
				let	elapsedTime;
				if (game.loop.frameNumber === 0)
					elapsedTime = "aucun";
				else
				{
					elapsedTime
					= game.loop.frameNumber / game.loop.frameRate + " sec.";
				}
				return (
					<Grid item key={index} xs={12} sm={6} md={4}>
						<Card
							sx={{
								height: "100%",
								display: "flex",
								flexDirection: "column"
							}}
						>
							<Grid
								container
								sx={{
									flexDirection: "row",
									border: "1px solid blue"
								}}
							>
								{/* // player one  */}
								<Grid item xs={6}
									sx={{
										border: "1px solid blue"
									}}
								>
									<CardMedia
										component="div"
										sx={{
											// 16:9
											// pt: "56.25%",
											pt: "100%",
										}}
										image={game.playerOne.avatar}
									/>
								</ Grid>
								{/* // player Two */}
								<Grid item xs={6}
									sx={{
										border: "1px solid blue"
									}}
								>
									<CardMedia
										component="div"
										sx={{
											// 16:9
											// pt: "56.25%",
											pt: "100%",
										}}
										image={game.playerTwo.avatar}
									/>
								</ Grid>
							</ Grid>
							<GamePreview
								ball={game.ball}
								board={game.board}
								playerOne={game.playerOne}
								playerTwo={game.playerTwo}
							/>
							<CardContent sx={{ flexGrow: 1 }}>
								<Typography
									gutterBottom
									variant="h5"
									component="h2"
								>
									Instance: {game.roomName}
								</Typography>
								<Typography>
									Partie en mode: "{game.gameMode}"
									<br />
									versus: 
									 " {game.playerOne.username} - {game.playerTwo.username} "
									<br />
									Score : {score}
									<br />
									Temps passe en jeu : {elapsedTime}
									<br />
									Joueur dans la room : {game.userConnected}
								</Typography>
							</CardContent>
							<CardActions>
								<Button
									size="small"
									onClick={() =>
									{
										navigate("/test-ball");
									}}
								>
									Entrer en jeu
								</Button>
								<Button
									size="small"
									onClick={() =>
									{
										alert("note to dev : please fix my route")
										dispatch(revokeGameWithUuid(game.uuid));
									}}
								>
									Abandonner
								</Button>
							</CardActions>
						</Card>
					</Grid>
				);
			})
		}
		</Grid>);
};

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
