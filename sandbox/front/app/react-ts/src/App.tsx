
// https://mui.com/material-ui/customization/dark-mode/
// eslint-disable-next-line max-len
// https://dev.to/collins87mbathi/reactjs-protected-route-m3j#:~:text=To%20create%20a%20protected%20route,redirected%20to%20the%20login%20page. 
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";
import MainRouter from "./Router";

import {
	Alert,
	Backdrop,
	LinearProgress,
	Typography
} from "@mui/material";
import Theme from "./Theme";


const	LoadingOverlay = () =>
{
	const	useDispatch = useAppDispatch();
	const	isFetching = useAppSelector((state) =>
	{
		return (state.controller.isFetching);
	});

	const	connexionEnabled = useAppSelector((state) =>
	{
		return (state.controller.server.connexionEnabled);
	});

	if (connexionEnabled === false)
	{
		// set connexion status
	}

	return (
		<Backdrop
			sx={
			{
				color: "#fff",
				zIndex: (theme) =>
				{
					return (theme.zIndex.drawer + 1);
				}
			}}
			open={isFetching}
		>
			<Alert
				severity="info"
			>
				<LinearProgress color="inherit" />
				<Typography
					sx={
					{
						mt: 1,
						fontSize: "0.7rem"
					}}
				>
					Connexion au serveur en cours
				</Typography>
			</Alert>
		</Backdrop>
	);
};

const App = () =>
{
	const theme = Theme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LoadingOverlay/>
			<MainRouter />
		</ThemeProvider>
	);
};

export default App;
