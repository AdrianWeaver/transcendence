/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
// import	GamePadIcon from "@mui/icons-material/Gamepad";
import SvgIcon from "@mui/material/SvgIcon";
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
			<SvgIcon sx={sxDyn}>
				<svg version="1.1"
					width="24" height="24r"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="100%" height="100%" fill="red" />
					<circle cx="150" cy="100" r="80" fill="green" />
					<text
						x="4"
						y="4"
						font-size="4"
						text-anchor="middle"
						fill="white"
					>
						SVG
					</text>
				</svg>
			</SvgIcon>
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
			{/* <GamePadIcon sx={sxDyn}/> */}
			<SvgIcon sx={sxDyn}>
				<svg version="1.1"
					width="300" height="200"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="100%" height="100%" fill="red" />
					<circle cx="150" cy="100" r="80" fill="green" />
					<text
						x="150"
						y="125"
						font-size="60"
						text-anchor="middle"
						fill="white"
					>
						SVG
					</text>
				</svg>

			</SvgIcon>
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
