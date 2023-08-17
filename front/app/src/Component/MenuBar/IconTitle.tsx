
import	Typography from "@mui/material/Typography";
import	displayStyle from "./config/DisplayStyle";
import	fontConfig from "./config/FontConfig";

import { Icon } from "@mui/material";
import icon from "./assets/icon_pure_white.svg";

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
			<Icon
				sx={sxDyn}
			>
				<img src={icon} />
			</Icon>
			{/* <Logo /> */}
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
			<Icon
				sx={sxDyn}
			>
				<img src={icon} />
			</Icon>
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
