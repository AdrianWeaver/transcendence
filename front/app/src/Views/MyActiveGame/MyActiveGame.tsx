/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Container,
	Typography,
	Stack,
	Button,
	Box,
	Tabs,
	Tab,
} from "@mui/material";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import {
	getMyActiveGame,
} from "../../Redux/store/gameEngineAction";
import ClassicalParty from "./ClassicalParty";
import { CSSProperties, SyntheticEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import UpsideDownParty from "./UpsideDownParty";
import FriendParty from "./FriendParty";

const	Header = () =>
{
	const dispatch = useAppDispatch();

	useEffect(() =>
	{
		dispatch(getMyActiveGame());
	}, []);

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

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
	style?: CSSProperties;
}


const TabPanel = (props: TabPanelProps) =>
{
	const { children, value, index, ...other } = props;

	const animationSettings = {
			type: "spring",
			duration: 0.3,
			scale: 0.6,
			stiffness: 0
		};

	return (
		<motion.div
			initial={
				{
					opacity: 0,
					scale: animationSettings.scale
				}}
			animate={{
				opacity: value === index ? 1 : 0,
				scale: value === index ? 1 : animationSettings.scale
			}}
			transition={
				{
					duration: animationSettings.duration,
					type: animationSettings.type,
					stiffness: 80,
				}}
			style={{ display: value === index ? "block" : "none" }}
		>
			<Typography
				component="div"
				role="tabpanel"
				hidden={value !== index}
				id={`action-tabpanel-${index}`}
				aria-labelledby={`action-tab-${index}`}
				{...other}
			>
				<Box sx={{ p: 3 }}>{children}</Box>
			</Typography>
		</motion.div>
	);
};

const	MyActiveGame = () =>
{
	const
	[
		mainValue,
		setMainValue
	] = useState(0);

	const	handleChange = (event: SyntheticEvent, newValue: number) =>
	{
		setMainValue(newValue);
	};

	return (
		<>
			<MenuBar />
			<Header />
			<Box
				sx={{
					width: "100%",
					bgcolor: "background.paper"
				}}
			>
				<Tabs
					value={mainValue}
					onChange={handleChange}
					centered
				>
					<Tab label="Classique aleatoire" />
					<Tab label="Upside Dolwn aleatoire" />
					<Tab label="Parties entres amis" />
				</Tabs>
			</Box>
			<TabPanel
				index={0}
				value={mainValue}
			>
				<ClassicalParty />
			</TabPanel>
			<TabPanel
				index={1}
				value={mainValue}
			>
				<UpsideDownParty />
			</TabPanel>
			<TabPanel
				index={2}
				value={mainValue}
			>
				<FriendParty />
			</TabPanel>
		</>
	);
};

export default MyActiveGame;
