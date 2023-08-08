/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import	GamePadIcon from "@mui/icons-material/Gamepad";
import	Typography from "@mui/material/Typography";
import	displayStyle from "./config/DisplayStyle";
import	fontConfig from "./config/FontConfig";

type	DisplayProps = {
	display: string
};

const	Small = () =>
{
	const	sxDyn = {
		display: displayStyle.mediumHidden,
		mr: 1,
	};
	const	sxDyntitle = {
		...fontConfig,
		display: displayStyle.mediumHidden,
		flexGrow: 1
	};

	return (
		<>
			{/* <GamePadIcon sx={sxDyn}/> */}
			{/* <SvgIcon /> */}
			<Typography sx={sxDyntitle} variant="h5">
				42_transcendence
			</Typography>
		</>
	);
};

const	Medium = () =>
{
	const	sxDyn = {
		display: displayStyle.smallHidden,
		mr: 1
	};
	const	sxDyntitle = {
		...fontConfig,
		display: displayStyle.smallHidden
	};

	return (
		<>
			<GamePadIcon sx={sxDyn}/>
			<Typography sx={sxDyntitle}>
				42_transcendence
			</Typography>
		</>
	);
};

const	IconTitle = (props: DisplayProps) =>
{
	if (props.display === "hidde-small")
		return (
			<Medium />
		);
	else
		return (
			<Small />
		);
};

export default IconTitle;
