
import createTheme,
{
	ThemeOptions
} from "@mui/material/styles/createTheme";

// Get data from the store redux.
import	{ useAppSelector } from "../Redux/hooks/redux-hooks";

// Transform all href on the theme to link, for Single Page App rules(SPA)
import behaviourLinkOption from "./BehaviourLinkOption";

// Theme Designer must modify this two files
import CustomDarkTheme from "./CustomDarkTheme";
import CustomLightTheme from "./CustomLightTheme";

const	darkTheme = createTheme(
{
	...CustomDarkTheme as ThemeOptions,
	components: behaviourLinkOption.components
});

const	lightTheme = createTheme(
{
	...CustomLightTheme as ThemeOptions,
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
