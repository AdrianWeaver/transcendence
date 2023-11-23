/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import {
	Grid,
	Card,
	CardMedia,
	CardContent,
	Typography,
	CardActions,
	Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import { revokeGameWithUuid } from "../../Redux/store/gameEngineAction";
import GamePreview from "./GamePreview";

export type	ItemCardModel =
{
	array: any[];
	gameMode: "classical" | "upside-down" | "friend";
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

				let	linkToPlayTheGame: string;
				switch (props.gameMode)
				{
					case "upside-down":
						linkToPlayTheGame = "/test-ball?mode=upside-down";
						break ;
					case "friend":
						linkToPlayTheGame = "/test-ball?mode=friend&uuid="
							+ game.uuid;
						break;
					case "classical":
					default:
						linkToPlayTheGame = "/test-ball?mode=classical";
						break ;
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
									// border: "1px solid blue"
								}}
							>
								{/* // player one  */}
								<Grid item xs={6}
									sx={{
										// border: "1px solid blue"
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
										// border: "1px solid blue"
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
										navigate(linkToPlayTheGame);
									}}
								>
									Entrer en jeu
								</Button>
								{/* <Button
									size="small"
									onClick={() =>
									{
										alert("note to dev : please fix my route game.uuid: ", game.uuid);
										console.log(game.uuid);
										dispatch(revokeGameWithUuid(game.uuid));
									}}
								>
									Abandonner
								</Button> */}
							</CardActions>
						</Card>
					</Grid>
				);
			})
		}
		</Grid>);
};

export default ItemCard;
