
// eslint-disable-next-line max-len
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainRouter from "./Router";

import Theme from "./Theme";
import ConnectionState from "./components/ConnectionState";

const App = () =>
{
	const theme = Theme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MainRouter />
			<ConnectionState />
		</ThemeProvider>
	);
};

export default App;
