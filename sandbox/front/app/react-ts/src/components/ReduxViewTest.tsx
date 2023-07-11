/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import
{
	setActiveView,
	setThemeModeToDark,
	setThemeModeToLight
} from "../store/controllerAction";

import MenuBar from "./MenuBar/MenuBar";

const ReduxViewTest = () =>
{
	const	dispatch = useAppDispatch();
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});

	const	changeView = () =>
	{
		dispatch(setActiveView("Another view"));
	};

	const	setDarkMode = () =>
	{
		if (controllerState.themeMode === "light")
			dispatch(setThemeModeToDark());
	};

	const	setLightMode = () =>
	{
		if (controllerState.themeMode === "dark")
			dispatch(setThemeModeToLight());
	};

	return (
		<>
			<MenuBar></MenuBar>
			<div>
				<h1>ReduxViewTest : {controllerState.activeView}</h1>
				<Button
					color="primary"
					onClick={changeView}
					variant="outlined"
				>
					Click to change view
				</Button>
			</div>
			<div>
				<ToggleButtonGroup
					color="primary"
					value={controllerState.themeMode}
					exclusive
					aria-label="change-theme-mode"
				>
					<ToggleButton
						value="light"
						onClick={setLightMode}
					>
						Light mode
					</ToggleButton>
					<ToggleButton
						value="dark"
						onClick={setDarkMode}
					>
						Dark mode
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
		</>
	);
};

export default ReduxViewTest;
