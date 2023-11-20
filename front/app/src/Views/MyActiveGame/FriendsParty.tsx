/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions
} from "@mui/material";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import ButtonRemoveGame from "./ButtonRemoveGame";
import GamePreview from "./GamePreview";

const	FriendsParty = () =>
{
	const	arrayGameFriends = useAppSelector((state) =>
	{
		return (state.gameEngine.myGameActive.friend);
	});

	return (
		<Container sx={{ py: 8 }} maxWidth="md">
			<Typography
				component="h2"
				variant="h3"
				align="center"
				color="text.primary"
				gutterBottom
			>
				Parties entre amis
			</Typography>
			<Grid container spacing={4}>
			{
				arrayGameFriends.map((game: any, index: number) =>
				{
					const	userConnected = game.userConnected;
					const	gameMode = game.gameMode;
					const	uuid = game.uuid;
					const	roomName = game.roomName;
					const	playerOne = game.playerOne;
					const	playerTwo = game.playerTwo;
					const	board = game.board;
					const 	loop = game.loop;
					const	ball = game.ball;
					const	revoked = game.revoked;

					const	score = game.playerOne.score
						+ ":" + game.playerTwo.score;
					// check doublon dans les loop et GameServe
					let elapsedTime;
					if (loop.frameNumber === 0)
						elapsedTime = "aucun";
					else
					{
						elapsedTime
							= loop.frameNumber / loop.frameRate + " sec.";
					}
					let userOneAvatar;
					if (playerOne.profileId !== "undefined")
						userOneAvatar = playerOne.profilePicture;
					else
						userOneAvatar = 'http://localhost:3000/cdn/image/profile/default.png';
					let userTwoAvatar;
						if (playerTwo.profileId !== "undefined")
							userTwoAvatar = playerTwo.profilePicture;
						else
							userTwoAvatar = 'http://localhost:3000/cdn/image/profile/default.png';
					console.log("please use correct call to URL :) ",
						userOneAvatar + " " + userTwoAvatar);
					console.log(game);
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
											image={userOneAvatar}
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
											image={userTwoAvatar}
										/>
									</ Grid>
								</ Grid>
								<GamePreview
									ball={ball}
									board={board}
									playerOne={playerOne}
									playerTwo={playerTwo}
								/>
								<CardContent sx={{ flexGrow: 1 }}>
									<Typography
										gutterBottom
										variant="h5"
										component="h2"
									>
										Instance: {roomName} <br />
									</Typography>
									<Typography>
										Partie en mode: "{gameMode}"
										<br />
										Score : {score}
										<br />
										Temps passe en jeu : {elapsedTime}
										<br />
										Joueur dans le salon : {userConnected}
									</Typography>
								</CardContent>
								<CardActions>
									<ButtonJoinParty
										playerOne={playerOne}
										playerTwo={playerTwo}
									/>
									<ButtonRemoveGame
										uuid={uuid}
										revoked={revoked}
									/>
								</CardActions>
							</Card>
						</Grid>
					);
				})
			}
			</Grid>
		</Container>
	);
};

export default FriendsParty;
