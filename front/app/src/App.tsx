/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import BaseViewFromViteJs from "./Views/BaseViewFromVitejs/BaseViewFromViteJs";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// I omit intentionnaly index.ts "./Theme" will try "./Theme/index" if exists
import Theme from "./Theme";

const	App = () =>
{
	const	theme = Theme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BaseViewFromViteJs />
		</ThemeProvider>
	);
};

export default App;
