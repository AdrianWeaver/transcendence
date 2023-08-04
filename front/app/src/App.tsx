/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// I omit intentionnaly index.ts "./Theme" will try "./Theme/index" if exists
import Theme from "./Theme";
import MainRouter from "./Router/MainRouter";

const	App = () =>
{
	const	theme = Theme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MainRouter />
		</ThemeProvider>
	);
};

export default App;
