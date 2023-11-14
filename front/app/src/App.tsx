/* eslint-disable max-statements */
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import { loadEnv } from "vite";
// I omit intentionnaly index.ts "./Theme" will try "./Theme/index" if exists
import Theme from "./Theme";
import MainRouter from "./Router/MainRouter";
import ConnectionState from "./Component/ConnectionState";
import { useAppDispatch } from "./Redux/hooks/redux-hooks";
import { setServerLocation } from "./Redux/store/serverAction";
import Configuration from "./Configuration";

const	App = () =>
{
	const	theme = Theme();
	const	hostname = window.location.hostname;
	const	protocole = window.location.protocol;
	const	dispatch = useAppDispatch();

	dispatch(setServerLocation(protocole, hostname));
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MainRouter />
			<ConnectionState />
		</ThemeProvider>
	);
};

export default App;
