/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Typography } from "@mui/material";
import { useState } from "react";

type	RightSideProps =
{
	rank: number,
	gamesPlayed: number,
	victories: number,
	defeats: number,
	perfectGame: number
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
			<Typography variant="h4" component="h4">
				STATS
			</Typography>
			<Typography>
				Victories: {props.victories} / {props.gamesPlayed} games played.
			</Typography>
			<Typography>
				{perfect}
			</Typography>
		</>
	);
};

export default RightSide;
