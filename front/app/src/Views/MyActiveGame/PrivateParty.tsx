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

export default PrivateParty;
