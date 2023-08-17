/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

// Dev-note: Testing import component
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

// Dev-note: dispatch to make action
// Dev-note: appSelector to get State from store
import
{
	useAppDispatch,
	useAppSelector
}	from "../../../Redux/hooks/redux-hooks";

// actions from redux 
import
{
	setThemeModeToDark,
	setThemeModeToLight
}	from "../../../Redux/store/controllerAction";

/**
 * This is a test component for button switching theme
 * You can implement some component from mui :)
 * from redux by action (use redux dev tools 
 * to have better understanding of structs)
 */
const	TestComponent = () =>
{
	const	dispatch = useAppDispatch();
	const	controllerState = useAppSelector((state) =>
	{
		return (state.controller);
	});

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
		</>
	);
};


export default TestComponent;
