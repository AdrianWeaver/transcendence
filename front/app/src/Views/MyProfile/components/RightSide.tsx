/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addUserAsFriend, getAchievements } from "../../../Redux/store/controllerAction";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/redux-hooks";

type	RightSideProps =
{
	profileId: string | undefined;
	isMe: boolean;
	isFriend: boolean;
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
	const	user = useAppSelector((state) =>
	{
		return (state.controller.user);
	});
	const	currentProfile = useAppSelector((state) =>
	{
		return (state.controller.user.chat.currentProfile);
	});
	const	userSelected = user.chat.users.find((elem) =>
	{
		return (elem.profileId === currentProfile);
	});

	const	addAsFriend = () =>
	{
		if (userSelected && !props.isFriend)
			dispatch(addUserAsFriend(userSelected.profileId));
	}

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
				{
					(!props.isFriend)
					? <Button onClick={addAsFriend}>ADD AS FRIEND</Button>
					: <></>
				}
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