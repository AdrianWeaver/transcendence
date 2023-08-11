import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// I omit intentionnaly index.ts "./Theme" will try "./Theme/index" if exists
import Theme from "./Theme";
import MainRouter from "./Router/MainRouter";
import ConnectionState from "./Component/ConnectionState";

const	App = () =>
{
	const	theme = Theme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MainRouter />
			<ConnectionState />
		</ThemeProvider>
	);
};

export default App;
