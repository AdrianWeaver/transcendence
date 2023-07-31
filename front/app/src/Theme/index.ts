import	createTheme from "@mui/material/styles/createTheme";

// Get data from the store redux.
import	{ useAppSelector } from "../Redux/hooks/redux-hooks";

// Transform all href on the theme to link, for Single Page App rules(SPA)
import behaviourLinkOption from "./BehaviourLinkOption";

const	darkTheme = createTheme(
{
	palette:
	{
		mode: "dark",
	},
	// custom theme style here
	components: behaviourLinkOption.components
});

const	lightTheme = createTheme(
{
	palette:
	{
		mode: "light",
	},
	// custom theme style here
	components: behaviourLinkOption.components
});

const	Theme = () =>
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
	return (usedTheme);
};

export default Theme;
