/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Container,
	Typography,
	Stack,
	Button,
	Box,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid
} from "@mui/material";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import {
	getMyActiveGame,
	revokeGameWithUuid
} from "../../Redux/store/gameEngineAction";

const	Header = () =>
{
	const dispatch = useAppDispatch();

	return (
		<>
			<Box
				sx={{
					bgcolor: "background.paper",
					pt: 8,
					pb: 6,
				}}
			>
				<Container maxWidth="sm">
					<Typography
						component="h1"
						variant="h2"
						align="center"
						color="text.primary"
						gutterBottom
					>
						Mes Parties actives
					</Typography>
					<Typography
						variant="h5"
						align="center"
						color="text.secondary"
						paragraph
					>
						Un rapide coup d"oeil sur les parties en cours,
						Une seule partie random peut etre mise en attente :
						dans le cas ou un des joueurs reste dans la partie.
						Si les deux jouers ont quittes la partie,
						la game est effacee.<br />
						Les parties entres amis eux sont gardes jusqu"a la fin
						de la partie ou que l"un de vous abandonne.
					</Typography>
					<Stack
						sx={{ pt: 4 }}
						direction="row"
						spacing={2}
						justifyContent="center"
					>
						<Button
							variant="contained"
							onClick={() =>
							{
								dispatch(getMyActiveGame());
							}}>
							Rafraichir
						</Button>
						<Button variant="outlined">Secondary action</Button>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

type	GamePreviewProps = {
	playerOne: any;
	playerTwo: any;
	ball: any;
	board: any;
}

const	GamePreview = (props: GamePreviewProps) =>
{
	const	canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() =>
	{
		const	canvas = canvasRef.current;
		if (canvas)
		{
			const	ctx = canvas?.getContext("2d");
			const	width = canvas?.width as number;
			const	height = canvas?.height as number;
			const	bgColor = "white";

			if (ctx)
			{
				const	ratioX = width / props.board.dim.width;
				const	ratioY = height / props.board.dim.height;
				// console.log("ratio x and y", ratioX, ratioY);

				const ballPos = {
					x: props.ball.pos.x * ratioX,
					y: props.ball.pos.y * ratioY,
				};
				const playOnePos = {
					x: props.playerOne.pos.x * ratioX,
					y: props.playerOne.pos.y * ratioY
				};
				const playTwoPos = {
					x: props.playerTwo.pos.x * ratioX,
					y: props.playerTwo.pos.y * ratioY
				};
				const	racketDim = {
					width: props.playerOne.racket.dim.width * ratioX,
					height: props.playerOne.racket.dim.height * ratioY
				};
				const	ballRadius
					= props.ball.radius * ((ratioX + ratioY) / 2);
				// il s'agit la d'un instantane de la partie
				ctx.fillStyle = bgColor;
				ctx.fillRect(0, 0, width, height);
				ctx.fillStyle = "black";
				ctx.fillRect(
					playOnePos.x,
					playOnePos.y,
					racketDim.width,
					racketDim.height
				);
				ctx.fillRect(
					playTwoPos.x,
					playTwoPos.y,
					racketDim.width,
					racketDim.height
				);
				ctx.beginPath();
				ctx.arc(
					ballPos.x,
					ballPos.y,
					ballRadius,
					0,
					2 * Math.PI);
				ctx.fill();
			}
		}
	}, []);

	return (
		<>
			<CardMedia
				component="canvas"
				ref={canvasRef}
			/>
		</>
	);
};

// const cards = [];
const cardsAlone = [];


type ButtonJoinPartyProps = {
	playerOne: any;
	playerTwo: any;
};
const	ButtonJoinParty = (props: ButtonJoinPartyProps) =>
{
	const	myProfileId = useAppSelector((state) =>
	{
		return (state.controller.user.id);
	});
	let	amIConnected;
	let message;
	amIConnected = false;
	if (props.playerOne.profileId === myProfileId)
	{
		if (props.playerOne.socketId === "undefined")
		{
			message = "Commencer la partie";
		}
		else if (props.playerOne.socketId === "invited")
		{
			message = "Commencer la partie";
		}
		else if (props.playerOne.socketId === "disconnected")
		{
			message = "Votre adversaire vous attend";
		}
		else if (props.playerOne.socketId === "revoked")
		{
			message = "Fin de partie";
		}
		else
		{
			message = "Vous etes deja en partie";
			amIConnected = true;
		}
	}
	if (props.playerTwo.profileId === myProfileId)
	{
		if (props.playerTwo.socketId === "undefined") // must not be on friends
		{
			message = "Commencer la partie";
		}
		else if (props.playerTwo.socketId === "invited")
		{
			message = "Commencer la partie";
		}
		else if (props.playerTwo.socketId === "disconnected")
		{
			message = "Votre adversaire vous attend";
		}
		else if (props.playerTwo.socketId === "revoked")
		{
			message = "Fin de partie";
		}
		else
		{
			message = "Vous y jouez deja";
			amIConnected = true;
		}
	}
	let	render;
	if (amIConnected === true)
		render = <Button size="small" disabled={true}>{message}</Button>;
	else
		render = <Button size="small">Entrer en jeu</Button>;
	return (render);
};

type ButtonRemoveGameProps = {
	uuid: string;
	revoked: boolean
};

const	ButtonRemoveGame = (props: ButtonRemoveGameProps) =>
{
	const	dispatch = useAppDispatch();

	let	render;

	if (props.revoked)
	{
		render = (
			<Button
				size="small"
				onClick={() =>
				{
					// dispatch()
				}}
				disabled={props.revoked}
			>
				En cours de suppression
			</Button>
		);
	}
	else
	{
		render = (
			<Button
				size="small"
				onClick={() =>
				{
					dispatch(revokeGameWithUuid(props.uuid));
					dispatch(getMyActiveGame());
				}}
			>
				Supprimer
			</Button>
		);
	}

	return (
		render
	);
};

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

const	PrivateParty = () =>
{
	return (
		<Container sx={{ py: 8 }} maxWidth="md">
			<Typography
				component="h2"
				variant="h3"
				align="center"
				color="text.primary"
				gutterBottom
			>
				Partie random
			</Typography>
			<Grid container spacing={4}>
			{
				cardsAlone.map((card) =>
				{
					return (
						<Grid item key={card} xs={12} sm={6} md={4}>
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
											image="https://source.unsplash.com/random?wallpapers"
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
											image="https://source.unsplash.com/random?wallpapers"
										/>
									</ Grid>
								</ Grid>
								<GamePreview />
								<CardContent sx={{ flexGrow: 1 }}>
									<Typography
										gutterBottom
										variant="h5"
										component="h2"
									>
										Heading
									</Typography>
									<Typography>
										This is a media card.
										You can use this section to describe the
										content.
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Entrer en jeu</Button>
									<Button size="small">Supprimer</Button>
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

const	MyActiveGame = () =>
{
	return (
		<>
			<MenuBar />
			<Header />
			<FriendsParty />
			<PrivateParty />
		</>
	);
};

export default MyActiveGame;
