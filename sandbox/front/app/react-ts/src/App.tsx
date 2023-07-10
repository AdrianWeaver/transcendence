
// https://mui.com/material-ui/customization/dark-mode/
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppSelector } from "./hooks/redux-hooks";
import ReduxViewTest from "./components/ReduxViewTest";

const	darkTheme = createTheme(
{
	palette:
	{
		mode: "dark",
	},
});

const	lightTheme = createTheme(
{
	palette:
	{
		mode: "light",
	}
});

const App = () =>
{
	let		usedTheme;
	const	themeSelection = useAppSelector((state) =>
	{
		return (state.controller.themeMode);
	});

	if (themeSelection === "dark")
		usedTheme = darkTheme;
	else
		usedTheme = lightTheme;
	return (
		<ThemeProvider theme={usedTheme}>
			<CssBaseline />
			<ReduxViewTest />
		</ThemeProvider>
	);
};

export default App;
