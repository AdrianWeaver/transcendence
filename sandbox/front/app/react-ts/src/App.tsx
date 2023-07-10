
// https://mui.com/material-ui/customization/dark-mode/
// eslint-disable-next-line max-len
// https://dev.to/collins87mbathi/reactjs-protected-route-m3j#:~:text=To%20create%20a%20protected%20route,redirected%20to%20the%20login%20page. 
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppSelector } from "./hooks/redux-hooks";

import { BrowserRouter, Route, Routes } from "react-router-dom";

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
			<BrowserRouter >
				<Routes>
					<Route path="/" element={<h1>Home</h1>} />
					<Route path="/redux-test-view" element={<ReduxViewTest/>} />
					<Route path="*" element={<h1>Error 404</h1>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
