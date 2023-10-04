/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Info } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import Infos from "./Infos";

type	RightSideProps =
{
	rank: number,
	gamesPlayed: number,
	victories: number,
	defeats: number,
	perfectGame: number,
	lastName: string,
	firstName: string
};

const	RightSide = (props: RightSideProps) =>
{
	const
	[
		perfect,
		setPerfect
	] = useState("");

	const
	[
		done,
		setDone
	] = useState("");

	const	perfectPlay = (match: number) =>
	{
		if (done === "done")
			return ;
		if (match > 0)
			setPerfect("Perfect games (7 - 0): " + match);
		setDone("done");
	};

	perfectPlay(props.perfectGame);
	return (
		<>
		<div className="right">
			<Grid container>
				<Grid item sx={6}>
					<Infos
						lastName={props.lastName}
						firstName={props.firstName}
					/>
				</Grid>
				<Grid item sx={6}>
					<Typography variant="h4" component="h4">
						STATS
					</Typography>
					<Typography>
						{props.victories} victories / {props.gamesPlayed} games played.
					</Typography>
					<Typography>
						{perfect}
					</Typography>
				</Grid>
			</Grid>
		</div>
		</>
	);
};

export default RightSide;
