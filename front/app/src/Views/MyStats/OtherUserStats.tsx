/* eslint-disable max-statements */
/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
import {
	Container,
	Typography,
	Stack,
	Button,
	Box,
	Avatar
} from "@mui/material";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { getMyStats } from "../../Redux/store/controllerAction";

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
		field: "myAvatar",
		headerName: "",
		renderCell: (params) =>
		{
			return (
				<Avatar
					alt={params.row.myAvatar}
					src={params.row.myAvatar}/>
				);
		}
	},
	{
		field: "adversaireAvatar",
		headerName: "",
		renderCell: (params) =>
		{
			return (
				<Avatar
					alt={params.row.adversaireAvatar}
					src={params.row.adversaireAvatar}/>
				);
		}
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

// const	fakeRows: any = [];

const	HistoryTable = () =>
{
	const	rowStats = useAppSelector((state) =>
	{
		return (state.controller.stats);
	});
	if (rowStats.length === 0)
	{
		return (
			<>Aucune partie jouee</>
		);
	}
	else
		return (
			<>
				<div
					style={{
						width: "100%",
					}}>
					<DataGrid
						rows={rowStats}
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
	const	dispatch = useAppDispatch();
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
						C'est ici que tu retrouves ton
						historique des differentes parties jouees
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
								// dispatch(getMyActiveGame());
								dispatch(getMyStats());
							}}>
							Rafraichir
						</Button>
						{/* 
							<Button variant="outlined">Secondary 
							action</Button>  */}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

const	Stats = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	dispatch = useAppDispatch();

	useEffect(() =>
	{
		dispatch(getMyStats());
	}, [dispatch]);
	savePrevPage("/profile/stats");
	return (
		<>
			<MenuBar />
			<Header />
			<HistoryTable />
			<></>
		</>
	);
};

export default Stats;
