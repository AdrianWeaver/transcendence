import	createTheme from "@mui/material/styles/createTheme";
import	{ useAppSelector } from "../hooks/redux-hooks";

import behaviourLinkOption from "./behaviourLinkOption";

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
