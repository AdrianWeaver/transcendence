/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Container,
	Typography,
	Stack,
	Button,
	Box,
} from "@mui/material";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import {
	getMyActiveGame,
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


// const cards = [];
const cardsAlone = [];



const	MyActiveGame = () =>
{
	return (
		<>
			<MenuBar />
			<Header />
			{/* <FriendsParty /> */}
			{/* <PrivateParty /> */}
		</>
	);
};

export default MyActiveGame;
