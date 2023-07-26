/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { useState } from "react";
import HighlightOffRoundedIcon
	from "@mui/icons-material/HighlightOffRounded";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const	styleEscBox = {
	marginTop: 5,
	marginLeft: 1.6,
	flexDirection: "column",
	display: "flex",
};

const	EscButton = () =>
{
	const
	[
		hoverState,
		setHoverState
	] = useState(false);

	const	handleClick = () =>
	{
		// eslint-disable-next-line no-alert
		window.alert("Clicked");
	};

	const	elemOnHover = (
		<HighlightOffRoundedIcon
			color="primary"
		/>
	);

	const	elemOffHover = (
		<HighlightOffRoundedIcon
			color="disabled"
		/>
	);

	const	elemTypoOn = (
		<Typography color={"text.primary"} >
			Annuler
		</Typography>
	);

	const	elemTypoOff = (
		<Typography color={"text.disabled"} >
			Annuler
		</Typography>
	);

	const	onHover = () =>
	{
		setHoverState(true);
	};

	const	onUnHover = () =>
	{
		setHoverState(false);
	};

	return (
		<>
			<Grid container spacing={0} >
				<Grid item xs={9}>
				</Grid>
				{/* sx={styleEscBox} */}
				<Grid item xs={1}>
					<div
						onClick={handleClick}
						onMouseEnter={onHover}
						onMouseLeave={onUnHover}
					>
						<Grid container spacing={0} sx={styleEscBox}>
							<Grid item xs={6} sx={{marginLeft: 1.6}}>
								{
									(hoverState)
										? elemOnHover
										: elemOffHover
								}
							</Grid>
							<Grid item xs={6} >
								{
									(hoverState)
									? elemTypoOn
									: elemTypoOff
								}
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default EscButton;
