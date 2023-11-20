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
import { useAppSelector } from "../../Redux/hooks/redux-hooks";

type	ItemCardModel =
{
	array: any[]
};

const	ItemCard = (props: ItemCardModel) =>
{
	return (<Grid container spacing={4}>
		{
			props.array.map((card) =>
			{
				console.log("card", card);
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
							<GamePreview
								ball={card.ball}
								board={card.board}
								playerOne={card.playerOne}
								playerTwo={card.playerTwo}
							/>
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
		</Grid>);
};

const	UpsideDownParty = () =>
{
	const	upsideDownArray = useAppSelector((state) =>
	{
		return (state.gameEngine.myGameActive.upsideDown);
	});

	let	pausedParty;
	let	playingParty;

	if (upsideDownArray.disconnected.length !== 0)
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
					array={upsideDownArray.disconnected}
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
					array={upsideDownArray.disconnected}
				/>
			</>
		);
	}
	if (upsideDownArray.connected.length === 0)
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
					array={upsideDownArray.connected}
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

export default UpsideDownParty;
