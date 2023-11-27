/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAchievements } from "../../../Redux/store/controllerAction";
import { useAppDispatch } from "../../../Redux/hooks/redux-hooks";

type	RightSideProps =
{
	profileId: string | undefined;
	isMe: boolean;
}

const	RightSide = (props: RightSideProps) =>
{
	const	navigate = useNavigate();
	const	dispatch = useAppDispatch();
	const	displayStats = () =>
	{
		if (props.isMe)
			navigate("/my-stats");
		else
			navigate("/stats");
	};

	const	displayAchievements = () =>
	{
		if (props.isMe)
		{
			dispatch(getAchievements("myself"))
			navigate("/my-achievements");
		}
		else
		{
			if (props.profileId)
				dispatch(getAchievements(props.profileId));
			navigate("/achievements");
		}
	};

	return (
		<>
		<div className="right">
			<Grid container>
				<Grid item xs={12}>
					<Typography>
						___________________
						_________________
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">
						STATS
					</Typography>
					<Button onClick={displayStats}>
						click to see the stats
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Typography>
						___________________
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">
						ACHIEVEMENTS
					</Typography>
					<Button onClick={displayAchievements}>
						click to see the achievements
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Typography>
						_________________
						___________________
					</Typography>
				</Grid>
			</Grid>
		</div>
		</>
	);
};

export default RightSide;
