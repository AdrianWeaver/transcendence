/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Avatar, Button, Grid, Typography } from "@mui/material";
import MyAvatar from "./MyAvatar";

type	LeftSideProps =
{
	status: string,
	pseudo: string,
	imageUrl: string | {
		link: string,
		version: {
			large: string,
			medium: string,
			micro: string,
			small: string
		}
	}
	defaultUrl: string
};

const	LeftSide = (props: LeftSideProps) =>
{
	return (
		<>
		<div className="left">
			<Grid container>
				<Grid item xs={12}>
					<MyAvatar
						pseudo={props.pseudo}
						defaultUrl={props.defaultUrl}
						imageUrl={props.imageUrl} />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h6">
						{props.pseudo} is {props.status}
					</Typography>
				</Grid>
			</Grid>
		</div>
		</>
	);
};

export default LeftSide;
