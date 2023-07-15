
// https://mui.com/material-ui/customization/dark-mode/
// eslint-disable-next-line max-len
// https://dev.to/collins87mbathi/reactjs-protected-route-m3j#:~:text=To%20create%20a%20protected%20route,redirected%20to%20the%20login%20page. 
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";

import {
	BrowserRouter,
	Route,
	Routes,
	// https://mui.com/material-ui/guides/routing/
	Link as RouterLink,
	LinkProps as RouterLinkProp

} from "react-router-dom";

import ReduxViewTest from "./components/ReduxViewTest";
import Signup from "./components/Signup/Signup";
import Signin from "./views/Signin";
import Logout from "./views/Logout";
import { LinkProps } from "@mui/material/Link";
import React from "react";
import {
	Alert,
	Backdrop,
	LinearProgress,
	Typography
} from "@mui/material";

/**
 * This change the behaviour of link of Link and Button
 */
const	LinkBehaviour = React.forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProp, "to"> & {href : RouterLinkProp["to"]}
>((props, ref) =>
{
	const	{ href, ...other} = props;
	// Map href (Material UI) -> to (react-router)
	return <RouterLink ref={ref} to={href} {...other} />;
});

const	behaviourLinkOption = {
	components:
	{
		MuiLink:
		{
			defaultProps:
			{
				component: LinkBehaviour
			} as LinkProps,
		},
		MuiButtonBase:
		{
			defaultProps:
			{
				LinkComponent: LinkBehaviour
			},
		},
	}
};

const	darkTheme = createTheme(
{
	palette:
	{
		mode: "dark",
	},
	components: behaviourLinkOption.components
});

const	lightTheme = createTheme(
{
	palette:
	{
		mode: "light",
	},
	components: behaviourLinkOption.components
});

const	CustomRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route path="/" element={<h1>Home</h1>} />
				<Route path="/redux-test-view" element={<ReduxViewTest/>} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/logout" element={<Logout/>} />
				<Route path="*" element={<h1>Error 404</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

const	RegistrationRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route path="*" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	);
};

const	RegistrationRouting = () =>
{
	const	registrationStarted = useAppSelector((state) =>
	{
		return (state.controller.registration.startedRegister);
	});

	if (registrationStarted)
		return (<RegistrationRouter />);
	else
		return (<CustomRouter />);
};

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
			{/* <CustomRouter /> */}
			<LoadingOverlay/>
			<RegistrationRouting />
		</ThemeProvider>
	);
};

export default App;
