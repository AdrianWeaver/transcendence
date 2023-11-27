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
import { getAchievements, getMyStats } from "../../Redux/store/controllerAction";
import Achievements from "./Achievements";

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
		field: "avatar",
		headerName: "avatar",
		renderCell: (params) =>
		{
			return (
				<Avatar
					alt={params.row.avatar}
					src={params.row.avatar}/>
				);
		}
	},
	{
		field: "achievement",
		headerName: "achievement",
		type: "string"
	},
];

const	HistoryTable = () =>
{
	const	rowStats = useAppSelector((state) =>
	{
		return (state.controller.achievements);
	});
	if (rowStats.length === 0)
	{
		return (
			<>No achievements (YET)</>
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
	const	handleRefresh = () =>
	{
		dispatch(getAchievements("myself"));
	}
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
						My Achievements
					</Typography>
					<Typography
						variant="h5"
						align="center"
						color="text.secondary"
						paragraph
					>
						Here are all (or none of) my achievements
					</Typography>
					<Stack
						sx={{ pt: 4 }}
						direction="row"
						spacing={2}
						justifyContent="center"
					>
						<Button
							variant="contained"
							onClick={handleRefresh}>
							Refresh
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

const	MyAchievements = () =>
{
	const	savePrevPage = useSavePrevPage();
	const	dispatch = useAppDispatch();
	const	controller = useAppSelector((state)=>
	{
		return (state.controller);
	})
	useEffect(() =>
	{
		savePrevPage("/my-achievements");
		dispatch(getAchievements("myself"));
	}, []);
	
	return (
		<>
			<MenuBar />
			<Header />
			<HistoryTable />
			<></>
		</>
	);
};

export default MyAchievements;
