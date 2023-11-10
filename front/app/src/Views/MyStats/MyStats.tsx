/* eslint-disable max-lines-per-function */
import {
	Container,
	Typography,
	Stack,
	Button,
	Box
} from "@mui/material";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const	columns: GridColDef[] = [
	{
		field: "id",
		headerName: "Index",
		type: "number",
	},
	{
		field: "date",
		headerName: "Date",
		type: "string"
	},
	{
		field: "gameMode",
		headerName: "Game Mode",
		type: "string"
	},
	{
		field: "adversaire",
		headerName: "Adversaire",
		type: "string"
	},
	{
		field: "myScore",
		headerName: "My Score",
		type: "number"
	},
	{
		field: "advScore",
		headerName: "Adv. Score",
		type: "number"
	},
	{
		field: "elapsedTime",
		headerName: "Temps de jeu",
		type: "string"
	},

];

const fakeRows = [
	{
		id: 1,
		date: "Yesterday Night",
		gameMode: "classical",
		adversaire: "Adversaire 1 (username)",
		myScore: "7",
		advScore: "0",
		elapsedTime: "42 secondes",
	},
	{
		id: 2,
		date: "Yesterday ",
		gameMode: "classical",
		adversaire: "Adversaire 1 (username)",
		myScore: "7",
		advScore: "0",
		elapsedTime: "42 secondes",
	},
	{
		id: 3,
		date: "Yesterday Night",
		gameMode: "classical",
		adversaire: "Adversaire 1 (username)",
		myScore: "7",
		advScore: "0",
		elapsedTime: "42 secondes",
	},
];

const	HistoryTable = () =>
{
	return (
		<>
			<div
				style={{
					width: "100%",
				}}>
				<DataGrid
					rows={fakeRows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: {
								page: 0,
								pageSize: 10
							}
						}
					}}
					pageSizeOptions={[
						10,
						100
					]}
				/>
			</div>
		</>
	);
};


const	Header = () =>
{
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
						Statistiques
					</Typography>
					<Typography
						variant="h5"
						align="center"
						color="text.secondary"
						paragraph
					>
						C'est ici que tu retrouves ton historique des differentes parties jouees
					</Typography>
					<Stack
						sx={{ pt: 4 }}
						direction="row"
						spacing={2}
						justifyContent="center"
					>
						{/* <Button
							variant="contained"
							onClick={() =>
							{
								// dispatch(getMyActiveGame());
							}}>
							Rafraichir
						</Button>
						<Button variant="outlined">Secondary action</Button> */}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

const	MyStats = () =>
{
	const	savePrevPage = useSavePrevPage();

	savePrevPage("/my-stays");
	return (
		<>
			<MenuBar />
			<Header /> 
			<HistoryTable />
			<></>
		</>
	);
};

export default MyStats;
